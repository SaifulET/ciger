// stores/brandStore.ts
import api from '@/lib/axios';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// API response interfaces
interface ApiBrand {
  _id: string;
  name: string;
  feature: boolean;
  image?: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

interface ApiResponse {
  success: boolean;
  count: number;
  data: ApiBrand[];
}

// UI interface (matching API structure)
interface Brand {
  _id: string;
  name: string;
  feature: boolean;
  image?: string;
  createdAt: string;
  updatedAt: string;
}

interface BrandStore {
  // State
  brands: Brand[];
  loading: boolean;
  error: string | null;
  currentBrand: Brand | null;
  
  // Actions
  fetchBrands: () => Promise<void>;
  fetchBrandById: (id: string) => Promise<void>;
  createBrand: (brandData: { name: string; feature: boolean; image?: File }) => Promise<void>;
  updateBrand: (id: string, brandData: { name: string; feature: boolean; image?: File }) => Promise<void>;
  deleteBrand: (id: string) => Promise<void>;
  setCurrentBrand: (brand: Brand | null) => void;
  clearError: () => void;
}

export const useBrandStore = create<BrandStore>()(
  persist(
    (set, get) => ({
      // Initial state
      brands: [],
      loading: false,
      error: null,
      currentBrand: null,

      // Fetch all brands
      fetchBrands: async () => {
        set({ loading: true, error: null });
        try {
          const response = await api.get('/brand/getAllBrands');
          const data: ApiResponse = await response.data;
          
          if (data.success) {
            set({ brands: data.data, loading: false });
          } else {
            set({ error: 'Failed to fetch brands', loading: false });
          }
        } catch (error) {
          set({ error: 'Network error occurred', loading: false });
        }
      },

      // Fetch brand by ID
      fetchBrandById: async (id: string) => {
        set({ loading: true, error: null });
        try {
          const response = await api.get(`/brand/getBrandById/${id}`);
          const data = await response.data;
          
          if (data.success) {
            set({ currentBrand: data.data, loading: false });
          } else {
            set({ error: 'Failed to fetch brand', loading: false });
          }
        } catch (error) {
          set({ error: 'Network error occurred', loading: false });
        }
      },

      // Create new brand with file upload
      createBrand: async (brandData) => {
        set({ loading: true, error: null });
        try {
          const formData = new FormData();
          formData.append('name', brandData.name);
          formData.append('feature', brandData.feature.toString());
          
          if (brandData.image) {
            formData.append('image', brandData.image);
          }

          const response = await api.post('/brand/createbrand', 
            formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
          }
          );
          
          const data = await response.data;
          
          if (data.success) {
            // Refresh the brands list
            await get().fetchBrands();
            set({ loading: false });
          } else {
            set({ error: data.message || 'Failed to create brand', loading: false });
          }
        } catch (error) {
          set({ error: 'Network error occurred', loading: false });
        }
      },

      // Update brand with file upload
      updateBrand: async (id: string, brandData) => {
        set({ loading: true, error: null });
        try {
          const formData = new FormData();
          formData.append('name', brandData.name);
          formData.append('feature', brandData.feature.toString());
          
          if (brandData.image) {
            formData.append('image', brandData.image);
          }

          const response = await api.put(`/brand/updateBrand/${id}`,  formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
          });
          
          const data = await response.data;
          
          if (data.success) {
            // Refresh the brands list and current brand
            await get().fetchBrands();
            if (get().currentBrand?._id === id) {
              await get().fetchBrandById(id);
            }
            set({ loading: false });
          } else {
            set({ error: data.message || 'Failed to update brand', loading: false });
          }
        } catch (error) {
          set({ error: 'Network error occurred', loading: false });
        }
      },

      // Delete brand
      deleteBrand: async (id: string) => {
        set({ loading: true, error: null });
        try {
          const response = await api.delete(`/brand/deleteBrand/${id}`, {
            method: 'DELETE',
          });
          const data = await response.data;
          
          if (data.success) {
            // Remove from local state and refresh
            set({ 
              brands: get().brands.filter(brand => brand._id !== id),
              loading: false 
            });
          } else {
            set({ error: 'Failed to delete brand', loading: false });
          }
        } catch (error) {
          set({ error: 'Network error occurred', loading: false });
        }
      },

      // Set current brand (for view/edit)
      setCurrentBrand: (brand: Brand | null) => {
        set({ currentBrand: brand });
      },

      // Clear errors
      clearError: () => {
        set({ error: null });
      },
    }),
    {
      name: 'brand-storage',
      partialize: (state) => ({ 
        brands: state.brands,
        currentBrand: state.currentBrand 
      }),
    }
  )
);