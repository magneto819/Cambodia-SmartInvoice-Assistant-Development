import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';
import { FileText, Users, DollarSign, TrendingUp } from 'lucide-react';

interface Stats {
  totalInvoices: number;
  paidInvoices: number;
  totalRevenue: number;
  totalCustomers: number;
}

export function DashboardView() {
  const { user } = useAuth();
  const [stats, setStats] = useState<Stats>({
    totalInvoices: 0,
    paidInvoices: 0,
    totalRevenue: 0,
    totalCustomers: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStats();
  }, [user]);

  const loadStats = async () => {
    if (!user) return;

    try {
      const [invoicesResult, customersResult] = await Promise.all([
        supabase
          .from('invoices')
          .select('status, total')
          .eq('user_id', user.id),
        supabase
          .from('customers')
          .select('id', { count: 'exact', head: true })
          .eq('user_id', user.id),
      ]);

      if (invoicesResult.data) {
        const totalInvoices = invoicesResult.data.length;
        const paidInvoices = invoicesResult.data.filter(inv => inv.status === 'paid').length;
        const totalRevenue = invoicesResult.data
          .filter(inv => inv.status === 'paid')
          .reduce((sum, inv) => sum + Number(inv.total), 0);

        setStats({
          totalInvoices,
          paidInvoices,
          totalRevenue,
          totalCustomers: customersResult.count || 0,
        });
      }
    } catch (error) {
      console.error('Error loading stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    {
      title: 'Total Invoices',
      value: stats.totalInvoices,
      icon: FileText,
      color: 'bg-blue-500',
    },
    {
      title: 'Paid Invoices',
      value: stats.paidInvoices,
      icon: TrendingUp,
      color: 'bg-green-500',
    },
    {
      title: 'Total Revenue',
      value: `$${stats.totalRevenue.toFixed(2)}`,
      icon: DollarSign,
      color: 'bg-amber-500',
    },
    {
      title: 'Total Customers',
      value: stats.totalCustomers,
      icon: Users,
      color: 'bg-indigo-500',
    },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-2">Overview of your invoice management</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((card) => {
          const Icon = card.icon;
          return (
            <div
              key={card.title}
              className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`${card.color} rounded-lg p-3`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
              </div>
              <h3 className="text-gray-600 text-sm font-medium mb-1">{card.title}</h3>
              <p className="text-2xl font-bold text-gray-900">{card.value}</p>
            </div>
          );
        })}
      </div>

      <div className="mt-8 bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Welcome to SmartInvoice</h2>
        <p className="text-gray-600 mb-4">
          Manage your invoices efficiently with our Cambodia-focused invoice assistant. Create professional invoices
          with proper tax calculations compliant with Cambodia regulations.
        </p>
        <div className="grid md:grid-cols-2 gap-4 mt-6">
          <div className="border border-gray-200 rounded-lg p-4">
            <h3 className="font-semibold text-gray-900 mb-2">Quick Start</h3>
            <ul className="text-sm text-gray-600 space-y-2">
              <li>• Add your customers in the Customers tab</li>
              <li>• Create your first invoice in the Invoices tab</li>
              <li>• Export invoices as PDF for sending</li>
            </ul>
          </div>
          <div className="border border-gray-200 rounded-lg p-4">
            <h3 className="font-semibold text-gray-900 mb-2">Features</h3>
            <ul className="text-sm text-gray-600 space-y-2">
              <li>• Cambodia tax compliance (10% VAT)</li>
              <li>• Professional invoice templates</li>
              <li>• Customer management</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
