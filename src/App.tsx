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
  const { user, loading } = useAuth();
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('login');
  const [activeTab, setActiveTab] = useState<'invoices' | 'customers' | 'dashboard' | 'profile'>('dashboard');
  const [invoiceView, setInvoiceView] = useState<'list' | 'create' | 'edit' | 'view'>('list');
  const [selectedInvoiceId, setSelectedInvoiceId] = useState<string | null>(null);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600"></div>
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
