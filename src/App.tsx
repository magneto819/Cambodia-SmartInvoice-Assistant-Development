import { useState } from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { LanguageProvider } from './contexts/LanguageContext';
import { LoginForm } from './components/Auth/LoginForm';
import { SignUpForm } from './components/Auth/SignUpForm';
import { DashboardLayout } from './components/Layout/DashboardLayout';
import { DashboardView } from './components/Dashboard/DashboardView';
import { InvoiceList } from './components/Invoices/InvoiceList';
import { InvoiceForm } from './components/Invoices/InvoiceForm';
import { InvoiceViewEnhanced } from './components/Invoices/InvoiceViewEnhanced';
import { CustomerList } from './components/Customers/CustomerList';
import { BusinessProfile } from './components/Profile/BusinessProfile';

function AppContent() {
  const { user, loading, error } = useAuth();
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('login');
  const [activeTab, setActiveTab] = useState<'invoices' | 'customers' | 'dashboard' | 'profile'>('dashboard');
  const [invoiceView, setInvoiceView] = useState<'list' | 'create' | 'edit' | 'view'>('list');
  const [selectedInvoiceId, setSelectedInvoiceId] = useState<string | null>(null);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-xl p-8 max-w-md w-full">
          <div className="text-red-600 mb-4">
            <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-2 text-center">Configuration Error</h2>
          <p className="text-gray-600 text-center mb-4">{error}</p>
          <p className="text-sm text-gray-500 text-center">Please check your environment variables and refresh the page.</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return authMode === 'login' ? (
      <LoginForm onToggle={() => setAuthMode('signup')} />
    ) : (
      <SignUpForm onToggle={() => setAuthMode('login')} />
    );
  }

  const handleCreateInvoice = () => {
    setSelectedInvoiceId(null);
    setInvoiceView('create');
  };

  const handleEditInvoice = (id: string) => {
    setSelectedInvoiceId(id);
    setInvoiceView('edit');
  };

  const handleViewInvoice = (id: string) => {
    setSelectedInvoiceId(id);
    setInvoiceView('view');
  };

  const handleBackToList = () => {
    setSelectedInvoiceId(null);
    setInvoiceView('list');
  };

  const renderContent = () => {
    if (activeTab === 'dashboard') {
      return <DashboardView />;
    }

    if (activeTab === 'customers') {
      return <CustomerList />;
    }

    if (activeTab === 'profile') {
      return <BusinessProfile />;
    }

    if (activeTab === 'invoices') {
      if (invoiceView === 'create' || invoiceView === 'edit') {
        return (
          <InvoiceForm
            invoiceId={selectedInvoiceId || undefined}
            onBack={handleBackToList}
            onSave={handleBackToList}
          />
        );
      }

      if (invoiceView === 'view' && selectedInvoiceId) {
        return (
          <InvoiceViewEnhanced
            invoiceId={selectedInvoiceId}
            onBack={handleBackToList}
          />
        );
      }

      return (
        <InvoiceList
          onCreateNew={handleCreateInvoice}
          onEdit={handleEditInvoice}
          onView={handleViewInvoice}
        />
      );
    }
  };

  return (
    <DashboardLayout activeTab={activeTab} onTabChange={(tab) => {
      setActiveTab(tab);
      setInvoiceView('list');
      setSelectedInvoiceId(null);
    }}>
      {renderContent()}
    </DashboardLayout>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <LanguageProvider>
        <AppContent />
      </LanguageProvider>
    </AuthProvider>
  );
}
