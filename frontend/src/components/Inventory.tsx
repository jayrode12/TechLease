import React, { useState } from 'react';
import { Plus, Search, Edit, Trash2, Monitor, Cpu, HardDrive, Zap } from 'lucide-react';
import { Computer } from '../types';
import { mockComputers } from '../data/mockData';
import Modal from './Modal';

const Inventory: React.FC = () => {
  const [computers, setComputers] = useState<Computer[]>(mockComputers);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [selectedComputer, setSelectedComputer] = useState<Computer | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const filteredComputers = computers.filter(computer => {
    const matchesSearch = computer.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         computer.model.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         computer.serialNumber.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || computer.status === filterStatus;
    const matchesCategory = filterCategory === 'all' || computer.category === filterCategory;
    
    return matchesSearch && matchesStatus && matchesCategory;
  });

  const handleAddComputer = () => {
    setSelectedComputer(null);
    setIsEditing(false);
    setIsModalOpen(true);
  };

  const handleEditComputer = (computer: Computer) => {
    setSelectedComputer(computer);
    setIsEditing(true);
    setIsModalOpen(true);
  };

  const handleDeleteComputer = (id: string) => {
    setComputers(computers.filter(c => c.id !== id));
  };

  const handleSaveComputer = (computerData: Partial<Computer>) => {
    if (isEditing && selectedComputer) {
      setComputers(computers.map(c => 
        c.id === selectedComputer.id ? { ...c, ...computerData } : c
      ));
    } else {
      const { id , ...rest } = computerData as Computer;
      const newComputer: Computer = {
        id : Date.now().toString(),
        ...rest,
      };
      setComputers([...computers, newComputer]);
    }
    setIsModalOpen(false);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Available': return 'bg-green-100 text-green-800';
      case 'Rented': return 'bg-blue-100 text-blue-800';
      case 'Maintenance': return 'bg-yellow-100 text-yellow-800';
      case 'Retired': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const ComputerForm = () => {
    const [formData, setFormData] = useState<Partial<Computer>>(
      selectedComputer || {
        brand: '',
        model: '',
        processor: '',
        ram: '',
        storage: '',
        graphics: '',
        category: 'Laptop',
        dailyRate: 0,
        weeklyRate: 0,
        monthlyRate: 0,
        status: 'Available',
        condition: 'Excellent',
        purchaseDate: '',
        serialNumber: '',
        notes: '',
      }
    );

    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      handleSaveComputer(formData);
    };

    return (
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Brand</label>
            <input
              type="text"
              value={formData.brand || ''}
              onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Model</label>
            <input
              type="text"
              value={formData.model || ''}
              onChange={(e) => setFormData({ ...formData, model: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Processor</label>
            <input
              type="text"
              value={formData.processor || ''}
              onChange={(e) => setFormData({ ...formData, processor: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">RAM</label>
            <input
              type="text"
              value={formData.ram || ''}
              onChange={(e) => setFormData({ ...formData, ram: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Storage</label>
            <input
              type="text"
              value={formData.storage || ''}
              onChange={(e) => setFormData({ ...formData, storage: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Graphics</label>
            <input
              type="text"
              value={formData.graphics || ''}
              onChange={(e) => setFormData({ ...formData, graphics: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
            <select
              value={formData.category || 'Laptop'}
              onChange={(e) => setFormData({ ...formData, category: e.target.value as Computer['category'] })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="Laptop">Laptop</option>
              <option value="Desktop">Desktop</option>
              <option value="Gaming">Gaming</option>
              <option value="Server">Server</option>
              <option value="Workstation">Workstation</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
            <select
              value={formData.status || 'Available'}
              onChange={(e) => setFormData({ ...formData, status: e.target.value as Computer['status'] })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="Available">Available</option>
              <option value="Rented">Rented</option>
              <option value="Maintenance">Maintenance</option>
              <option value="Retired">Retired</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Daily Rate (₹)</label>
            <input
              type="number"
              value={formData.dailyRate || 0}
              onChange={(e) => setFormData({ ...formData, dailyRate: parseFloat(e.target.value) })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              min="0"
              step="0.01"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Weekly Rate (₹)</label>
            <input
              type="number"
              value={formData.weeklyRate || 0}
              onChange={(e) => setFormData({ ...formData, weeklyRate: parseFloat(e.target.value) })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              min="0"
              step="0.01"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Monthly Rate (₹)</label>
            <input
              type="number"
              value={formData.monthlyRate || 0}
              onChange={(e) => setFormData({ ...formData, monthlyRate: parseFloat(e.target.value) })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              min="0"
              step="0.01"
              required
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Serial Number</label>
            <input
              type="text"
              value={formData.serialNumber || ''}
              onChange={(e) => setFormData({ ...formData, serialNumber: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Purchase Date</label>
            <input
              type="date"
              value={formData.purchaseDate || ''}
              onChange={(e) => setFormData({ ...formData, purchaseDate: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
          <textarea
            value={formData.notes || ''}
            onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <div className="flex justify-end space-x-3 pt-4">
          <button
            type="button"
            onClick={() => setIsModalOpen(false)}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
          >
            {isEditing ? 'Update Computer' : 'Add Computer'}
          </button>
        </div>
      </form>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Computer Inventory</h2>
          <p className="text-gray-600">Manage your computer rental inventory</p>
        </div>
        <button
          onClick={handleAddComputer}
          className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="h-5 w-5" />
          <span>Add Computer</span>
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="text"
                placeholder="Search computers..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
          <div className="flex flex-col sm:flex-row gap-4">
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Status</option>
              <option value="Available">Available</option>
              <option value="Rented">Rented</option>
              <option value="Maintenance">Maintenance</option>
              <option value="Retired">Retired</option>
            </select>
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Categories</option>
              <option value="Laptop">Laptop</option>
              <option value="Desktop">Desktop</option>
              <option value="Gaming">Gaming</option>
              <option value="Server">Server</option>
              <option value="Workstation">Workstation</option>
            </select>
          </div>
        </div>
      </div>

      {/* Computer Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredComputers.map((computer) => (
          <div key={computer.id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow duration-200">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-2">
                  <Monitor className="h-6 w-6 text-blue-600" />
                  <h3 className="text-lg font-semibold text-gray-900">
                    {computer.brand} {computer.model}
                  </h3>
                </div>
                <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(computer.status)}`}>
                  {computer.status}
                </span>
              </div>

              <div className="space-y-3 mb-4">
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <Cpu className="h-4 w-4" />
                  <span>{computer.processor}</span>
                </div>
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <HardDrive className="h-4 w-4" />
                  <span>{computer.ram} | {computer.storage}</span>
                </div>
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <Zap className="h-4 w-4" />
                  <span>{computer.graphics}</span>
                </div>
              </div>

              <div className="flex items-center justify-between mb-4">
                <div className="text-sm text-gray-600">
                  <span className="font-medium">Serial:</span> {computer.serialNumber}
                </div>
                <div className="text-sm text-gray-600">
                  <span className="font-medium">{computer.category}</span>
                </div>
              </div>

              <div className="flex items-center justify-between mb-4">
                <div className="text-lg font-bold text-gray-900">
                  ₹{computer.dailyRate}/day
                </div>
                <div className="text-sm text-gray-600">
                  ₹{computer.weeklyRate}/week | ₹{computer.monthlyRate}/month
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-600">
                  Condition: <span className="font-medium">{computer.condition}</span>
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleEditComputer(computer)}
                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                  >
                    <Edit className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => handleDeleteComputer(computer.id)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredComputers.length === 0 && (
        <div className="text-center py-12">
          <Monitor className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No computers found</h3>
          <p className="text-gray-600">Try adjusting your search or filters</p>
        </div>
      )}

      {/* Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={isEditing ? 'Edit Computer' : 'Add New Computer'}
      >
        <ComputerForm />
      </Modal>
    </div>
  );
};

export default Inventory;