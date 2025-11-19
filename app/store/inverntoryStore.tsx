import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Product, ProductFormData, Brand, ApiResponse } from '@/Components/inventory/inventory';
import api from '@/lib/axios';

// Separate response interfaces for better type safety
interface ProductsResponse extends ApiResponse {
  data?: Product[];
}

interface BrandsResponse extends ApiResponse {
  data?: Brand[];
}

interface SingleProductResponse extends ApiResponse {
  data?: Product;
}

interface InventoryState {
  products: Product[];
  brands: Brand[];
  currentProduct: Product | null;
  loading: boolean;
  error: string | null;
  
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  
  getAllProducts: () => Promise<void>;
  getProductById: (id: string) => Promise<void>;
  getAllBrands: () => Promise<void>;
  createProduct: (productData: ProductFormData) => Promise<ApiResponse>;
  updateProduct: (id: string, productData: ProductFormData) => Promise<ApiResponse>;
  deleteProduct: (id: string) => Promise<ApiResponse>;
  
  clearCurrentProduct: () => void;
  clearError: () => void;
}

export const useInventoryStore = create<InventoryState>()(
  persist(
    (set, get) => ({
      products: [],
      brands: [],
      currentProduct: null,
      loading: false,
      error: null,

      setLoading: (loading) => set({ loading }),
      setError: (error) => set({ error }),

      getAllProducts: async () => {
        set({ loading: true, error: null });
        try {
          const response = await api.get("/product/getAllProduct");
          const apiResponse: ProductsResponse = response.data;
          
          if (apiResponse.success && apiResponse.data) {
            set({ products: apiResponse.data, loading: false });
          } else {
            throw new Error(apiResponse.message || 'Failed to fetch products');
          }
        } catch (error: unknown) {
          const errorMessage = error instanceof Error ? error.message : 'Failed to fetch products';
          set({ error: errorMessage, loading: false });
        }
      },

      getAllBrands: async () => {
        try {
          const response = await api.get("/brand/getAllBrands");
          const apiResponse: BrandsResponse = response.data;
          
          if (apiResponse.success && apiResponse.data) {
            set({ brands: apiResponse.data });
          } else {
            throw new Error(apiResponse.message || 'Failed to fetch brands');
          }
        } catch (error: unknown) {
          console.error('Failed to fetch brands:', error);
        }
      },

      getProductById: async (id: string) => {
        set({ loading: true, error: null });
        try {
         const response = await api.get(`/product/getProductById/${id}`);
         const brand = response.data.data.brandId.name;


response.data.data.brand = brand;
const apiResponse: SingleProductResponse = response.data;




          
          if (apiResponse.success && apiResponse.data) {
            set({ currentProduct: apiResponse.data, loading: false });
          } else {
            throw new Error(apiResponse.message || 'Failed to fetch product');
          }
        } catch (error: unknown) {
          const errorMessage = error instanceof Error ? error.message : 'Failed to fetch product';
          set({ error: errorMessage, loading: false });
        }
      },

      createProduct: async (productData: ProductFormData): Promise<ApiResponse> => {
        set({ loading: true, error: null });
        try {
          const formData = new FormData();
          
          // Add product fields
          formData.append('name', productData.productName);
          formData.append('price', productData.productPrice);
          formData.append('discount', productData.productSalePrice);
          formData.append('available', productData.productStock);
          formData.append('quantity', productData.productQuantity);
          formData.append('isBest', (productData.productState === 'bestSeller').toString());
          formData.append('isNew', (productData.productState === 'newArrivals').toString());
          formData.append('isInStock', (parseInt(productData.productStock) > 0).toString());
          formData.append('description', productData.productDescription);
          
          if (productData.category) formData.append('category', productData.category);
          if (productData.subCategory) formData.append('subCategory', productData.subCategory);
          if (productData.brand) formData.append('brand', productData.brand);

          // Append multiple images if exist
          if (productData.selectedImages && productData.selectedImages.length > 0) {
            for (const selectedImage of productData.selectedImages) {
              if (selectedImage.data && !selectedImage.data.startsWith('http')) {
                const base64Response = await fetch(selectedImage.data);
                const blob = await base64Response.blob();
                const file = new File([blob], selectedImage.name, { type: blob.type });
                formData.append('images', file);
              }
            }
          }

          const response = await api.post("/product/createProduct", formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
          });

          const apiResponse: ApiResponse = response.data;
          
          if (apiResponse.success) {
            set({ loading: false });
            get().getAllProducts();
            return apiResponse;
          } else {
            throw new Error(apiResponse.message || 'Failed to create product');
          }
        } catch (error: unknown) {
          const errorMessage = error instanceof Error ? error.message : 'Failed to create product';
          set({ error: errorMessage, loading: false });
          return { success: false, message: errorMessage };
        }
      },

      updateProduct: async (id: string, productData: ProductFormData): Promise<ApiResponse> => {
        set({ loading: true, error: null });
        try {
          const formData = new FormData();
          
          formData.append('name', productData.productName);
          formData.append('price', productData.productPrice);
          formData.append('discount', productData.productSalePrice);
          formData.append('available', productData.productStock);
          formData.append('quantity', productData.productQuantity);
          formData.append('isBest', (productData.productState === 'bestSeller').toString());
          formData.append('isNew', (productData.productState === 'newArrivals').toString());
          formData.append('isInStock', (parseInt(productData.productStock) > 0).toString());
          formData.append('description', productData.productDescription);
          
          if (productData.category) formData.append('category', productData.category);
          if (productData.subCategory) formData.append('subCategory', productData.subCategory);
          if (productData.brand) formData.append('brand', productData.brand);

          // Always pass existing images to prevent deletion
          if (productData.existingImages && productData.existingImages.length > 0) {
            productData.existingImages.forEach((imageUrl, index) => {
              formData.append(`existingImages[${index}]`, imageUrl);
            });
          } else {
            formData.append('existingImages', '[]');
          }

          // Append multiple new images if selected
          if (productData.selectedImages && productData.selectedImages.length > 0) {
            for (const selectedImage of productData.selectedImages) {
              if (selectedImage.data && !selectedImage.data.startsWith('http')) {
                const base64Response = await fetch(selectedImage.data);
                const blob = await base64Response.blob();
                const file = new File([blob], selectedImage.name, { type: blob.type });
                formData.append('images', file);
              }
            }
          }

          const response = await api.put(`/product/updateProductById/${id}`, formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
          });

          const apiResponse: ApiResponse = response.data;
          
          if (apiResponse.success) {
            set({ loading: false });
            get().getAllProducts();
            return apiResponse;
          } else {
            throw new Error(apiResponse.message || 'Failed to update product');
          }
        } catch (error: unknown) {
          const errorMessage = error instanceof Error ? error.message : 'Failed to update product';
          set({ error: errorMessage, loading: false });
          return { success: false, message: errorMessage };
        }
      },

      deleteProduct: async (id: string): Promise<ApiResponse> => {
        set({ loading: true, error: null });
        try {
          const response = await api.delete(`/product/deleteProductById/${id}`);
          const apiResponse: ApiResponse = response.data;
          
          if (apiResponse.success) {
            set({ loading: false, products: get().products.filter(product => product._id !== id) });
            return apiResponse;
          } else {
            throw new Error(apiResponse.message || 'Failed to delete product');
          }
        } catch (error: unknown) {
          const errorMessage = error instanceof Error ? error.message : 'Failed to delete product';
          set({ error: errorMessage, loading: false });
          return { success: false, message: errorMessage };
        }
      },

      clearCurrentProduct: () => set({ currentProduct: null }),
      clearError: () => set({ error: null }),
    }),
    {
      name: 'inventory-storage',
      partialize: (state) => ({ 
        products: state.products, 
        brands: state.brands,
        currentProduct: state.currentProduct 
      }),
    }
  )
);
