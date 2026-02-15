import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';
import { useLanguage } from '../../contexts/LanguageContext';
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

interface SupplierProfile {
  full_name: string | null;
  business_name: string | null;
  tax_id: string | null;
  address: string | null;
  phone: string | null;
  email: string | null;
  signature_url: string | null;
}

interface InvoiceViewProps {
  invoiceId: string;
  onBack: () => void;
}

export function InvoiceViewEnhanced({ invoiceId, onBack }: InvoiceViewProps) {
  const { user } = useAuth();
  const { t, language } = useLanguage();
  const [invoice, setInvoice] = useState<InvoiceData | null>(null);
  const [supplier, setSupplier] = useState<SupplierProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadInvoiceAndSupplier();
  }, [invoiceId]);

  const loadInvoiceAndSupplier = async () => {
    try {
      const [invoiceResult, supplierResult] = await Promise.all([
        supabase
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
          .single(),
        user ? supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .maybeSingle() : null,
      ]);

      if (invoiceResult.data) {
        const { data: items } = await supabase
          .from('invoice_items')
          .select('*')
          .eq('invoice_id', invoiceId);

        setInvoice({
          ...invoiceResult.data,
          customer: invoiceResult.data.customers as any,
          items: items || [],
        });
      }

      if (supplierResult?.data) {
        setSupplier(supplierResult.data);
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

  const getStatusBadge = (status: string) => {
    const badges = {
      paid: { km: 'បានបង់', en: 'Paid', zh: '已付款', color: 'bg-green-100 text-green-800' },
      sent: { km: 'បានផ្ញើ', en: 'Sent', zh: '已发送', color: 'bg-blue-100 text-blue-800' },
      draft: { km: 'សេចក្តីព្រាង', en: 'Draft', zh: '草稿', color: 'bg-gray-100 text-gray-800' },
      cancelled: { km: 'បានលុបចោល', en: 'Cancelled', zh: '已取消', color: 'bg-red-100 text-red-800' },
    };
    const badge = badges[status as keyof typeof badges] || badges.draft;
    return { text: badge[language], color: badge.color };
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

  const statusBadge = getStatusBadge(invoice.status);

  return (
    <div>
      <div className="mb-6 flex items-center justify-between print:hidden">
        <button
          onClick={onBack}
          className="flex items-center text-gray-600 hover:text-gray-900"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          {t('backToInvoices')}
        </button>
        <button
          onClick={handlePrint}
          className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all"
        >
          <Download className="w-5 h-5 mr-2" />
          {t('printSavePdf')}
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 print:shadow-none print:border-0">
        <div className="mb-8 text-center border-b-2 border-gray-300 pb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-1">វិក្កយបត្រ / {t('invoice')}</h1>
          <p className="text-xl text-blue-600 font-semibold">{invoice.invoice_number}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          <div>
            <h3 className="text-sm font-bold text-gray-500 uppercase mb-3 border-b pb-2">
              អ្នកផ្គត់ផ្គង់ / {t('supplier')}
            </h3>
            <div className="text-gray-900 space-y-1">
              {supplier?.full_name && (
                <p className="font-semibold text-lg">{supplier.full_name}</p>
              )}
              {supplier?.business_name && (
                <p className="text-sm text-gray-600">{supplier.business_name}</p>
              )}
              {supplier?.tax_id && (
                <p className="text-sm">
                  <span className="font-medium">TIN:</span> {supplier.tax_id}
                </p>
              )}
              {supplier?.address && (
                <p className="text-sm text-gray-600">{supplier.address}</p>
              )}
              {supplier?.phone && (
                <p className="text-sm">
                  <span className="font-medium">Tel:</span> {supplier.phone}
                </p>
              )}
              {supplier?.email && (
                <p className="text-sm">
                  <span className="font-medium">Email:</span> {supplier.email}
                </p>
              )}
            </div>
          </div>

          <div>
            <h3 className="text-sm font-bold text-gray-500 uppercase mb-3 border-b pb-2">
              អតិថិជន / {t('billTo')}
            </h3>
            <div className="text-gray-900 space-y-1">
              <p className="font-semibold text-lg">{invoice.customer.name}</p>
              {invoice.customer.tax_id && (
                <p className="text-sm">
                  <span className="font-medium">TIN:</span> {invoice.customer.tax_id}
                </p>
              )}
              {invoice.customer.address && (
                <p className="text-sm text-gray-600">{invoice.customer.address}</p>
              )}
              {invoice.customer.phone && (
                <p className="text-sm">
                  <span className="font-medium">Tel:</span> {invoice.customer.phone}
                </p>
              )}
              {invoice.customer.email && (
                <p className="text-sm">
                  <span className="font-medium">Email:</span> {invoice.customer.email}
                </p>
              )}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8 bg-gray-50 p-4 rounded-lg">
          <div>
            <p className="text-xs text-gray-500 mb-1">កាលបរិច្ឆេទចេញ / {t('issueDate')}</p>
            <p className="font-semibold text-gray-900">
              {new Date(invoice.issue_date).toLocaleDateString()}
            </p>
          </div>
          <div>
            <p className="text-xs text-gray-500 mb-1">កាលបរិច្ឆេទផុតកំណត់ / {t('dueDate')}</p>
            <p className="font-semibold text-gray-900">
              {new Date(invoice.due_date).toLocaleDateString()}
            </p>
          </div>
          <div className="md:col-span-2">
            <p className="text-xs text-gray-500 mb-1">ស្ថានភាព / {t('status')}</p>
            <span className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${statusBadge.color}`}>
              {statusBadge.text}
            </span>
          </div>
        </div>

        <div className="mb-8">
          <table className="w-full">
            <thead>
              <tr className="border-b-2 border-gray-300">
                <th className="text-left py-3 px-2 font-bold text-gray-700 text-sm">
                  ការពិពណ៌នា / {t('description')}
                </th>
                <th className="text-right py-3 px-2 font-bold text-gray-700 text-sm">
                  បរិមាណ / {t('quantity')}
                </th>
                <th className="text-right py-3 px-2 font-bold text-gray-700 text-sm">
                  តម្លៃឯកតា / {t('unitPrice')}
                </th>
                <th className="text-right py-3 px-2 font-bold text-gray-700 text-sm">
                  ចំនួនទឹកប្រាក់ / {t('amount')}
                </th>
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
          <div className="w-full md:w-96 space-y-3">
            <div className="flex justify-between py-2 border-b border-gray-200">
              <span className="text-gray-600">សរុបរង / {t('subtotal')}:</span>
              <span className="font-semibold text-gray-900">
                ${Number(invoice.subtotal).toFixed(2)}
              </span>
            </div>
            <div className="flex justify-between py-2 border-b border-gray-200">
              <span className="text-gray-600">ពន្ធ VAT ({invoice.tax_rate}%):</span>
              <span className="font-semibold text-gray-900">
                ${Number(invoice.tax_amount).toFixed(2)}
              </span>
            </div>
            <div className="flex justify-between py-3 bg-gray-50 px-4 rounded-lg">
              <span className="text-lg font-bold text-gray-900">សរុប / {t('total')}:</span>
              <span className="text-lg font-bold text-blue-600">
                ${Number(invoice.total).toFixed(2)}
              </span>
            </div>
            <p className="text-xs text-gray-500 text-right italic">
              Total amount inclusive of all taxes
            </p>
          </div>
        </div>

        {invoice.notes && (
          <div className="border-t pt-6 mb-6">
            <h3 className="text-sm font-bold text-gray-500 uppercase mb-2">
              កំណត់ចំណាំ / {t('notes')}:
            </h3>
            <p className="text-gray-700 whitespace-pre-wrap">{invoice.notes}</p>
          </div>
        )}

        {supplier?.signature_url && (
          <div className="border-t pt-6 mb-6">
            <h3 className="text-sm font-bold text-gray-500 uppercase mb-3">
              ហត្ថលេខា / {t('signature')}:
            </h3>
            <img
              src={supplier.signature_url}
              alt="Signature"
              className="h-16 object-contain"
            />
            {supplier.full_name && (
              <p className="text-sm text-gray-600 mt-2">{supplier.full_name}</p>
            )}
          </div>
        )}

        <div className="mt-12 pt-6 border-t text-center text-sm text-gray-500">
          <p className="font-medium">សូមអរគុណ! / {t('thankYou')}</p>
          <p className="mt-2 text-xs">{t('generatedBy')}</p>
        </div>
      </div>
    </div>
  );
}
