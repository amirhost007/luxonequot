import React, { useState } from 'react';
import { useAdmin } from '../../context/AdminContext';
import { 
  Plus, 
  Edit, 
  Trash2, 
  Save, 
  X, 
  DollarSign,
  Calculator,
  Settings
} from 'lucide-react';

interface CostRule {
  id: string;
  name: string;
  category: 'material' | 'fabrication' | 'installation' | 'addon' | 'delivery' | 'business';
  type: 'fixed' | 'per_sqm' | 'per_piece' | 'percentage';
  value: number;
  description: string;
  isActive: boolean;
}

const CostManagement: React.FC = () => {
  const { settings, updateSettings } = useAdmin();
  const [costRules, setCostRules] = useState<CostRule[]>(settings.costRules || [
    {
      id: 'material_base',
      name: 'Base Material Cost',
      category: 'material',
      type: 'per_sqm',
      value: 150,
      description: 'Base price per square meter for materials',
      isActive: true
    },
    {
      id: 'cutting',
      name: 'Cutting Cost',
      category: 'fabrication',
      type: 'per_sqm',
      value: 20,
      description: 'Cost for cutting per square meter',
      isActive: true
    },
    {
      id: 'top_polishing',
      name: 'Top Polishing',
      category: 'fabrication',
      type: 'per_sqm',
      value: 50,
      description: 'Top polishing cost per square meter',
      isActive: true
    },
    {
      id: 'edge_polishing',
      name: 'Edge Polishing',
      category: 'fabrication',
      type: 'per_sqm',
      value: 30,
      description: 'Edge polishing cost per square meter',
      isActive: true
    },
    {
      id: 'installation',
      name: 'Installation Cost',
      category: 'installation',
      type: 'per_sqm',
      value: 140,
      description: 'Installation cost per square meter',
      isActive: true
    },
    {
      id: 'sink_luxone',
      name: 'Luxone Sink Cost',
      category: 'addon',
      type: 'fixed',
      value: 500,
      description: 'Cost for Luxone customized sink',
      isActive: true
    },
    {
      id: 'delivery_dubai',
      name: 'Dubai Delivery',
      category: 'delivery',
      type: 'fixed',
      value: 500,
      description: 'Delivery cost within Dubai',
      isActive: true
    },
    {
      id: 'delivery_uae',
      name: 'UAE Delivery',
      category: 'delivery',
      type: 'fixed',
      value: 800,
      description: 'Delivery cost to other UAE emirates',
      isActive: true
    },
    {
      id: 'margin',
      name: 'Business Margin',
      category: 'business',
      type: 'percentage',
      value: 20,
      description: '20% business margin',
      isActive: true
    },
    {
      id: 'vat',
      name: 'VAT',
      category: 'business',
      type: 'percentage',
      value: 5,
      description: '5% VAT',
      isActive: true
    }
  ]);

  const [editingRule, setEditingRule] = useState<CostRule | null>(null);
  const [isAddingRule, setIsAddingRule] = useState(false);
  const [newRule, setNewRule] = useState<Partial<CostRule>>({
    name: '',
    category: 'addon',
    type: 'fixed',
    value: 0,
    description: '',
    isActive: true
  });

  const categories = [
    { value: 'material', label: 'Material' },
    { value: 'fabrication', label: 'Fabrication' },
    { value: 'installation', label: 'Installation' },
    { value: 'addon', label: 'Add-ons' },
    { value: 'delivery', label: 'Delivery' },
    { value: 'business', label: 'Business' }
  ];

  const types = [
    { value: 'fixed', label: 'Fixed Amount (AED)' },
    { value: 'per_sqm', label: 'Per Square Meter (AED/m²)' },
    { value: 'per_piece', label: 'Per Piece (AED/piece)' },
    { value: 'percentage', label: 'Percentage (%)' }
  ];

  const handleSaveRule = (rule: CostRule) => {
    const updatedRules = costRules.map(r => r.id === rule.id ? rule : r);
    setCostRules(updatedRules);
    updateSettings({ ...settings, costRules: updatedRules });
    setEditingRule(null);
  };

  const handleAddRule = () => {
    if (newRule.name && newRule.category && newRule.type !== undefined && newRule.value !== undefined) {
      const rule: CostRule = {
        id: `custom_${Date.now()}`,
        name: newRule.name,
        category: newRule.category as any,
        type: newRule.type as any,
        value: newRule.value,
        description: newRule.description || '',
        isActive: newRule.isActive !== false
      };
      
      const updatedRules = [...costRules, rule];
      setCostRules(updatedRules);
      updateSettings({ ...settings, costRules: updatedRules });
      
      setIsAddingRule(false);
      setNewRule({
        name: '',
        category: 'addon',
        type: 'fixed',
        value: 0,
        description: '',
        isActive: true
      });
    }
  };

  const handleDeleteRule = (ruleId: string) => {
    const updatedRules = costRules.filter(r => r.id !== ruleId);
    setCostRules(updatedRules);
    updateSettings({ ...settings, costRules: updatedRules });
  };

  const handleToggleActive = (ruleId: string) => {
    const updatedRules = costRules.map(r => 
      r.id === ruleId ? { ...r, isActive: !r.isActive } : r
    );
    setCostRules(updatedRules);
    updateSettings({ ...settings, costRules: updatedRules });
  };

  const getCategoryRules = (category: string) => {
    return costRules.filter(rule => rule.category === category);
  };

  const formatValue = (rule: CostRule) => {
    switch (rule.type) {
      case 'fixed':
        return `AED ${rule.value.toLocaleString()}`;
      case 'per_sqm':
        return `AED ${rule.value}/m²`;
      case 'per_piece':
        return `AED ${rule.value}/piece`;
      case 'percentage':
        return `${rule.value}%`;
      default:
        return `AED ${rule.value}`;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-bold text-gray-900 flex items-center">
          <Calculator size={24} className="mr-2 text-blue-600" />
          Cost Management
        </h3>
        <button
          onClick={() => setIsAddingRule(true)}
          className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
        >
          <Plus size={16} />
          <span>Add Cost Rule</span>
        </button>
      </div>

      {/* Add New Rule Modal */}
      {isAddingRule && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-lg font-bold text-gray-900">Add New Cost Rule</h4>
              <button
                onClick={() => setIsAddingRule(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X size={20} />
              </button>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Rule Name
                </label>
                <input
                  type="text"
                  value={newRule.name}
                  onChange={(e) => setNewRule({ ...newRule, name: e.target.value })}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category
                </label>
                <select
                  value={newRule.category}
                  onChange={(e) => setNewRule({ ...newRule, category: e.target.value as any })}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  {categories.map(cat => (
                    <option key={cat.value} value={cat.value}>{cat.label}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Type
                </label>
                <select
                  value={newRule.type}
                  onChange={(e) => setNewRule({ ...newRule, type: e.target.value as any })}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  {types.map(type => (
                    <option key={type.value} value={type.value}>{type.label}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Value
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={newRule.value}
                  onChange={(e) => setNewRule({ ...newRule, value: parseFloat(e.target.value) || 0 })}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  value={newRule.description}
                  onChange={(e) => setNewRule({ ...newRule, description: e.target.value })}
                  rows={2}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div className="flex justify-end space-x-2 mt-6">
              <button
                onClick={() => setIsAddingRule(false)}
                className="px-4 py-2 text-gray-600 hover:text-gray-800"
              >
                Cancel
              </button>
              <button
                onClick={handleAddRule}
                className="flex items-center space-x-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
              >
                <Save size={16} />
                <span>Add Rule</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Cost Rules by Category */}
      <div className="space-y-6">
        {categories.map((category) => {
          const categoryRules = getCategoryRules(category.value);
          if (categoryRules.length === 0) return null;

          return (
            <div key={category.value} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <DollarSign size={20} className="mr-2 text-green-600" />
                {category.label} Costs
              </h4>
              
              <div className="space-y-3">
                {categoryRules.map((rule) => (
                  <div key={rule.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    {editingRule?.id === rule.id ? (
                      <EditRuleForm
                        rule={editingRule}
                        onSave={handleSaveRule}
                        onCancel={() => setEditingRule(null)}
                        onChange={setEditingRule}
                        categories={categories}
                        types={types}
                      />
                    ) : (
                      <>
                        <div className="flex-1">
                          <div className="flex items-center space-x-3">
                            <h5 className="font-medium text-gray-900">{rule.name}</h5>
                            <span className={`text-sm px-2 py-1 rounded ${
                              rule.isActive 
                                ? 'bg-green-100 text-green-800' 
                                : 'bg-red-100 text-red-800'
                            }`}>
                              {rule.isActive ? 'Active' : 'Inactive'}
                            </span>
                            <span className="text-lg font-bold text-blue-600">
                              {formatValue(rule)}
                            </span>
                          </div>
                          <p className="text-sm text-gray-600 mt-1">{rule.description}</p>
                        </div>
                        
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => handleToggleActive(rule.id)}
                            className={`px-3 py-1 rounded text-sm ${
                              rule.isActive
                                ? 'bg-red-100 text-red-700 hover:bg-red-200'
                                : 'bg-green-100 text-green-700 hover:bg-green-200'
                            }`}
                          >
                            {rule.isActive ? 'Disable' : 'Enable'}
                          </button>
                          <button
                            onClick={() => setEditingRule(rule)}
                            className="text-blue-600 hover:text-blue-700"
                          >
                            <Edit size={16} />
                          </button>
                          {!rule.id.startsWith('material_base') && !rule.id.startsWith('vat') && (
                            <button
                              onClick={() => handleDeleteRule(rule.id)}
                              className="text-red-600 hover:text-red-700"
                            >
                              <Trash2 size={16} />
                            </button>
                          )}
                        </div>
                      </>
                    )}
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

const EditRuleForm: React.FC<{
  rule: CostRule;
  onSave: (rule: CostRule) => void;
  onCancel: () => void;
  onChange: (rule: CostRule) => void;
  categories: Array<{ value: string; label: string }>;
  types: Array<{ value: string; label: string }>;
}> = ({ rule, onSave, onCancel, onChange, categories, types }) => {
  return (
    <div className="w-full space-y-4">
      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Rule Name
          </label>
          <input
            type="text"
            value={rule.name}
            onChange={(e) => onChange({ ...rule, name: e.target.value })}
            className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Category
          </label>
          <select
            value={rule.category}
            onChange={(e) => onChange({ ...rule, category: e.target.value as any })}
            className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
          >
            {categories.map(cat => (
              <option key={cat.value} value={cat.value}>{cat.label}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Type
          </label>
          <select
            value={rule.type}
            onChange={(e) => onChange({ ...rule, type: e.target.value as any })}
            className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
          >
            {types.map(type => (
              <option key={type.value} value={type.value}>{type.label}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Value
          </label>
          <input
            type="number"
            step="0.01"
            value={rule.value}
            onChange={(e) => onChange({ ...rule, value: parseFloat(e.target.value) || 0 })}
            className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Description
          </label>
          <textarea
            value={rule.description}
            onChange={(e) => onChange({ ...rule, description: e.target.value })}
            rows={2}
            className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      <div className="flex justify-end space-x-2">
        <button
          onClick={onCancel}
          className="px-4 py-2 text-gray-600 hover:text-gray-800"
        >
          Cancel
        </button>
        <button
          onClick={() => onSave(rule)}
          className="flex items-center space-x-2 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          <Save size={16} />
          <span>Save</span>
        </button>
      </div>
    </div>
  );
};

export default CostManagement;