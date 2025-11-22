// app/store/blogStore.ts
import api from '@/lib/axios';
import { create } from 'zustand';

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

interface BlogStore {
  blogs: Blog[];
  currentBlog: Blog | null;
  loading: boolean;
  
  // Actions
  fetchAllBlogs: () => Promise<void>;
  fetchBlogById: (id: string) => Promise<void>;
  createBlog: (blogData: FormData) => Promise<ApiResponse>;
  updateBlog: (id: string, blogData: FormData) => Promise<ApiResponse>;
  setCurrentBlog: (blog: Blog | null) => void;
}

export const useBlogStore = create<BlogStore>((set, get) => ({
  blogs: [],
  currentBlog: null,
  loading: false,

  fetchAllBlogs: async () => {
    set({ loading: true });
    try {
      const response = await api.get('/blog/getAllBlogs');
      const data = await response.data;
      
      if (data.success) {
        set({ blogs: data.data });
      } else {
        console.error('Failed to fetch blogs:', data);
      }
    } catch (error) {
      console.error('Error fetching blogs:', error);
    } finally {
      set({ loading: false });
    }
  },

  fetchBlogById: async (id: string) => {
    set({ loading: true });
    try {
      const response = await api.get(`/blog/getBlogById/${id}`);
      const data = await response.data;
      
      if (data.success) {
        set({ currentBlog: data.data });
      } else {
        console.error('Failed to fetch blog:', data);
      }
    } catch (error) {
      console.error('Error fetching blog:', error);
    } finally {
      set({ loading: false });
    }
  },

  createBlog: async (blogData: FormData): Promise<ApiResponse> => {
    set({ loading: true });
    try {
        console.log(blogData,'78')
      const response = await api.post('/blog/createBlog', 
      blogData,  { headers: { 'Content-Type': 'multipart/form-data' }}
      );

      console.log(response)
      const data = await response.data;

      
      if (data.success) {
        get().fetchAllBlogs();
      }
      return data;
    } catch (error) {
      console.error('Error creating blog:', error);
      return { success: false, message: 'Failed to create blog' };
    } finally {
      set({ loading: false });
    }
  },

  updateBlog: async (id: string, blogData: FormData): Promise<ApiResponse> => {
    set({ loading: true });
    try {
      const response = await api.put(`/blog/updateBlog/${id}`, 
        blogData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
      );
      console.log(blogData)
      const data = await response.data
      console.log(data)
      if (data.success) {
        get().fetchAllBlogs();
        get().fetchBlogById(id);
      }
      return data;
    } catch (error) {
      console.error('Error updating blog:', error);
      return { success: false, message: 'Failed to update blog' };
    } finally {
      set({ loading: false });
    }
  },

  setCurrentBlog: (blog: Blog | null) => {
    set({ currentBlog: blog });
  },
}));