import React, { useState } from 'react';
import { Plus, Search, Calendar, Clock, IndianRupee, AlertCircle, CheckCircle, XCircle } from 'lucide-react';
import { Rental} from '../types';
import { mockRentals, mockComputers, mockCustomers } from '../data/mockData';
import Modal from './Modal';

const Rentals: React.FC = () => {
  const [rentals, setRentals] = useState<Rental[]>(mockRentals);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [selectedRental, setSelectedRental] = useState<Rental | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const filteredRentals = rentals.filter(rental => {
    const customer = mockCustomers.find(c => c.id === rental.customerId);
    const computer = mockComputers.find(c => c.id === rental.computerId);
    
    const matchesSearch = customer?.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         customer?.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         computer?.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         computer?.model.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         rental.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || rental.status === filterStatus;
    
    return matchesSearch && matchesStatus;
  });

  const handleAddRental = () => {
    setSelectedRental(null);
    setIsEditing(false);
    setIsModalOpen(true);
  };

  const handleEditRental = (rental: Rental) => {
    setSelectedRental(rental);
    setIsEditing(true);
    setIsModalOpen(true);
  };

  const handleDeleteRental = (id: string) => {
    setRentals(rentals.filter(r => r.id !== id));
  };

  const handleSaveRental = (rentalData: Partial<Rental>) => {
    if (isEditing && selectedRental) {
      setRentals(rentals.map(r => 
        r.id === selectedRental.id ? { ...r, ...rentalData } : r
      ));
    } else {
      const newRental: Rental = {
        id: Date.now().toString(),
        createdAt: new Date().toISOString().split('T')[0],
        ...rentalData as Rental,
      };
      setRentals([...rentals, newRental]);
    }
    setIsModalOpen(false);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active': return 'bg-green-100 text-green-800';
      case 'Completed': return 'bg-blue-100 text-blue-800';
      case 'Overdue': return 'bg-red-100 text-red-800';
      case 'Cancelled': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case 'Paid': return 'bg-green-100 text-green-800';
      case 'Partial': return 'bg-yellow-100 text-yellow-800';
      case 'Pending': return 'bg-orange-100 text-orange-800';
      case 'Overdue': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Active': return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'Completed': return <CheckCircle className="h-4 w-4 text-blue-600" />;
      case 'Overdue': return <AlertCircle className="h-4 w-4 text-red-600" />;
      case 'Cancelled': return <XCircle className="h-4 w-4 text-gray-600" />;
      default: return <Clock className="h-4 w-4 text-gray-600" />;
    }
  };

  const RentalForm = () => {
    const [formData, setFormData] = useState<Partial<Rental>>(
      selectedRental || {
        customerId: '',
        computerId: '',
        startDate: '',
        endDate: '',
        dailyRate: 0,
        totalCost: 0,
        status: 'Active',
        paymentStatus: 'Pending',
        deposit: 0,
        notes: '',
      }
    );

    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      
      // Calculate total cost
      if (formData.startDate && formData.endDate && formData.dailyRate) {
        const start = new Date(formData.startDate);
        const end = new Date(formData.endDate);
        const days = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
        formData.totalCost = days * formData.dailyRate;
      }
      
      handleSaveRental(formData);
    };

    return (
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Customer</label>
            <select
              value={formData.customerId || ''}
              onChange={(e) => setFormData({ ...formData, customerId: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            >
              <option value="">Select a customer</option>
              {mockCustomers.map(customer => (
                <option key={customer.id} value={customer.id}>
                  {customer.firstName} {customer.lastName}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Computer</label>
            <select
              value={formData.computerId || ''}
              onChange={(e) => {
                const selectedComputer = mockComputers.find(c => c.id === e.target.value);
                setFormData({ 
                  ...formData, 
                  computerId: e.target.value,
                  dailyRate: selectedComputer?.dailyRate || 0
                });
              }}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            >
              <option value="">Select a computer</option>
              {mockComputers.filter(c => c.status === 'Available').map(computer => (
                <option key={computer.id} value={computer.id}>
                  {computer.brand} {computer.model} - ${computer.dailyRate}/day
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
            <input
              type="date"
              value={formData.startDate || ''}
              onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
            <input
              type="date"
              value={formData.endDate || ''}
              onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
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
              min="50"
              step="5"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Deposit (₹)</label>
            <input
              type="number"
              value={formData.deposit || 0}
              onChange={(e) => setFormData({ ...formData, deposit: parseFloat(e.target.value) })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              min="500"
              step="100"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Total Cost (₹)</label>
            <input
              type="number"
              value={formData.totalCost || 0}
              onChange={(e) => setFormData({ ...formData, totalCost: parseFloat(e.target.value) })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50"
              min="0"
              step="0.01"
              readOnly
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
            <select
              value={formData.status || 'Active'}
              onChange={(e) => setFormData({ ...formData, status: e.target.value as Rental['status'] })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="Active">Active</option>
              <option value="Completed">Completed</option>
              <option value="Overdue">Overdue</option>
              <option value="Cancelled">Cancelled</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Payment Status</label>
            <select
              value={formData.paymentStatus || 'Pending'}
              onChange={(e) => setFormData({ ...formData, paymentStatus: e.target.value as Rental['paymentStatus'] })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="Pending">Pending</option>
              <option value="Partial">Partial</option>
              <option value="Paid">Paid</option>
              <option value="Overdue">Overdue</option>
            </select>
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
            {isEditing ? 'Update Rental' : 'Create Rental'}
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
          <h2 className="text-2xl font-bold text-gray-900">Rental Management</h2>
          <p className="text-gray-600">Track and manage all rental agreements</p>
        </div>
        <button
          onClick={handleAddRental}
          className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="h-5 w-5" />
          <span>New Rental</span>
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
                placeholder="Search rentals..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
          <div>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Status</option>
              <option value="Active">Active</option>
              <option value="Completed">Completed</option>
              <option value="Overdue">Overdue</option>
              <option value="Cancelled">Cancelled</option>
            </select>
          </div>
        </div>
      </div>

      {/* Rentals List */}
      <div className="space-y-4">
        {filteredRentals.map((rental) => {
          const customer = mockCustomers.find(c => c.id === rental.customerId);
          const computer = mockComputers.find(c => c.id === rental.computerId);
          
          return (
            <div key={rental.id} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow duration-200">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  {getStatusIcon(rental.status)}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      Rental #{rental.id}
                    </h3>
                    <p className="text-sm text-gray-600">
                      {customer?.firstName} {customer?.lastName} - {computer?.brand} {computer?.model}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <span className={`px-3 py-1 text-sm font-medium rounded-full ${getStatusColor(rental.status)}`}>
                    {rental.status}
                  </span>
                  <span className={`px-3 py-1 text-sm font-medium rounded-full ${getPaymentStatusColor(rental.paymentStatus)}`}>
                    {rental.paymentStatus}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-4">
                <div className="flex items-center space-x-2">
                  <Calendar className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">Start Date</p>
                    <p className="text-sm text-gray-600">{new Date(rental.startDate).toLocaleDateString()}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Calendar className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">End Date</p>
                    <p className="text-sm text-gray-600">{new Date(rental.endDate).toLocaleDateString()}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <IndianRupee className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">Daily Rate</p>
                    <p className="text-sm text-gray-600">₹{rental.dailyRate}/day</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <IndianRupee className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">Total Cost</p>
                    <p className="text-sm text-gray-600">₹{rental.totalCost.toLocaleString()}</p>
                  </div>
                </div>
              </div>

              {rental.notes && (
                <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-700">{rental.notes}</p>
                </div>
              )}

              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-600">
                  Created: {new Date(rental.createdAt).toLocaleDateString()}
                  {rental.deposit > 0 && (
                    <span className="ml-4">
                      Deposit: ₹{rental.deposit.toLocaleString()}
                    </span>
                  )}
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleEditRental(rental)}
                    className="px-3 py-1 text-sm text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteRental(rental.id)}
                    className="px-3 py-1 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {filteredRentals.length === 0 && (
        <div className="text-center py-12">
          <Calendar className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No rentals found</h3>
          <p className="text-gray-600">Try adjusting your search or filters</p>
        </div>
      )}

      {/* Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={isEditing ? 'Edit Rental' : 'Create New Rental'}
      >
        <RentalForm />
      </Modal>
    </div>
  );
};

export default Rentals;