// app/store/blogStore.ts
import api from '@/lib/axios';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface Blog {
  _id: string;
  name: string;
  description?: string;
  image: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  message?: string;
}

// Separate response interfaces for better type safety
interface BlogsResponse extends ApiResponse {
  data?: Blog[];
}

interface SingleBlogResponse extends ApiResponse {
  data?: Blog;
}

interface BlogFormData {
  name: string;
  description: string;
  image?: File | string;
}

interface BlogStore {
  blogs: Blog[];
  currentBlog: Blog | null;
  loading: boolean;
  error: string | null;
  
  // State setters
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  
  // Actions
  fetchAllBlogs: () => Promise<void>;
  fetchBlogById: (id: string) => Promise<void>;
  createBlog: (blogData: BlogFormData) => Promise<ApiResponse>;
  updateBlog: (id: string, blogData: BlogFormData) => Promise<ApiResponse>;
  deleteBlog: (id: string) => Promise<ApiResponse>;
  
  setCurrentBlog: (blog: Blog | null) => void;
  clearCurrentBlog: () => void;
  clearError: () => void;
}

export const useBlogStore = create<BlogStore>()(
  persist(
    (set, get) => ({
      blogs: [],
      currentBlog: null,
      loading: false,
      error: null,

      setLoading: (loading) => set({ loading }),
      setError: (error) => set({ error }),

      fetchAllBlogs: async () => {
        set({ loading: true, error: null });
        try {
          const response = await api.get('/blog/getAllBlogs');
          const apiResponse: BlogsResponse = response.data;
          
          if (apiResponse.success && apiResponse.data) {
            set({ blogs: apiResponse.data, loading: false });
          } else {
            throw new Error(apiResponse.message || 'Failed to fetch blogs');
          }
        } catch (error: unknown) {
          const errorMessage = error instanceof Error ? error.message : 'Failed to fetch blogs';
          set({ error: errorMessage, loading: false });
        }
      },

      fetchBlogById: async (id: string) => {
        set({ loading: true, error: null });
        try {
          const response = await api.get(`/blog/getBlogById/${id}`);
          const apiResponse: SingleBlogResponse = response.data;
          
          if (apiResponse.success && apiResponse.data) {
            set({ currentBlog: apiResponse.data, loading: false });
          } else {
            throw new Error(apiResponse.message || 'Failed to fetch blog');
          }
        } catch (error: unknown) {
          const errorMessage = error instanceof Error ? error.message : 'Failed to fetch blog';
          set({ error: errorMessage, loading: false });
        }
      },

      createBlog: async (blogData: BlogFormData): Promise<ApiResponse> => {
        set({ loading: true, error: null });
        try {
          const formData = new FormData();
          
          // Add JSON data as string
          const jsonData = {
            name: blogData.name,
            description: blogData.description,
          };
          formData.append('name',blogData.name);
          formData.append('description',blogData.description);
          console.log(formData, jsonData,"116")
          // Add image file if provided
          if (blogData.image instanceof File) {
            formData.append('image', blogData.image);
          }

          const response = await api.post('/blog/createBlog', formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
          });

          const apiResponse: ApiResponse = response.data;
          
          if (apiResponse.success) {
            set({ loading: false });
            get().fetchAllBlogs();
            return apiResponse;
          } else {
            throw new Error(apiResponse.message || 'Failed to create blog');
          }
        } catch (error: unknown) {
          const errorMessage = error instanceof Error ? error.message : 'Failed to create blog';
          set({ error: errorMessage, loading: false });
          return { success: false, message: errorMessage };
        }
      },

      updateBlog: async (id: string, blogData: BlogFormData): Promise<ApiResponse> => {
        set({ loading: true, error: null });
        try {

          console.log("blogData",blogData)
          const formData = new FormData();
          
          // Add JSON data as string
          const jsonData = {
            name: blogData.name,
            description: blogData.description,
          };
          formData.append('name',blogData.name);
          formData.append('description',blogData.description);
          
          // Add image file if provided
          if (blogData.image instanceof File) {
            formData.append('image', blogData.image);
          }

          const response = await api.put(`/blog/updateBlog/${id}`, formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
          });

          const apiResponse: ApiResponse = response.data;
          
          if (apiResponse.success) {
            set({ loading: false });
            get().fetchAllBlogs();
            return apiResponse;
          } else {
            throw new Error(apiResponse.message || 'Failed to update blog');
          }
        } catch (error: unknown) {
          const errorMessage = error instanceof Error ? error.message : 'Failed to update blog';
          set({ error: errorMessage, loading: false });
          return { success: false, message: errorMessage };
        }
      },

      deleteBlog: async (id: string): Promise<ApiResponse> => {
        set({ loading: true, error: null });
        try {
          const response = await api.delete(`/blog/deleteBlog/${id}`);
          const apiResponse: ApiResponse = response.data;
          
          if (apiResponse.success) {
            set({ loading: false, blogs: get().blogs.filter(blog => blog._id !== id) });
            return apiResponse;
          } else {
            throw new Error(apiResponse.message || 'Failed to delete blog');
          }
        } catch (error: unknown) {
          const errorMessage = error instanceof Error ? error.message : 'Failed to delete blog';
          set({ error: errorMessage, loading: false });
          return { success: false, message: errorMessage };
        }
      },

      setCurrentBlog: (blog: Blog | null) => set({ currentBlog: blog }),
      clearCurrentBlog: () => set({ currentBlog: null }),
      clearError: () => set({ error: null }),
    }),
    {
      name: 'blog-storage',
      partialize: (state) => ({ 
        blogs: state.blogs, 
        currentBlog: state.currentBlog 
      }),
    }
  )
);