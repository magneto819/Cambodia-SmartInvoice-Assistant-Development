import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';
import { useLanguage } from '../../contexts/LanguageContext';
import { Building2, Save } from 'lucide-react';

export function BusinessProfile() {
  const { user } = useAuth();
  const { t } = useLanguage();
  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(true);
  const [formData, setFormData] = useState({
    full_name: '',
    business_name: '',
    tax_id: '',
    address: '',
    phone: '',
    email: '',
    signature_url: '',
  });

  useEffect(() => {
    loadProfile();
  }, [user]);

  const loadProfile = async () => {
    if (!user) return;

    try {
      const { data } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .maybeSingle();

      if (data) {
        setFormData({
          full_name: data.full_name || '',
          business_name: data.business_name || '',
          tax_id: data.tax_id || '',
          address: data.address || '',
          phone: data.phone || '',
          email: data.email || user.email || '',
          signature_url: data.signature_url || '',
        });
      } else {
        setFormData(prev => ({ ...prev, email: user.email || '' }));
      }
    } catch (error) {
      console.error('Error loading profile:', error);
    } finally {
      setLoadingData(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setLoading(true);

    try {
      const { error } = await supabase
        .from('profiles')
        .upsert({
          id: user.id,
          full_name: formData.full_name,
          business_name: formData.business_name,
          tax_id: formData.tax_id,
          address: formData.address,
          phone: formData.phone,
          email: formData.email,
          signature_url: formData.signature_url,
        });

      if (error) throw error;
      alert('Profile updated successfully!');
    } catch (error) {
      console.error('Error saving profile:', error);
      alert('Failed to save profile');
    } finally {
      setLoading(false);
    }
  };

  if (loadingData) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6">
        <div className="flex items-center mb-2">
          <Building2 className="w-8 h-8 text-blue-600 mr-3" />
          <h1 className="text-3xl font-bold text-gray-900">{t('supplierInfo')}</h1>
        </div>
        <p className="text-gray-600 ml-11">
          Configure your business information for invoices
        </p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 max-w-3xl">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t('supplierName')} *
              </label>
              <input
                type="text"
                value={formData.full_name}
                onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t('businessName')}
              </label>
              <input
                type="text"
                value={formData.business_name}
                onChange={(e) => setFormData({ ...formData, business_name: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t('supplierTIN')} *
              </label>
              <input
                type="text"
                value={formData.tax_id}
                onChange={(e) => setFormData({ ...formData, tax_id: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
                placeholder="Tax Identification Number"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t('phone')}
              </label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t('email')}
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t('supplierAddress')} *
              </label>
              <textarea
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                rows={3}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t('signature')} (URL)
              </label>
              <input
                type="url"
                value={formData.signature_url}
                onChange={(e) => setFormData({ ...formData, signature_url: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="https://example.com/signature.png"
              />
              <p className="mt-2 text-sm text-gray-500">
                Optional: Enter a URL to your signature image for invoices
              </p>
            </div>
          </div>

          <div className="border-t pt-6">
            <button
              type="submit"
              disabled={loading}
              className="flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed font-medium"
            >
              <Save className="w-5 h-5 mr-2" />
              {loading ? t('saving') : t('save')}
            </button>
          </div>
        </form>
      </div>

      <div className="mt-6 bg-blue-50 border border-blue-200 rounded-xl p-6 max-w-3xl">
        <h3 className="font-semibold text-blue-900 mb-2">Cambodia Invoice Requirements</h3>
        <ul className="text-sm text-blue-800 space-y-1">
          <li>• Supplier name, address, and TIN are required on all invoices</li>
          <li>• Invoices must be in Khmer language (bilingual allowed with Khmer first)</li>
          <li>• 10% VAT (Value Added Tax) is standard in Cambodia</li>
          <li>• Optional: Add your signature for official documents</li>
        </ul>
      </div>
    </div>
  );
}
