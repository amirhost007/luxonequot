import React, { useState } from 'react';
import { useAdmin } from '../../context/AdminContext';
import { PDFTemplate } from '../../types/admin';
import { 
  Plus, 
  Edit, 
  Trash2, 
  Save, 
  X, 
  Eye,
  Copy,
  Palette,
  Type,
  Layout
} from 'lucide-react';

const PDFTemplateManager: React.FC = () => {
  const { settings, updatePdfTemplate, deletePdfTemplate, addPdfTemplate, updateSettings } = useAdmin();
  const [editingTemplate, setEditingTemplate] = useState<PDFTemplate | null>(null);
  const [isAddingTemplate, setIsAddingTemplate] = useState(false);
  const [previewTemplate, setPreviewTemplate] = useState<PDFTemplate | null>(null);

  const handleSaveTemplate = (template: PDFTemplate) => {
    updatePdfTemplate(template);
    setEditingTemplate(null);
  };

  const handleAddTemplate = () => {
    const newTemplate: PDFTemplate = {
      id: `template_${Date.now()}`,
      name: 'New Template',
      headerLogo: 'https://demo.theluxone.com/wp-content/uploads/2025/06/cropped-Luxone_HQ-1.png',
      headerText: 'Luxone - Premium Worktop Solutions',
      footerText: '© 2025 Luxone - Premium Worktop Solutions | UAE | www.theluxone.com',
      colors: {
        primary: '#3B82F6',
        secondary: '#8B5CF6',
        accent: '#F59E0B'
      },
      fonts: {
        heading: 'Arial, sans-serif',
        body: 'Arial, sans-serif'
      },
      sections: {
        showClientInfo: true,
        showProjectSpecs: true,
        showPricing: true,
        showTerms: true,
        customSections: []
      },
      layout: 'standard'
    };
    addPdfTemplate(newTemplate);
    setIsAddingTemplate(false);
  };

  const handleDuplicateTemplate = (template: PDFTemplate) => {
    const duplicatedTemplate: PDFTemplate = {
      ...template,
      id: `template_${Date.now()}`,
      name: `${template.name} (Copy)`
    };
    addPdfTemplate(duplicatedTemplate);
  };

  const handleSetActiveTemplate = (templateId: string) => {
    updateSettings({
      ...settings,
      activePdfTemplate: templateId
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-bold text-gray-900">PDF Template Management</h3>
        <button
          onClick={() => setIsAddingTemplate(true)}
          className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
        >
          <Plus size={16} />
          <span>Add Template</span>
        </button>
      </div>

      {/* Templates Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {settings.pdfTemplates.map((template) => (
          <div key={template.id} className="bg-white border border-gray-200 rounded-lg p-4">
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-medium text-gray-900">{template.name}</h4>
              {settings.activePdfTemplate === template.id && (
                <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded">
                  Active
                </span>
              )}
            </div>

            {/* Template Preview */}
            <div className="bg-gray-50 rounded p-3 mb-4 text-xs">
              <div className="flex items-center space-x-2 mb-2">
                <div 
                  className="w-4 h-4 rounded"
                  style={{ backgroundColor: template.colors.primary }}
                ></div>
                <span className="font-medium">{template.headerText}</span>
              </div>
              <div className="text-gray-600">
                Layout: {template.layout} | Sections: {Object.values(template.sections).filter(Boolean).length}
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex space-x-2">
                <button
                  onClick={() => setPreviewTemplate(template)}
                  className="text-blue-600 hover:text-blue-700"
                  title="Preview"
                >
                  <Eye size={16} />
                </button>
                <button
                  onClick={() => setEditingTemplate(template)}
                  className="text-green-600 hover:text-green-700"
                  title="Edit"
                >
                  <Edit size={16} />
                </button>
                <button
                  onClick={() => handleDuplicateTemplate(template)}
                  className="text-purple-600 hover:text-purple-700"
                  title="Duplicate"
                >
                  <Copy size={16} />
                </button>
                {template.id !== 'default' && (
                  <button
                    onClick={() => deletePdfTemplate(template.id)}
                    className="text-red-600 hover:text-red-700"
                    title="Delete"
                  >
                    <Trash2 size={16} />
                  </button>
                )}
              </div>
              
              {settings.activePdfTemplate !== template.id && (
                <button
                  onClick={() => handleSetActiveTemplate(template.id)}
                  className="text-sm bg-gray-100 text-gray-700 px-3 py-1 rounded hover:bg-gray-200"
                >
                  Set Active
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Edit Template Modal */}
      {editingTemplate && (
        <TemplateEditor
          template={editingTemplate}
          onSave={handleSaveTemplate}
          onCancel={() => setEditingTemplate(null)}
        />
      )}

      {/* Preview Modal */}
      {previewTemplate && (
        <TemplatePreview
          template={previewTemplate}
          onClose={() => setPreviewTemplate(null)}
        />
      )}
    </div>
  );
};

const TemplateEditor: React.FC<{
  template: PDFTemplate;
  onSave: (template: PDFTemplate) => void;
  onCancel: () => void;
}> = ({ template, onSave, onCancel }) => {
  const [editedTemplate, setEditedTemplate] = useState<PDFTemplate>(template);

  const handleAddCustomSection = () => {
    setEditedTemplate({
      ...editedTemplate,
      sections: {
        ...editedTemplate.sections,
        customSections: [
          ...editedTemplate.sections.customSections,
          {
            title: 'New Section',
            content: 'Section content...',
            order: editedTemplate.sections.customSections.length + 1
          }
        ]
      }
    });
  };

  const handleUpdateCustomSection = (index: number, field: string, value: string) => {
    const updatedSections = [...editedTemplate.sections.customSections];
    updatedSections[index] = { ...updatedSections[index], [field]: value };
    setEditedTemplate({
      ...editedTemplate,
      sections: {
        ...editedTemplate.sections,
        customSections: updatedSections
      }
    });
  };

  const handleRemoveCustomSection = (index: number) => {
    setEditedTemplate({
      ...editedTemplate,
      sections: {
        ...editedTemplate.sections,
        customSections: editedTemplate.sections.customSections.filter((_, i) => i !== index)
      }
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h4 className="text-xl font-bold text-gray-900">Edit PDF Template</h4>
          <button onClick={onCancel} className="text-gray-500 hover:text-gray-700">
            <X size={24} />
          </button>
        </div>

        <div className="space-y-6">
          {/* Basic Information */}
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Template Name
              </label>
              <input
                type="text"
                value={editedTemplate.name}
                onChange={(e) => setEditedTemplate({ ...editedTemplate, name: e.target.value })}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Layout Style
              </label>
              <select
                value={editedTemplate.layout}
                onChange={(e) => setEditedTemplate({ ...editedTemplate, layout: e.target.value as any })}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="standard">Standard</option>
                <option value="modern">Modern</option>
                <option value="minimal">Minimal</option>
              </select>
            </div>
          </div>

          {/* Header & Footer */}
          <div className="space-y-4">
            <h5 className="text-lg font-semibold text-gray-900 flex items-center">
              <Type size={20} className="mr-2" />
              Header & Footer
            </h5>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Header Logo URL
              </label>
              <input
                type="text"
                value={editedTemplate.headerLogo}
                onChange={(e) => setEditedTemplate({ ...editedTemplate, headerLogo: e.target.value })}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Header Text
              </label>
              <input
                type="text"
                value={editedTemplate.headerText}
                onChange={(e) => setEditedTemplate({ ...editedTemplate, headerText: e.target.value })}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Footer Text
              </label>
              <textarea
                value={editedTemplate.footerText}
                onChange={(e) => setEditedTemplate({ ...editedTemplate, footerText: e.target.value })}
                rows={2}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Colors */}
          <div className="space-y-4">
            <h5 className="text-lg font-semibold text-gray-900 flex items-center">
              <Palette size={20} className="mr-2" />
              Color Scheme
            </h5>
            
            <div className="grid md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Primary Color
                </label>
                <div className="flex space-x-2">
                  <input
                    type="color"
                    value={editedTemplate.colors.primary}
                    onChange={(e) => setEditedTemplate({
                      ...editedTemplate,
                      colors: { ...editedTemplate.colors, primary: e.target.value }
                    })}
                    className="w-12 h-10 border border-gray-300 rounded"
                  />
                  <input
                    type="text"
                    value={editedTemplate.colors.primary}
                    onChange={(e) => setEditedTemplate({
                      ...editedTemplate,
                      colors: { ...editedTemplate.colors, primary: e.target.value }
                    })}
                    className="flex-1 p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Secondary Color
                </label>
                <div className="flex space-x-2">
                  <input
                    type="color"
                    value={editedTemplate.colors.secondary}
                    onChange={(e) => setEditedTemplate({
                      ...editedTemplate,
                      colors: { ...editedTemplate.colors, secondary: e.target.value }
                    })}
                    className="w-12 h-10 border border-gray-300 rounded"
                  />
                  <input
                    type="text"
                    value={editedTemplate.colors.secondary}
                    onChange={(e) => setEditedTemplate({
                      ...editedTemplate,
                      colors: { ...editedTemplate.colors, secondary: e.target.value }
                    })}
                    className="flex-1 p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Accent Color
                </label>
                <div className="flex space-x-2">
                  <input
                    type="color"
                    value={editedTemplate.colors.accent}
                    onChange={(e) => setEditedTemplate({
                      ...editedTemplate,
                      colors: { ...editedTemplate.colors, accent: e.target.value }
                    })}
                    className="w-12 h-10 border border-gray-300 rounded"
                  />
                  <input
                    type="text"
                    value={editedTemplate.colors.accent}
                    onChange={(e) => setEditedTemplate({
                      ...editedTemplate,
                      colors: { ...editedTemplate.colors, accent: e.target.value }
                    })}
                    className="flex-1 p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Sections */}
          <div className="space-y-4">
            <h5 className="text-lg font-semibold text-gray-900 flex items-center">
              <Layout size={20} className="mr-2" />
              PDF Sections
            </h5>
            
            <div className="grid md:grid-cols-2 gap-4">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={editedTemplate.sections.showClientInfo}
                  onChange={(e) => setEditedTemplate({
                    ...editedTemplate,
                    sections: { ...editedTemplate.sections, showClientInfo: e.target.checked }
                  })}
                  className="mr-2"
                />
                Show Client Information
              </label>

              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={editedTemplate.sections.showProjectSpecs}
                  onChange={(e) => setEditedTemplate({
                    ...editedTemplate,
                    sections: { ...editedTemplate.sections, showProjectSpecs: e.target.checked }
                  })}
                  className="mr-2"
                />
                Show Project Specifications
              </label>

              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={editedTemplate.sections.showPricing}
                  onChange={(e) => setEditedTemplate({
                    ...editedTemplate,
                    sections: { ...editedTemplate.sections, showPricing: e.target.checked }
                  })}
                  className="mr-2"
                />
                Show Pricing
              </label>

              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={editedTemplate.sections.showTerms}
                  onChange={(e) => setEditedTemplate({
                    ...editedTemplate,
                    sections: { ...editedTemplate.sections, showTerms: e.target.checked }
                  })}
                  className="mr-2"
                />
                Show Terms & Conditions
              </label>
            </div>
          </div>

          {/* Custom Sections */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h5 className="text-lg font-semibold text-gray-900">Custom Sections</h5>
              <button
                onClick={handleAddCustomSection}
                className="flex items-center space-x-2 bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700"
              >
                <Plus size={16} />
                <span>Add Section</span>
              </button>
            </div>

            {editedTemplate.sections.customSections.map((section, index) => (
              <div key={index} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <input
                    type="text"
                    value={section.title}
                    onChange={(e) => handleUpdateCustomSection(index, 'title', e.target.value)}
                    className="font-medium text-gray-900 bg-transparent border-none focus:outline-none"
                    placeholder="Section Title"
                  />
                  <button
                    onClick={() => handleRemoveCustomSection(index)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
                <textarea
                  value={section.content}
                  onChange={(e) => handleUpdateCustomSection(index, 'content', e.target.value)}
                  rows={3}
                  className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                  placeholder="Section content..."
                />
              </div>
            ))}
          </div>
        </div>

        <div className="flex justify-end space-x-2 mt-6 pt-6 border-t border-gray-200">
          <button
            onClick={onCancel}
            className="px-6 py-2 text-gray-600 hover:text-gray-800"
          >
            Cancel
          </button>
          <button
            onClick={() => onSave(editedTemplate)}
            className="flex items-center space-x-2 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
          >
            <Save size={16} />
            <span>Save Template</span>
          </button>
        </div>
      </div>
    </div>
  );
};

const TemplatePreview: React.FC<{
  template: PDFTemplate;
  onClose: () => void;
}> = ({ template, onClose }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-4">
          <h4 className="text-lg font-bold text-gray-900">Template Preview: {template.name}</h4>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X size={20} />
          </button>
        </div>

        <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
          {/* Preview content would go here */}
          <div className="text-center text-gray-600">
            <p>PDF Template Preview</p>
            <p className="text-sm mt-2">Layout: {template.layout}</p>
            <p className="text-sm">Colors: {template.colors.primary}, {template.colors.secondary}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PDFTemplateManager;