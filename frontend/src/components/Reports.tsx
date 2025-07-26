import React, { useState } from 'react';
import { TrendingUp, IndianRupee, Users, Monitor, Calendar, Download } from 'lucide-react';
import { mockComputers, mockCustomers, mockRentals } from '../data/mockData';

const Reports: React.FC = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('monthly');

  // Calculate metrics
  const totalRevenue = mockRentals.reduce((sum, rental) => sum + rental.totalCost, 0);
  const averageRentalValue = totalRevenue / mockRentals.length;
  const topCustomers = mockCustomers
    .sort((a, b) => b.totalSpent - a.totalSpent)
    .slice(0, 5);
  
  const equipmentUtilization = mockComputers.map(computer => {
    const computerRentals = mockRentals.filter(rental => rental.computerId === computer.id);
    return {
      ...computer,
      rentalCount: computerRentals.length,
      revenue: computerRentals.reduce((sum, rental) => sum + rental.totalCost, 0)
    };
  }).sort((a, b) => b.revenue - a.revenue);

  const monthlyData = [
    { month: 'Jan', revenue: 12500, rentals: 25 },
    { month: 'Feb', revenue: 15200, rentals: 32 },
    { month: 'Mar', revenue: 18750, rentals: 38 },
    { month: 'Apr', revenue: 22100, rentals: 45 },
    { month: 'May', revenue: 19800, rentals: 41 },
    { month: 'Jun', revenue: 25600, rentals: 52 },
  ];

  const RevenueChart = () => (
    <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">Revenue Overview</h3>
        <select
          value={selectedPeriod}
          onChange={(e) => setSelectedPeriod(e.target.value)}
          className="px-3 py-1 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="weekly">Weekly</option>
          <option value="monthly">Monthly</option>
          <option value="yearly">Yearly</option>
        </select>
      </div>
      
      <div className="space-y-4">
        {monthlyData.map((item) => (
          <div key={item.month} className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <span className="text-sm font-medium text-gray-700 w-8">{item.month}</span>
              <div className="flex-1 bg-gray-200 rounded-full h-4 w-64">
                <div 
                  className="bg-gradient-to-r from-blue-500 to-blue-600 h-4 rounded-full transition-all duration-300"
                  style={{ width: `${(item.revenue / 30000) * 100}%` }}
                />
              </div>
            </div>
            <div className="text-right">
              <div className="text-sm font-bold text-gray-900">₹{item.revenue.toLocaleString()}</div>
              <div className="text-xs text-gray-500">{item.rentals} rentals</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const StatsCard = ({ title, value, icon: Icon, color, change }: {
    title: string;
    value: string | number;
    icon: React.ElementType;
    color: string;
    change?: { value: number; isPositive: boolean };
  }) => (
    <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
          {change && (
            <div className={`flex items-center mt-2 ${change.isPositive ? 'text-green-600' : 'text-red-600'}`}>
              <TrendingUp className={`h-4 w-4 mr-1 ${change.isPositive ? '' : 'rotate-180'}`} />
              <span className="text-sm font-medium">{change.value}%</span>
            </div>
          )}
        </div>
        <div className={`p-3 rounded-lg ${color}`}>
          <Icon className="h-6 w-6 text-white" />
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Reports & Analytics</h2>
          <p className="text-gray-600">Track your business performance and insights</p>
        </div>
        <button className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
          <Download className="h-5 w-5" />
          <span>Export Report</span>
        </button>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="Total Revenue"
          value={`₹${totalRevenue.toLocaleString()}`}
          icon={IndianRupee}
          color="bg-green-500"
          change={{ value: 15.3, isPositive: true }}
        />
        <StatsCard
          title="Active Rentals"
          value={mockRentals.filter(r => r.status === 'Active').length}
          icon={Calendar}
          color="bg-blue-500"
          change={{ value: 8.2, isPositive: true }}
        />
        <StatsCard
          title="Total Customers"
          value={mockCustomers.length}
          icon={Users}
          color="bg-purple-500"
          change={{ value: 23.1, isPositive: true }}
        />
        <StatsCard
          title="Equipment Utilization"
          value={`${Math.round((mockComputers.filter(c => c.status === 'Rented').length / mockComputers.length) * 100)}%`}
          icon={Monitor}
          color="bg-orange-500"
          change={{ value: 5.7, isPositive: true }}
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RevenueChart />
        
        {/* Top Customers */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Top Customers</h3>
          <div className="space-y-4">
            {topCustomers.map((customer, index) => (
              <div key={customer.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <span className="text-sm font-medium text-blue-600">{index + 1}</span>
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{customer.firstName} {customer.lastName}</p>
                    <p className="text-sm text-gray-600">{customer.totalRentals} rentals</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold text-gray-900">₹{customer.totalSpent.toLocaleString()}</p>
                  <p className="text-sm text-gray-600">revenue</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Equipment Performance */}
      <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">Equipment Performance</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 font-medium text-gray-900">Computer</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900">Category</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900">Rentals</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900">Revenue</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900">Daily Rate</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900">Status</th>
              </tr>
            </thead>
            <tbody>
              {equipmentUtilization.map((computer) => (
                <tr key={computer.id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-3 px-4">
                    <div>
                      <p className="font-medium text-gray-900">{computer.brand} {computer.model}</p>
                      <p className="text-sm text-gray-600">{computer.serialNumber}</p>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-sm text-gray-600">{computer.category}</td>
                  <td className="py-3 px-4 text-sm text-gray-600">{computer.rentalCount}</td>
                  <td className="py-3 px-4 text-sm font-medium text-gray-900">₹{computer.revenue.toLocaleString()}</td>
                  <td className="py-3 px-4 text-sm text-gray-600">₹{computer.dailyRate}</td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                      computer.status === 'Available' ? 'bg-green-100 text-green-800' :
                      computer.status === 'Rented' ? 'bg-blue-100 text-blue-800' :
                      computer.status === 'Maintenance' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {computer.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Financial Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="flex items-center space-x-3 mb-4">
            <div className="p-2 bg-green-100 rounded-lg">
              <IndianRupee className="h-5 w-5 text-green-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900">Revenue Breakdown</h3>
          </div>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Total Revenue</span>
              <span className="font-medium text-gray-900">₹{totalRevenue.toLocaleString()}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Average Rental Value</span>
              <span className="font-medium text-gray-900">₹{Math.round(averageRentalValue).toLocaleString()}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Deposits Collected</span>
              <span className="font-medium text-gray-900">₹{mockRentals.reduce((sum, r) => sum + r.deposit, 0).toLocaleString()}</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="flex items-center space-x-3 mb-4">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Calendar className="h-5 w-5 text-blue-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900">Rental Statistics</h3>
          </div>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Total Rentals</span>
              <span className="font-medium text-gray-900">{mockRentals.length}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Active Rentals</span>
              <span className="font-medium text-gray-900">{mockRentals.filter(r => r.status === 'Active').length}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Overdue Rentals</span>
              <span className="font-medium text-red-600">{mockRentals.filter(r => r.status === 'Overdue').length}</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="flex items-center space-x-3 mb-4">
            <div className="p-2 bg-purple-100 rounded-lg">
              <Monitor className="h-5 w-5 text-purple-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900">Equipment Status</h3>
          </div>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Total Equipment</span>
              <span className="font-medium text-gray-900">{mockComputers.length}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Available</span>
              <span className="font-medium text-green-600">{mockComputers.filter(c => c.status === 'Available').length}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">In Maintenance</span>
              <span className="font-medium text-yellow-600">{mockComputers.filter(c => c.status === 'Maintenance').length}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Reports;