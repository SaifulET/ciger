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

interface Brand {
  _id: string;
  name: string;
}

interface Product {
  _id: string;
  name: string;
  image?: string;
  brandId: Brand;
}

interface CartItem {
  _id: string;
  productId: Product;
  quantity: number;
  unitPrice: number;
  total: number;
  image?: string;
  brand?: string;
  product?: string;
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
  subtotal: number;
  total: number;
  shippingCost: number;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

// Add new interface for user profile
interface UserProfile {
  _id: string;
  email: string;
  name?: string;
  phone?: string;
  address?: string;
  createdAt?: string;
  updatedAt?: string;
}

// API response interfaces
interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  profile?: T;
  user?: T;
  orders?: T[];
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
  
  // User profile state
  userProfile: UserProfile | null;
  profileLoading: boolean;
  profileError: string | null;
  
  // Actions
  fetchCustomers: () => Promise<void>;
  fetchCustomerOrders: (userId: string) => Promise<void>;
  fetchUserProfile: (userId: string) => Promise<void>;
  clearCustomers: () => void;
  clearOrders: () => void;
  clearProfile: () => void;
}

// Helper function to extract error message
const getErrorMessage = (error: unknown): string => {
  if (typeof error === 'string') {
    return error;
  }
  
  if (error instanceof Error) {
    return error.message;
  }
  
  if (typeof error === 'object' && error !== null) {
    // Axios error structure
    if ('response' in error) {
      const axiosError = error as { response?: { data?: { message?: string } } };
      if (axiosError.response?.data?.message) {
        return axiosError.response.data.message;
      }
    }
    // Generic error object with message
    if ('message' in error && typeof (error as { message: string }).message === 'string') {
      return (error as { message: string }).message;
    }
  }
  
  return 'An unexpected error occurred';
};

// Helper function to safely extract orders data
const extractOrdersData = (data: unknown): ApiOrder[] => {
  if (typeof data !== 'object' || data === null) {
    return [];
  }

  // Handle ApiResponse structure
  const apiResponse = data as ApiResponse<ApiOrder[]>;
  if (apiResponse.success && Array.isArray(apiResponse.data)) {
    return apiResponse.data;
  }

  // Handle direct array
  if (Array.isArray(data)) {
    return data;
  }

  // Handle orders property
  const ordersData = data as { orders?: ApiOrder[] };
  if (Array.isArray(ordersData.orders)) {
    return ordersData.orders;
  }

  return [];
};

export const useCustomerStore = create<CustomerStore>((set) => ({
  // Initial state
  customers: [],
  loading: false,
  error: null,
  customerOrders: [],
  ordersLoading: false,
  ordersError: null,
  userProfile: null,
  profileLoading: false,
  profileError: null,

  // Fetch all customers
  fetchCustomers: async () => {
    set({ loading: true, error: null });
    try {
      const response = await api.get<ApiResponse<ApiUser[]>>('/auth/getAllUser');
      const data = response.data;
      
      if (data.success) {
        set({ customers: data.data || [], loading: false });
      } else {
        set({ error: data.message || 'Failed to fetch customers', loading: false });
      }
    } catch (error: unknown) {
      const errorMessage = getErrorMessage(error);
      console.log("Error fetching customers:", error);
      set({ error: errorMessage, loading: false });
    }
  },

  // Fetch customer orders
  fetchCustomerOrders: async (userId: string) => {
    set({ ordersLoading: true, ordersError: null, customerOrders: [] });
    try {
      console.log("Fetching orders for user:", userId);
      const response = await api.get(`/order/userOrder/${userId}`);
      const data = response.data;
      
      console.log("Orders API Response:", data);
      
      if (data.success) {
        const ordersData = extractOrdersData(data);
        
        console.log("Processed orders data:", ordersData);
        console.log("First order carts structure:", ordersData[0]?.carts?.[0]);
        
        set({ customerOrders: ordersData, ordersLoading: false });
      } else {
        console.log("Orders API returned success: false", data);
        set({ 
          ordersError: data.message || 'Failed to fetch orders', 
          ordersLoading: false,
          customerOrders: [] 
        });
      }
    } catch (error: unknown) {
      const errorMessage = getErrorMessage(error);
      console.log("Error fetching orders:", error);
      set({ 
        ordersError: errorMessage, 
        ordersLoading: false,
        customerOrders: [] 
      });
    }
  },

  // Fetch user profile
  fetchUserProfile: async (userId: string) => {
    set({ profileLoading: true, profileError: null, userProfile: null });
    try {
      console.log("Fetching profile for user:", userId);
      const response = await api.get<ApiResponse<UserProfile>>(`/profile/profile/${userId}`);
      const data = response.data;
      
      console.log("Profile API Response:", data);
      
      if (data.success) {
        // Handle different possible response structures
        const profileData = data.data || data.profile || data.user;
        set({ userProfile: profileData || null, profileLoading: false });
      } else {
        console.log("Profile API returned success: false", data);
        set({ 
          profileError: data.message || 'Failed to fetch profile', 
          profileLoading: false 
        });
      }
    } catch (error: unknown) {
      const errorMessage = getErrorMessage(error);
      console.log("Error fetching profile:", error);
      set({ 
        profileError: errorMessage, 
        profileLoading: false 
      });
    }
  },

  clearCustomers: () => set({ customers: [], error: null }),
  clearOrders: () => set({ customerOrders: [], ordersError: null }),
  clearProfile: () => set({ userProfile: null, profileError: null }),
}));