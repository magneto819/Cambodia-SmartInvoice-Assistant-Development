import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';
import { useLanguage } from '../../contexts/LanguageContext';
import { Plus, Trash2, ArrowLeft } from 'lucide-react';
import { QuickCustomerModal } from '../Customers/QuickCustomerModal';

interface Customer {
  id: string;
  name: string;
}

interface InvoiceItem {
  id?: string;
  description: string;
  quantity: number;
  unit_price: number;
  amount: number;
}

interface InvoiceFormProps {
  invoiceId?: string;
  onBack: () => void;
  onSave: () => void;
}

export function InvoiceForm({ invoiceId, onBack, onSave }: InvoiceFormProps) {
  const { user } = useAuth();
  const { t } = useLanguage();
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(false);
  const [showCustomerModal, setShowCustomerModal] = useState(false);
  const [formData, setFormData] = useState({
    customer_id: '',
    invoice_number: '',
    issue_date: new Date().toISOString().split('T')[0],
    due_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    status: 'draft' as 'draft' | 'sent' | 'paid' | 'cancelled',
    tax_rate: 10,
    notes: '',
  });
  const [items, setItems] = useState<InvoiceItem[]>([
    { description: '', quantity: 1, unit_price: 0, amount: 0 },
  ]);

  useEffect(() => {
    loadCustomers();
    if (invoiceId) {
      loadInvoice();
    } else {
      generateInvoiceNumber();
    }
  }, [invoiceId, user]);

  const loadCustomers = async () => {
    if (!user) return;

    const { data } = await supabase
      .from('customers')
      .select('id, name')
      .eq('user_id', user.id)
      .order('name');

    if (data) setCustomers(data);
  };

  const generateInvoiceNumber = async () => {
    if (!user) return;

    const { data } = await supabase
      .from('invoices')
      .select('invoice_number')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(1);

    const lastNumber = data?.[0]?.invoice_number?.match(/\d+$/)?.[0];
    const nextNumber = lastNumber ? parseInt(lastNumber) + 1 : 1;
    const newInvoiceNumber = `INV-${String(nextNumber).padStart(5, '0')}`;

    setFormData(prev => ({ ...prev, invoice_number: newInvoiceNumber }));
  };

  const loadInvoice = async () => {
    if (!invoiceId || !user) return;

    const { data: invoice } = await supabase
      .from('invoices')
      .select('*')
      .eq('id', invoiceId)
      .eq('user_id', user.id)
      .single();

    if (invoice) {
      setFormData({
        customer_id: invoice.customer_id,
        invoice_number: invoice.invoice_number,
        issue_date: invoice.issue_date,
        due_date: invoice.due_date,
        status: invoice.status,
        tax_rate: Number(invoice.tax_rate),
        notes: invoice.notes || '',
      });

      const { data: invoiceItems } = await supabase
        .from('invoice_items')
        .select('*')
        .eq('invoice_id', invoiceId);

      if (invoiceItems && invoiceItems.length > 0) {
        setItems(invoiceItems.map(item => ({
          id: item.id,
          description: item.description,
          quantity: Number(item.quantity),
          unit_price: Number(item.unit_price),
          amount: Number(item.amount),
        })));
      }
    }
  };

  const addItem = () => {
    setItems([...items, { description: '', quantity: 1, unit_price: 0, amount: 0 }]);
  };

  const removeItem = (index: number) => {
    if (items.length > 1) {
      setItems(items.filter((_, i) => i !== index));
    }
  };

  const updateItem = (index: number, field: keyof InvoiceItem, value: string | number) => {
    const newItems = [...items];
    newItems[index] = { ...newItems[index], [field]: value };

    if (field === 'quantity' || field === 'unit_price') {
      newItems[index].amount = newItems[index].quantity * newItems[index].unit_price;
    }

    setItems(newItems);
  };

  const calculateTotals = () => {
    const subtotal = items.reduce((sum, item) => sum + item.amount, 0);
    const tax_amount = (subtotal * formData.tax_rate) / 100;
    const total = subtotal + tax_amount;
    return { subtotal, tax_amount, total };
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    if (!formData.customer_id) {
      alert('Please select a customer');
      return;
    }

    if (items.some(item => !item.description)) {
      alert('Please fill in all item descriptions');
      return;
    }

    setLoading(true);

    try {
      const { subtotal, tax_amount, total } = calculateTotals();

      if (invoiceId) {
        const { error: updateError } = await supabase
          .from('invoices')
          .update({
            customer_id: formData.customer_id,
            invoice_number: formData.invoice_number,
            issue_date: formData.issue_date,
            due_date: formData.due_date,
            status: formData.status,
            subtotal,
            tax_rate: formData.tax_rate,
            tax_amount,
            total,
            notes: formData.notes,
          })
          .eq('id', invoiceId);

        if (updateError) throw updateError;

        await supabase
          .from('invoice_items')
          .delete()
          .eq('invoice_id', invoiceId);

        const { error: itemsError } = await supabase
          .from('invoice_items')
          .insert(
            items.map(item => ({
              invoice_id: invoiceId,
              description: item.description,
              quantity: item.quantity,
              unit_price: item.unit_price,
              amount: item.amount,
            }))
          );

        if (itemsError) throw itemsError;
      } else {
        const { data: invoice, error: insertError } = await supabase
          .from('invoices')
          .insert({
            user_id: user.id,
            customer_id: formData.customer_id,
            invoice_number: formData.invoice_number,
            issue_date: formData.issue_date,
            due_date: formData.due_date,
            status: formData.status,
            subtotal,
            tax_rate: formData.tax_rate,
            tax_amount,
            total,
            notes: formData.notes,
          })
          .select()
          .single();

        if (insertError) throw insertError;

        const { error: itemsError } = await supabase
          .from('invoice_items')
          .insert(
            items.map(item => ({
              invoice_id: invoice.id,
              description: item.description,
              quantity: item.quantity,
              unit_price: item.unit_price,
              amount: item.amount,
            }))
          );

        if (itemsError) throw itemsError;
      }

      onSave();
    } catch (error) {
      console.error('Error saving invoice:', error);
      alert('Failed to save invoice');
    } finally {
      setLoading(false);
    }
  };

  const handleCustomerCreated = (customerId: string) => {
    setFormData({ ...formData, customer_id: customerId });
    setShowCustomerModal(false);
    loadCustomers();
  };

  const { subtotal, tax_amount, total } = calculateTotals();

  return (
    <div>
      {showCustomerModal && (
        <QuickCustomerModal
          onClose={() => setShowCustomerModal(false)}
          onCustomerCreated={handleCustomerCreated}
        />
      )}

      <button
        onClick={onBack}
        className="flex items-center text-gray-600 hover:text-gray-900 mb-6"
      >
        <ArrowLeft className="w-5 h-5 mr-2" />
        {t('backToInvoices')}
      </button>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">
          {invoiceId ? t('editInvoice') : t('newInvoice')}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t('customer')} *
              </label>
              <div className="flex gap-2">
                <select
                  value={formData.customer_id}
                  onChange={(e) => {
                    if (e.target.value === '__add_new__') {
                      setShowCustomerModal(true);
                      e.target.value = formData.customer_id;
                    } else {
                      setFormData({ ...formData, customer_id: e.target.value });
                    }
                  }}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                >
                  <option value="">{t('selectCustomer')}</option>
                  <option value="__add_new__" className="text-blue-600 font-medium">
                    {t('addNewCustomer')}
                  </option>
                  {customers.map((customer) => (
                    <option key={customer.id} value={customer.id}>
                      {customer.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Invoice Number *
              </label>
              <input
                type="text"
                value={formData.invoice_number}
                onChange={(e) => setFormData({ ...formData, invoice_number: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Issue Date *
              </label>
              <input
                type="date"
                value={formData.issue_date}
                onChange={(e) => setFormData({ ...formData, issue_date: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Due Date *
              </label>
              <input
                type="date"
                value={formData.due_date}
                onChange={(e) => setFormData({ ...formData, due_date: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Status *
              </label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              >
                <option value="draft">Draft</option>
                <option value="sent">Sent</option>
                <option value="paid">Paid</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tax Rate (%)
              </label>
              <input
                type="number"
                value={formData.tax_rate}
                onChange={(e) => setFormData({ ...formData, tax_rate: Number(e.target.value) })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                min="0"
                step="0.01"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-4">
              <label className="block text-sm font-medium text-gray-700">
                Items *
              </label>
              <button
                type="button"
                onClick={addItem}
                className="flex items-center text-sm text-blue-600 hover:text-blue-700"
              >
                <Plus className="w-4 h-4 mr-1" />
                Add Item
              </button>
            </div>

            <div className="space-y-4">
              {items.map((item, index) => (
                <div key={index} className="flex gap-4 items-start">
                  <div className="flex-1">
                    <input
                      type="text"
                      placeholder="Description"
                      value={item.description}
                      onChange={(e) => updateItem(index, 'description', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    />
                  </div>
                  <div className="w-24">
                    <input
                      type="number"
                      placeholder="Qty"
                      value={item.quantity}
                      onChange={(e) => updateItem(index, 'quantity', Number(e.target.value))}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      min="0"
                      step="0.01"
                      required
                    />
                  </div>
                  <div className="w-32">
                    <input
                      type="number"
                      placeholder="Unit Price"
                      value={item.unit_price}
                      onChange={(e) => updateItem(index, 'unit_price', Number(e.target.value))}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      min="0"
                      step="0.01"
                      required
                    />
                  </div>
                  <div className="w-32">
                    <input
                      type="text"
                      value={`$${item.amount.toFixed(2)}`}
                      readOnly
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => removeItem(index)}
                    disabled={items.length === 1}
                    className="p-2 text-red-600 hover:text-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="border-t pt-4">
            <div className="flex justify-end">
              <div className="w-64 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Subtotal:</span>
                  <span className="font-medium">${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Tax ({formData.tax_rate}%):</span>
                  <span className="font-medium">${tax_amount.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-lg font-bold border-t pt-2">
                  <span>Total:</span>
                  <span>${total.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Notes
            </label>
            <textarea
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              rows={3}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Additional notes..."
            />
          </div>

          <div className="flex gap-4">
            <button
              type="button"
              onClick={onBack}
              className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Saving...' : invoiceId ? 'Update Invoice' : 'Create Invoice'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
