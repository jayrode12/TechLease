import React from 'react';
import { Monitor, Users, Calendar, IndianRupee, AlertTriangle, TrendingUp } from 'lucide-react';
import { mockComputers, mockCustomers, mockRentals } from '../data/mockData';
import { DashboardStats } from '../types';

const Dashboard: React.FC = () => {
  // Calculate dashboard statistics
  const stats: DashboardStats = {
    totalComputers: mockComputers.length,
    availableComputers: mockComputers.filter(c => c.status === 'Available').length,
    rentedComputers: mockComputers.filter(c => c.status === 'Rented').length,
    maintenanceComputers: mockComputers.filter(c => c.status === 'Maintenance').length,
    totalCustomers: mockCustomers.length,
    activeRentals: mockRentals.filter(r => r.status === 'Active').length,
    monthlyRevenue: mockRentals.reduce((sum, rental) => sum + rental.totalCost, 0),
    overdueRentals: mockRentals.filter(r => r.status === 'Overdue').length,
  };

  const StatCard = ({ title, value, icon: Icon, color, trend }: {
    title: string;
    value: string | number;
    icon: React.ElementType;
    color: string;
    trend?: { value: number; isPositive: boolean };
  }) => (
    <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 hover:shadow-md transition-shadow duration-200">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
          <p className="text-3xl font-bold text-gray-900">{value}</p>
          {trend && (
            <div className={`flex items-center mt-2 ${trend.isPositive ? 'text-green-600' : 'text-red-600'}`}>
              <TrendingUp className={`h-4 w-4 mr-1 ${trend.isPositive ? '' : 'rotate-180'}`} />
              <span className="text-sm font-medium">{trend.value}% from last month</span>
            </div>
          )}
        </div>
        <div className={`p-3 rounded-lg ${color}`}>
          <Icon className="h-6 w-6 text-white" />
        </div>
      </div>
    </div>
  );

  const RecentActivity = () => (
    <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
      <div className="space-y-4">
        {mockRentals.slice(0, 5).map((rental) => {
          const customer = mockCustomers.find(c => c.id === rental.customerId);
          const computer = mockComputers.find(c => c.id === rental.computerId);
          return (
            <div key={rental.id} className="flex items-center space-x-4 p-3 bg-gray-50 rounded-lg">
              <div className={`w-2 h-2 rounded-full ${
                rental.status === 'Active' ? 'bg-green-500' :
                rental.status === 'Completed' ? 'bg-blue-500' :
                rental.status === 'Overdue' ? 'bg-red-500' : 'bg-gray-500'
              }`} />
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">
                  {customer?.firstName} {customer?.lastName} rented {computer?.brand} {computer?.model}
                </p>
                <p className="text-xs text-gray-500">
                  {new Date(rental.startDate).toLocaleDateString()} - {new Date(rental.endDate).toLocaleDateString()}
                </p>
              </div>
              <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                rental.status === 'Active' ? 'bg-green-100 text-green-800' :
                rental.status === 'Completed' ? 'bg-blue-100 text-blue-800' :
                rental.status === 'Overdue' ? 'bg-red-100 text-red-800' : 'bg-gray-100 text-gray-800'
              }`}>
                {rental.status}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );

  const InventoryOverview = () => (
    <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Inventory Overview</h3>
      <div className="space-y-3">
        {['Laptop', 'Desktop', 'Gaming', 'Workstation'].map((category) => {
          const categoryComputers = mockComputers.filter(c => c.category === category);
          const available = categoryComputers.filter(c => c.status === 'Available').length;
          const total = categoryComputers.length;
          const percentage = total > 0 ? (available / total) * 100 : 0;
          
          return (
            <div key={category} className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-700">{category}</span>
              <div className="flex items-center space-x-2">
                <div className="w-20 bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${percentage}%` }}
                  />
                </div>
                <span className="text-sm text-gray-600">{available}/{total}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Computers"
          value={stats.totalComputers}
          icon={Monitor}
          color="bg-blue-500"
          trend={{ value: 12, isPositive: true }}
        />
        <StatCard
          title="Active Customers"
          value={stats.totalCustomers}
          icon={Users}
          color="bg-green-500"
          trend={{ value: 8, isPositive: true }}
        />
        <StatCard
          title="Active Rentals"
          value={stats.activeRentals}
          icon={Calendar}
          color="bg-purple-500"
          trend={{ value: 15, isPositive: true }}
        />
        <StatCard
          title="Monthly Revenue"
          value={`₹${stats.monthlyRevenue.toLocaleString()}`}
          icon={IndianRupee}
          color="bg-yellow-500"
          trend={{ value: 23, isPositive: true }}
        />
      </div>

      {/* Equipment Status */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-600">Available</span>
            <span className="text-2xl font-bold text-green-600">{stats.availableComputers}</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-green-500 h-2 rounded-full"
              style={{ width: `${(stats.availableComputers / stats.totalComputers) * 100}%` }}
            />
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-600">Rented</span>
            <span className="text-2xl font-bold text-blue-600">{stats.rentedComputers}</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-blue-500 h-2 rounded-full"
              style={{ width: `${(stats.rentedComputers / stats.totalComputers) * 100}%` }}
            />
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-600">Maintenance</span>
            <span className="text-2xl font-bold text-yellow-600">{stats.maintenanceComputers}</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-yellow-500 h-2 rounded-full"
              style={{ width: `${(stats.maintenanceComputers / stats.totalComputers) * 100}%` }}
            />
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-600">Overdue</span>
            <span className="text-2xl font-bold text-red-600">{stats.overdueRentals}</span>
          </div>
          <div className="flex items-center mt-2">
            <AlertTriangle className="h-4 w-4 text-red-500 mr-1" />
            <span className="text-sm text-red-600">Requires attention</span>
          </div>
        </div>
      </div>

      {/* Recent Activity and Inventory Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RecentActivity />
        <InventoryOverview />
      </div>
    </div>
  );
};

export default Dashboard;