import api from '@/lib/axios';
import { create } from 'zustand';

export interface ServicePricing {
  _id: string;
  shippingCost: number;
  AdvertisingText: string;
  MinimumFreeShipping: number;
  createdAt: string;
  updatedAt: string;
  __v?: number;
}

// Frontend interface for form data
export interface ServicePricingFormData {
  shippingCost: number;
  advertisingText: string;
  minimumFreeShippingAmount: number;
}

interface ServicePricingState {
  servicePricing: ServicePricing | null;
  loading: boolean;
  error: string | null;
  
  // Actions
  setServicePricing: (pricing: ServicePricing) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  
  // API calls
  fetchServicePricing: () => Promise<void>;
  updateServicePricing: (id: string, formData: ServicePricingFormData) => Promise<void>;
}

export const useServicePricingStore = create<ServicePricingState>((set, get) => ({
  servicePricing: null,
  loading: false,
  error: null,

  setServicePricing: (pricing) => set({ servicePricing: pricing }),
  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),

  fetchServicePricing: async () => {
    set({ loading: true, error: null });
    try {
      const response = await api.get('/servicePricing/getServicePricing');
      const data = await response.data;
      
      if (data.success) {
        set({ servicePricing: data.data, loading: false });
      } else {
        set({ error: 'Failed to fetch service pricing', loading: false });
      }
    } catch (error) {
      console.log('Error fetching service pricing:', error);
      set({ error: 'Failed to fetch service pricing', loading: false });
    }
  },

  updateServicePricing: async (id: string, formData: ServicePricingFormData) => {
    set({ loading: true, error: null });
    try {
      // Convert frontend field names to backend field names
      const backendData = {
        shippingCost: formData.shippingCost,
        AdvertisingText: formData.advertisingText,
        MinimumFreeShipping: formData.minimumFreeShippingAmount
      };
      console.log(backendData,"71")

      const response = await api.put(`/servicePricing/updateServicePricing/${id}`, {
       
       backendData
      });
      
      const data = await response.data;
      console.log(response.data)
      
      if (data.success) {
        set({ servicePricing: data.data, loading: false });
      } else {
        set({ error: 'Failed to update service pricing', loading: false });
      }
    } catch (error) {
      console.log('Error updating service pricing:', error);
      set({ error: 'Failed to update service pricing', loading: false });
    }
  },
}));

// Helper function to convert backend data to frontend form data
export const convertToFormData = (backendData: ServicePricing): ServicePricingFormData => ({
  shippingCost: backendData.shippingCost,
  advertisingText: backendData.AdvertisingText,
  minimumFreeShippingAmount: backendData.MinimumFreeShipping
});