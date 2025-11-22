import api from '@/lib/axios';
import { create } from 'zustand';

export interface DiscountCode {
  _id: string;
  code: string;
  percentage: number;
  description: string;
  createdAt: string;
  updatedAt: string;
  __v?: number;
}

interface DiscountCodeState {
  discountCodes: DiscountCode[];
  loading: boolean;
  error: string | null;
  
  // Actions
  setDiscountCodes: (codes: DiscountCode[]) => void;
  addDiscountCode: (code: DiscountCode) => void;
  updateDiscountCode: (id: string, updatedCode: Partial<DiscountCode>) => void;
  deleteDiscountCode: (id: string) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  
  // API calls
  fetchDiscountCodes: () => Promise<void>;
  fetchDiscountCodeById: (id: string) => Promise<DiscountCode | null>;
  createDiscountCode: (codeData: { code: string; percentage: number; description: string }) => Promise<void>;
  updateDiscountCodeById: (id: string, codeData: Partial<DiscountCode>) => Promise<void>;
  deleteDiscountCodeById: (id: string) => Promise<void>;
}

export const useDiscountCodeStore = create<DiscountCodeState>((set, get) => ({
  discountCodes: [],
  loading: false,
  error: null,

  setDiscountCodes: (codes) => set({ discountCodes: codes }),
  addDiscountCode: (code) => set((state) => ({ discountCodes: [...state.discountCodes, code] })),
  updateDiscountCode: (id, updatedCode) => set((state) => ({
    discountCodes: state.discountCodes.map((code) =>
      code._id === id ? { ...code, ...updatedCode } : code
    )
  })),
  deleteDiscountCode: (id) => set((state) => ({
    discountCodes: state.discountCodes.filter((code) => code._id !== id)
  })),
  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),

  fetchDiscountCodes: async () => {
    set({ loading: true, error: null });
    try {
      const response = await api.get('/discount/getAllDiscount');
      const data = await response.data;
      
      if (data.success) {
        set({ discountCodes: data.data, loading: false });
      } else {
        set({ error: 'Failed to fetch discount codes', loading: false });
      }
    } catch (error) {
      console.log('Error fetching discount codes:', error);
      set({ error: 'Failed to fetch discount codes', loading: false });
    }
  },

  fetchDiscountCodeById: async (id: string) => {
    set({ loading: true, error: null });
    try {
      const response = await api.get(`/discount/getDiscountById/${id}`);
      const data = await response.data;
      
      if (data.success) {
        set({ loading: false });
        return data.data;
      } else {
        set({ error: 'Failed to fetch discount code', loading: false });
        return null;
      }
    } catch (error) {
      console.log('Error fetching discount code:', error);
      set({ error: 'Failed to fetch discount code', loading: false });
      return null;
    }
  },

  createDiscountCode: async (codeData) => {
    set({ loading: true, error: null });
    try {
      const response = await api.post('/discount/createDiscount', {
        codeData,
      });
      const data = await response.data;
      
      if (data.success) {
        set((state) => ({ 
          discountCodes: [...state.discountCodes, data.data],
          loading: false 
        }));
      } else {
        set({ error: 'Failed to create discount code', loading: false });
      }
    } catch (error) {
      console.log('Error creating discount code:', error);
      set({ error: 'Failed to create discount code', loading: false });
    }
  },

  updateDiscountCodeById: async (id, codeData) => {
    set({ loading: true, error: null });
    try {
      const response = await api.put(`/discount/updateDiscountById/${id}`, {
        headers: {
          'Content-Type': 'application/json',
        },
    codeData,
      });
      const data = await response.data;
      
      if (data.success) {
        set((state) => ({
          discountCodes: state.discountCodes.map((code) =>
            code._id === id ? { ...code, ...data.data } : code
          ),
          loading: false
        }));
      } else {
        set({ error: 'Failed to update discount code', loading: false });
      }
    } catch (error) {
      console.log('Error updating discount code:', error);
      set({ error: 'Failed to update discount code', loading: false });
    }
  },

  deleteDiscountCodeById: async (id) => {
    set({ loading: true, error: null });
    try {
      const response = await api.delete(`/discount/deleteDiscountById/${id}`, {
        method: 'DELETE',
      });
      const data = await response.data;
      
      if (data.success) {
        set((state) => ({
          discountCodes: state.discountCodes.filter((code) => code._id !== id),
          loading: false
        }));
      } else {
        set({ error: 'Failed to delete discount code', loading: false });
      }
    } catch (error) {
      console.log('Error deleting discount code:', error);
      set({ error: 'Failed to delete discount code', loading: false });
    }
  },
}));