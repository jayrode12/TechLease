export interface Computer {
  id: string;
  brand: string;
  model: string;
  processor: string;
  ram: string;
  storage: string;
  graphics: string;
  category: 'Laptop' | 'Desktop' | 'Gaming' | 'Server' | 'Workstation';
  dailyRate: number;
  weeklyRate: number;
  monthlyRate: number;
  status: 'Available' | 'Rented' | 'Maintenance' | 'Retired';
  condition: 'Excellent' | 'Good' | 'Fair' | 'Poor';
  purchaseDate: string;
  serialNumber: string;
  notes?: string;
  imageUrl?: string;
}

export interface Customer {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  company?: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  dateJoined: string;
  totalRentals: number;
  totalSpent: number;
  status: 'Active' | 'Inactive' | 'Blacklisted';
  notes?: string;
}

export interface Rental {
  id: string;
  customerId: string;
  computerId: string;
  startDate: string;
  endDate: string;
  dailyRate: number;
  totalCost: number;
  status: 'Active' | 'Completed' | 'Overdue' | 'Cancelled';
  paymentStatus: 'Paid' | 'Partial' | 'Pending' | 'Overdue';
  deposit: number;
  notes?: string;
  createdAt: string;
}

export interface DashboardStats {
  totalComputers: number;
  availableComputers: number;
  rentedComputers: number;
  maintenanceComputers: number;
  totalCustomers: number;
  activeRentals: number;
  monthlyRevenue: number;
  overdueRentals: number;
}