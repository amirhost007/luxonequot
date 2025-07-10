import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAdmin } from '../../context/AdminContext';
import FormFieldManager from './FormFieldManager';
import PDFTemplateManager from './PDFTemplateManager';
import EmailSetupGuide from '../common/EmailSetupGuide';
import CostManagement from './CostManagement';
import { 
  Settings, 
  Users, 
  FileText, 
  DollarSign, 
  Phone, 
  Mail, 
  Globe,
  Save,
  Eye,
  Edit,
  Trash2,
  Download,
  MessageCircle,
  ArrowLeft,
  FormInput,
  Palette,
  Database,
  BarChart3,
  LogOut,
  Zap
} from 'lucide-react';

const AdminPanel: React.FC = () => {
  const { settings, updateSettings, quotes, setIsAdminMode } = useAdmin();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('settings');
  const [editingSettings, setEditingSettings] = useState(false);
  const [tempSettings, setTempSettings] = useState(settings);

  const handleSaveSettings = () => {
    updateSettings(tempSettings);
    setEditingSettings(false);
  };

  const handleCancelEdit = () => {
    setTempSettings(settings);
    setEditingSettings(false);
  };

  const tabs = [
    { id: 'settings', label: 'Company Settings', icon: Settings },
    { id: 'cost-management', label: 'Cost Management', icon: DollarSign },
    { id: 'form-fields', label: 'Form Fields', icon: FormInput },
    { id: 'pdf-templates', label: 'PDF Templates', icon: Palette },
    { id: 'email-setup', label: 'Email Setup', icon: Zap },
    { id: 'quotes', label: 'Quote Requests', icon: FileText },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    { id: 'database', label: 'Data Export', icon: Database }
  ];

  const exportQuotesData = () => {
    const dataStr = JSON.stringify(quotes, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const exportFileDefaultName = `luxone_quotes_${new Date().toISOString().slice(0, 10)}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  const exportSettingsData = () => {
    const dataStr = JSON.stringify(settings, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const exportFileDefaultName = `luxone_settings_${new Date().toISOString().slice(0, 10)}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  const handleLogout = () => {
    setIsAdminMode(false);
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">L</span>
              </div>
              <h1 className="text-2xl font-bold text-gray-900">Luxone Admin Panel</h1>
            </div>
            <div className="flex items-center space-x-3">
              <button
                onClick={() => navigate('/')}
                className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors"
              >
                <ArrowLeft size={20} />
                <span>Back to Quotation</span>
              </button>
              <div className="h-6 w-px bg-gray-300"></div>
              <button
                onClick={handleLogout}
                className="flex items-center space-x-2 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
              >
                <LogOut size={16} />
                <span>Logout</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex space-x-8">
          {/* Sidebar */}
          <div className="w-64 flex-shrink-0">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <nav className="space-y-2">
                {tabs.map((tab) => {
                  const Icon = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-colors ${
                        activeTab === tab.id
                          ? 'bg-blue-50 text-blue-700 border border-blue-200'
                          : 'text-gray-600 hover:bg-gray-50'
                      }`}
                    >
                      <Icon size={20} />
                      <span className="font-medium">{tab.label}</span>
                    </button>
                  );
                })}
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {activeTab === 'settings' && (
              <div className="space-y-6">
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-bold text-gray-900">Company Settings</h2>
                    {!editingSettings ? (
                      <button
                        onClick={() => setEditingSettings(true)}
                        className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                      >
                        <Edit size={16} />
                        <span>Edit Settings</span>
                      </button>
                    ) : (
                      <div className="flex space-x-2">
                        <button
                          onClick={handleSaveSettings}
                          className="flex items-center space-x-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
                        >
                          <Save size={16} />
                          <span>Save</span>
                        </button>
                        <button
                          onClick={handleCancelEdit}
                          className="flex items-center space-x-2 bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700"
                        >
                          <span>Cancel</span>
                        </button>
                      </div>
                    )}
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    {/* Company Information */}
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold text-gray-900 border-b border-gray-200 pb-2">
                        Company Information
                      </h3>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Company Name
                        </label>
                        <input
                          type="text"
                          value={tempSettings.companyName}
                          onChange={(e) => setTempSettings({...tempSettings, companyName: e.target.value})}
                          disabled={!editingSettings}
                          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-50"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Website
                        </label>
                        <input
                          type="text"
                          value={tempSettings.website}
                          onChange={(e) => setTempSettings({...tempSettings, website: e.target.value})}
                          disabled={!editingSettings}
                          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-50"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Company Address
                        </label>
                        <textarea
                          value={tempSettings.address}
                          onChange={(e) => setTempSettings({...tempSettings, address: e.target.value})}
                          disabled={!editingSettings}
                          rows={3}
                          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-50"
                        />
                      </div>
                    </div>

                    {/* Contact Information */}
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold text-gray-900 border-b border-gray-200 pb-2">
                        Contact Information
                      </h3>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          WhatsApp India
                        </label>
                        <input
                          type="text"
                          value={tempSettings.whatsappIndia}
                          onChange={(e) => setTempSettings({...tempSettings, whatsappIndia: e.target.value})}
                          disabled={!editingSettings}
                          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-50"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          WhatsApp UAE
                        </label>
                        <input
                          type="text"
                          value={tempSettings.whatsappUAE}
                          onChange={(e) => setTempSettings({...tempSettings, whatsappUAE: e.target.value})}
                          disabled={!editingSettings}
                          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-50"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Admin Email
                        </label>
                        <input
                          type="email"
                          value={tempSettings.adminEmail}
                          onChange={(e) => setTempSettings({...tempSettings, adminEmail: e.target.value})}
                          disabled={!editingSettings}
                          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-50"
                        />
                      </div>
                    </div>

                    {/* Pricing Settings */}
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold text-gray-900 border-b border-gray-200 pb-2">
                        Pricing Settings
                      </h3>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Price per Sqft (AED)
                        </label>
                        <input
                          type="number"
                          value={tempSettings.pricePerSqft}
                          onChange={(e) => setTempSettings({...tempSettings, pricePerSqft: parseFloat(e.target.value)})}
                          disabled={!editingSettings}
                          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-50"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          AED to USD Rate
                        </label>
                        <input
                          type="number"
                          step="0.01"
                          value={tempSettings.aedToUsdRate}
                          onChange={(e) => setTempSettings({...tempSettings, aedToUsdRate: parseFloat(e.target.value)})}
                          disabled={!editingSettings}
                          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-50"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          VAT Rate (%)
                        </label>
                        <input
                          type="number"
                          step="0.1"
                          value={tempSettings.vatRate}
                          onChange={(e) => setTempSettings({...tempSettings, vatRate: parseFloat(e.target.value)})}
                          disabled={!editingSettings}
                          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-50"
                        />
                      </div>
                    </div>

                    {/* Sales Consultant */}
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold text-gray-900 border-b border-gray-200 pb-2">
                        Sales Consultant
                      </h3>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Consultant Name
                        </label>
                        <input
                          type="text"
                          value={tempSettings.consultantName}
                          onChange={(e) => setTempSettings({...tempSettings, consultantName: e.target.value})}
                          disabled={!editingSettings}
                          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-50"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Consultant Phone
                        </label>
                        <input
                          type="text"
                          value={tempSettings.consultantPhone}
                          onChange={(e) => setTempSettings({...tempSettings, consultantPhone: e.target.value})}
                          disabled={!editingSettings}
                          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-50"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Consultant Email
                        </label>
                        <input
                          type="email"
                          value={tempSettings.consultantEmail}
                          onChange={(e) => setTempSettings({...tempSettings, consultantEmail: e.target.value})}
                          disabled={!editingSettings}
                          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-50"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'cost-management' && (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <CostManagement />
              </div>
            )}

            {activeTab === 'form-fields' && (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <FormFieldManager />
              </div>
            )}

            {activeTab === 'pdf-templates' && (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <PDFTemplateManager />
              </div>
            )}

            {activeTab === 'email-setup' && (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <EmailSetupGuide />
              </div>
            )}
            {activeTab === 'quotes' && (
              <div className="space-y-6">
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-bold text-gray-900">Quote Requests</h2>
                    <div className="flex items-center space-x-4">
                      <button
                        onClick={exportQuotesData}
                        className="flex items-center space-x-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
                      >
                        <Download size={16} />
                        <span>Export Data</span>
                      </button>
                      <span className="text-sm text-gray-600">
                        Total Quotes: {quotes.length}
                      </span>
                    </div>
                  </div>

                  {quotes.length === 0 ? (
                    <div className="text-center py-12">
                      <FileText size={48} className="mx-auto text-gray-400 mb-4" />
                      <h3 className="text-lg font-medium text-gray-900 mb-2">No quotes yet</h3>
                      <p className="text-gray-600">Quote requests will appear here when customers submit them.</p>
                    </div>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="border-b border-gray-200">
                            <th className="text-left py-3 px-4 font-medium text-gray-900">Quote ID</th>
                            <th className="text-left py-3 px-4 font-medium text-gray-900">Customer</th>
                            <th className="text-left py-3 px-4 font-medium text-gray-900">Contact</th>
                            <th className="text-left py-3 px-4 font-medium text-gray-900">Location</th>
                            <th className="text-left py-3 px-4 font-medium text-gray-900">Service</th>
                            <th className="text-left py-3 px-4 font-medium text-gray-900">Date</th>
                            <th className="text-left py-3 px-4 font-medium text-gray-900">Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {quotes.map((quote) => (
                            <tr key={quote.id} className="border-b border-gray-100 hover:bg-gray-50">
                              <td className="py-3 px-4 font-mono text-sm">{quote.id}</td>
                              <td className="py-3 px-4">{quote.data.name}</td>
                              <td className="py-3 px-4">{quote.data.contactNumber}</td>
                              <td className="py-3 px-4">{quote.data.location}</td>
                              <td className="py-3 px-4 text-sm">{quote.data.serviceLevel}</td>
                              <td className="py-3 px-4 text-sm">{new Date(quote.createdAt).toLocaleDateString()}</td>
                              <td className="py-3 px-4">
                                <div className="flex space-x-2">
                                  <button className="text-blue-600 hover:text-blue-700">
                                    <Eye size={16} />
                                  </button>
                                  <button className="text-green-600 hover:text-green-700">
                                    <Download size={16} />
                                  </button>
                                  <button className="text-green-600 hover:text-green-700">
                                    <MessageCircle size={16} />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              </div>
            )}

            {activeTab === 'analytics' && (
              <div className="space-y-6">
                <div className="grid md:grid-cols-3 gap-6">
                  <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-600">Total Quotes</p>
                        <p className="text-2xl font-bold text-gray-900">{quotes.length}</p>
                      </div>
                      <FileText size={32} className="text-blue-600" />
                    </div>
                  </div>

                  <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-600">This Month</p>
                        <p className="text-2xl font-bold text-gray-900">
                          {quotes.filter(q => new Date(q.createdAt).getMonth() === new Date().getMonth()).length}
                        </p>
                      </div>
                      <Users size={32} className="text-green-600" />
                    </div>
                  </div>

                  <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-600">Form Fields</p>
                        <p className="text-2xl font-bold text-gray-900">{settings.formFields.length}</p>
                      </div>
                      <FormInput size={32} className="text-purple-600" />
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                  <h3 className="text-lg font-bold text-gray-900 mb-4">Recent Activity</h3>
                  <div className="space-y-4">
                    {quotes.slice(0, 5).map((quote) => (
                      <div key={quote.id} className="flex items-center space-x-4 p-3 bg-gray-50 rounded-lg">
                        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                          <FileText size={20} className="text-blue-600" />
                        </div>
                        <div className="flex-1">
                          <p className="font-medium text-gray-900">{quote.data.name}</p>
                          <p className="text-sm text-gray-600">
                            Submitted quote request • {new Date(quote.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                        <span className="text-sm text-gray-500">{quote.id}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'database' && (
              <div className="space-y-6">
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                  <h2 className="text-xl font-bold text-gray-900 mb-6">Data Management</h2>
                  
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="border border-gray-200 rounded-lg p-4">
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">Export Data</h3>
                      <div className="space-y-3">
                        <button
                          onClick={exportQuotesData}
                          className="w-full flex items-center justify-center space-x-2 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700"
                        >
                          <Download size={16} />
                          <span>Export Quotes Data</span>
                        </button>
                        <button
                          onClick={exportSettingsData}
                          className="w-full flex items-center justify-center space-x-2 bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700"
                        >
                          <Download size={16} />
                          <span>Export Settings Data</span>
                        </button>
                      </div>
                    </div>

                    <div className="border border-gray-200 rounded-lg p-4">
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">Database Statistics</h3>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Total Quotes:</span>
                          <span className="font-medium">{quotes.length}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Form Fields:</span>
                          <span className="font-medium">{settings.formFields.length}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">PDF Templates:</span>
                          <span className="font-medium">{settings.pdfTemplates.length}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Active Template:</span>
                          <span className="font-medium">{settings.activePdfTemplate}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;