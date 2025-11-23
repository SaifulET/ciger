import api from '@/lib/axios';
import { create } from 'zustand';

// Interfaces based on API responses and schema
interface ApiUser {
  _id: string;
  email: string;
  password?: string;
  isSignin?: boolean;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

interface CartItem {
  _id: string;
  image: string;
  brand: string;
  product: string;
  unitPrice: number;
  quantity: number;
  total: number;
}

interface ApiOrder {
  _id: string;
  name: string;
  address: string;
  email: string;
  phone: string;
  orderId: string;
  trackingNo: string;
  state: "processing" | "shipped" | "delivered" | "cancelled" | "refunded";
  userId: string;
  isNextUsePayment: boolean;
  carts: CartItem[];
  date: string;
  tax: string;
  subTotal: number;
  total: number;
  shippingCost: number;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

interface CustomerStore {
  // Customer list state
  customers: ApiUser[];
  loading: boolean;
  error: string | null;
  
  // Customer orders state
  customerOrders: ApiOrder[];
  ordersLoading: boolean;
  ordersError: string | null;
  
  // Actions
  fetchCustomers: () => Promise<void>;
  fetchCustomerOrders: (userId: string) => Promise<void>;
  clearCustomers: () => void;
  clearOrders: () => void;
}

export const useCustomerStore = create<CustomerStore>((set) => ({
  // Initial state
  customers: [],
  loading: false,
  error: null,
  customerOrders: [],
  ordersLoading: false,
  ordersError: null,

  // Fetch all customers
  fetchCustomers: async () => {
    set({ loading: true, error: null });
    try {
      const response = await api.get('/auth/getAllUser');
      const data = await response.data;
      
      if (data.success) {
        set({ customers: data.data, loading: false });
      } else {
        set({ error: 'Failed to fetch customers', loading: false });
      }
    } catch (error) {
      set({ error: 'Error fetching customers', loading: false });
    }
  },

  // Fetch customer orders
  fetchCustomerOrders: async (userId: string) => {
    set({ ordersLoading: true, ordersError: null });
    try {
        console.log("")
      const response = await api.get(`/order/userOrder/${userId}`);

      const data = await response.data;
      console.log(data,"97")
      if (data.success) {
        set({ customerOrders: data.data, ordersLoading: false });
      } else {
        set({ ordersError: 'Failed to fetch orders', ordersLoading: false });
      }
    } catch (error) {
      set({ ordersError: 'Error fetching orders', ordersLoading: false });
    }
  },

  clearCustomers: () => set({ customers: [], error: null }),
  clearOrders: () => set({ customerOrders: [], ordersError: null }),
}));