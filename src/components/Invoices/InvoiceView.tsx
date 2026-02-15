import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import { ArrowLeft, Download } from 'lucide-react';

interface InvoiceData {
  invoice_number: string;
  issue_date: string;
  due_date: string;
  status: string;
  subtotal: number;
  tax_rate: number;
  tax_amount: number;
  total: number;
  notes: string | null;
  customer: {
    name: string;
    tax_id: string | null;
    address: string | null;
    phone: string | null;
    email: string | null;
  };
  items: Array<{
    description: string;
    quantity: number;
    unit_price: number;
    amount: number;
  }>;
}

interface InvoiceViewProps {
  invoiceId: string;
  onBack: () => void;
}

export function InvoiceView({ invoiceId, onBack }: InvoiceViewProps) {
  const [invoice, setInvoice] = useState<InvoiceData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadInvoice();
  }, [invoiceId]);

  const loadInvoice = async () => {
    try {
      const { data: invoiceData } = await supabase
        .from('invoices')
        .select(`
          *,
          customers (
            name,
            tax_id,
            address,
            phone,
            email
          )
        `)
        .eq('id', invoiceId)
        .single();

      if (invoiceData) {
        const { data: items } = await supabase
          .from('invoice_items')
          .select('*')
          .eq('invoice_id', invoiceId);

        setInvoice({
          ...invoiceData,
          customer: invoiceData.customers as any,
          items: items || [],
        });
      }
    } catch (error) {
      console.error('Error loading invoice:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!invoice) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600">Invoice not found</p>
        <button onClick={onBack} className="mt-4 text-blue-600 hover:text-blue-700">
          Go back
        </button>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6 flex items-center justify-between print:hidden">
        <button
          onClick={onBack}
          className="flex items-center text-gray-600 hover:text-gray-900"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          Back to Invoices
        </button>
        <button
          onClick={handlePrint}
          className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all"
        >
          <Download className="w-5 h-5 mr-2" />
          Print / Save PDF
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 print:shadow-none print:border-0">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">INVOICE</h1>
          <p className="text-xl text-blue-600 font-semibold">{invoice.invoice_number}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          <div>
            <h3 className="text-sm font-semibold text-gray-500 uppercase mb-2">Bill To:</h3>
            <div className="text-gray-900">
              <p className="font-semibold text-lg">{invoice.customer.name}</p>
              {invoice.customer.tax_id && (
                <p className="text-sm text-gray-600">Tax ID: {invoice.customer.tax_id}</p>
              )}
              {invoice.customer.address && (
                <p className="text-sm text-gray-600">{invoice.customer.address}</p>
              )}
              {invoice.customer.phone && (
                <p className="text-sm text-gray-600">Phone: {invoice.customer.phone}</p>
              )}
              {invoice.customer.email && (
                <p className="text-sm text-gray-600">Email: {invoice.customer.email}</p>
              )}
            </div>
          </div>

          <div className="text-left md:text-right">
            <div className="space-y-2">
              <div>
                <span className="text-sm font-semibold text-gray-500">Issue Date: </span>
                <span className="text-gray-900">
                  {new Date(invoice.issue_date).toLocaleDateString()}
                </span>
              </div>
              <div>
                <span className="text-sm font-semibold text-gray-500">Due Date: </span>
                <span className="text-gray-900">
                  {new Date(invoice.due_date).toLocaleDateString()}
                </span>
              </div>
              <div>
                <span className="text-sm font-semibold text-gray-500">Status: </span>
                <span className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${
                  invoice.status === 'paid' ? 'bg-green-100 text-green-800' :
                  invoice.status === 'sent' ? 'bg-blue-100 text-blue-800' :
                  invoice.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                  'bg-gray-100 text-gray-800'
                }`}>
                  {invoice.status.charAt(0).toUpperCase() + invoice.status.slice(1)}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="mb-8">
          <table className="w-full">
            <thead>
              <tr className="border-b-2 border-gray-300">
                <th className="text-left py-3 px-2 font-semibold text-gray-700">Description</th>
                <th className="text-right py-3 px-2 font-semibold text-gray-700">Quantity</th>
                <th className="text-right py-3 px-2 font-semibold text-gray-700">Unit Price</th>
                <th className="text-right py-3 px-2 font-semibold text-gray-700">Amount</th>
              </tr>
            </thead>
            <tbody>
              {invoice.items.map((item, index) => (
                <tr key={index} className="border-b border-gray-200">
                  <td className="py-3 px-2 text-gray-900">{item.description}</td>
                  <td className="py-3 px-2 text-right text-gray-900">{item.quantity}</td>
                  <td className="py-3 px-2 text-right text-gray-900">
                    ${Number(item.unit_price).toFixed(2)}
                  </td>
                  <td className="py-3 px-2 text-right font-semibold text-gray-900">
                    ${Number(item.amount).toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="flex justify-end mb-8">
          <div className="w-full md:w-80 space-y-3">
            <div className="flex justify-between py-2">
              <span className="text-gray-600">Subtotal:</span>
              <span className="font-semibold text-gray-900">
                ${Number(invoice.subtotal).toFixed(2)}
              </span>
            </div>
            <div className="flex justify-between py-2">
              <span className="text-gray-600">Tax ({invoice.tax_rate}%):</span>
              <span className="font-semibold text-gray-900">
                ${Number(invoice.tax_amount).toFixed(2)}
              </span>
            </div>
            <div className="flex justify-between py-3 border-t-2 border-gray-300">
              <span className="text-lg font-bold text-gray-900">Total:</span>
              <span className="text-lg font-bold text-gray-900">
                ${Number(invoice.total).toFixed(2)}
              </span>
            </div>
          </div>
        </div>

        {invoice.notes && (
          <div className="border-t pt-6">
            <h3 className="text-sm font-semibold text-gray-500 uppercase mb-2">Notes:</h3>
            <p className="text-gray-700 whitespace-pre-wrap">{invoice.notes}</p>
          </div>
        )}

        <div className="mt-12 pt-6 border-t text-center text-sm text-gray-500">
          <p>Thank you for your business!</p>
          <p className="mt-2">This invoice was generated by SmartInvoice - Cambodia Invoice Assistant</p>
        </div>
      </div>
    </div>
  );
}
