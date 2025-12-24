import { create } from "zustand";
import { persist } from "zustand/middleware";
import axios from "axios";
import { AxiosError } from "axios";
import api from "@/lib/axios";
import Cookies from "js-cookie";

import { getEmail, setEmail, unauthorized } from "../utility/utility";

interface UserStoreState {
  isLoggedIn: boolean;
  user: string;
  isLogin: () => boolean;

  // Login
  loginFormData: { email: string };
  loginOnChange: (name: string, value: string) => void;

  // OTP
  OtpFormData: { otp: string };
  OtpOnChange: (name: string, value: string) => void;

  isFormSubmit: boolean;
  
  // New method for initialization
  initializeAuth: () => void;
  
  UserLoginRequest: (
    email: string,
    password: string
  ) => Promise<{
    status: "success" | "error";
    message?: string;
    token?: string;
  }>;
  UserSignupRequest: (
    email: string,
    password: string,
    firstName: string,
    lastName: string
  ) => Promise<{ status: "success" | "error" | "false"; message?: string }>;

  UserForgetPasswordRequest: (
    email: string
  ) => Promise<{
    status: "success" | "error";
    message?: string;
    token?: string;
  }>;

  VerifyOtpRequest: (
    otp: string
  ) => Promise<{ status: "success" | "error"; message?: string }>;

  UserNewPassword: (
    password: string,
    confirmPassword: string
  ) => Promise<{ status: "success" | "error" | "false"; message?: string }>;

  UserLogoutRequest: () => Promise<string>;
}

const useUserStore = create<UserStoreState>()(
  persist(
    (set, get) => ({
      // ---- Auth ----
      user: "",
      isLoggedIn: false, // Initialize as false, will be set by initializeAuth
      isLogin: () => !!Cookies.get("token"),

      // ---- Initialize Auth State ----
      initializeAuth: () => {
        const token = Cookies.get("token");
        const currentState = get();
        
        console.log("Initializing auth:", { 
          token: !!token, 
          persistedUser: currentState.user,
          persistedIsLoggedIn: currentState.isLoggedIn 
        });

        if (token) {
          // Token exists, ensure consistent state
          if (!currentState.user) {
            // If we have token but no user ID, we're logged in but missing user data
            // You might want to fetch user data here if needed
            set({ isLoggedIn: true });
            console.log("Token exists but no user - setting isLoggedIn: true");
          } else {
            // Both token and user exist - everything is consistent
            set({ isLoggedIn: true });
            console.log("Token and user exist - auth state consistent");
          }
        } else {
          // No token - clear everything
          set({ isLoggedIn: false, user: "" });
          console.log("No token - clearing auth state");
        }
      },

      // ---- Login ----
      loginFormData: { email: "" },
      loginOnChange: (name, value) => {
        set((state) => ({
          loginFormData: {
            ...state.loginFormData,
            [name]: value,
          },
        }));
      },

      // ---- OTP ----
      OtpFormData: { otp: "" },
      OtpOnChange: (name, value) => {
        set((state) => ({
          OtpFormData: {
            ...state.OtpFormData,
            [name]: value,
          },
        }));
      },

      // ---- State ----
      isFormSubmit: false,

      // ---- API Calls ----
      UserLoginRequest: async (email, password) => {
        try {
          console.log("Login attempt:", email, password);
          const res = await api.post("/admin/signin", {
            email,
            password,
          });

          console.log("Login response:", res.data);
          
          // Set token and user data
          Cookies.set("token", res.data.token);
          const userId = res.data.data._id;
          setEmail(res.data.data.email);
          set({ 
            user: userId,
            isLoggedIn: true 
          });

          console.log("Login successful - user ID set:", userId);

          return {
            status: "success",
            message: res.data.message,
            token: res.data.token,
          };
        } catch (error: unknown) {
          const err = error as AxiosError<{ message?: string }>;
          console.log("Login error:", err);
          return {
            status: "error",
            message: err.response?.data?.message || err.message,
          };
        }
      },

      UserSignupRequest: async (email, password, firstName, lastName) => {
        try {
          const res = await api.post("/admin/signup", {
            email,
            password,
            firstName,
            lastName,
          });

          return res.data;
        } catch (error: unknown) {
          console.log(error);

          const err = error as AxiosError<{ message: string }>;

          return {
            status: "error",
            message: err.response?.data?.message || err.message,
          };
        }
      },

      UserForgetPasswordRequest: async (email) => {
        try {
          const res = await api.post("/admin/forget-password", { email });
          console.log("Forget password request sent");
          setEmail(email);
          return res.data;
        } catch (error: unknown) {
          const err = error as AxiosError<{ message: string }>;

          return {
            status: "error",
            message: err.response?.data?.message || err.message,
          };
        }
      },

      VerifyOtpRequest: async (otp) => {
        const email = getEmail();
        console.log("Verifying OTP for email:", email);
        const res = await api.post("/admin/verifyOtp", { email, otp });

        if (res.data.status === "success") {
          console.log("OTP verification successful");
          return { status: "success", message: res.data.message };
        } else {
          console.log("OTP verification failed:", res);
          return { status: "error", message: res.data.message };
        }
      },
      
      UserNewPassword: async (password, confirmPassword) => {
        const email = getEmail();
        const res = await api.post("/admin/reset-password", {
          email,
          password,
          confirmPassword,
        });
        console.log("Password reset response:", res);
        if (res.data.success === true) {
          console.log("Password reset successful");
          return { status: "success", message: res.data.message };
        } else {
          console.log("Password reset failed");
          return { status: "error", message: res.data.message };
        }
      },

      UserLogoutRequest: async () => {
        console.log("Logging out");
        try {
          const res = await api.post("/admin/signout");
          
          console.log(res.data,"kdkdk")
          Cookies.remove("token");
    
          set({ 
            user: "", 
            isLoggedIn: false 
          });
          console.log("Logout successful");
          return res.data["status"];
        } catch (error) {
          console.log("Logout error:", error);
          // Still clear local state even if API call fails
          Cookies.remove("token");
          set({ 
            user: "", 
            isLoggedIn: false 
          });
          return "success"; // Or handle error appropriately
        }
      },
    }),
    {
      name: "user-store",
      partialize: (state) => ({
        isLoggedIn: state.isLoggedIn,
        user: state.user,
        loginFormData: state.loginFormData,
      }),
      // Optional: Add version to handle future migrations
      version: 1,
    }
  )
);

// Initialize auth state when store is created
useUserStore.getState().initializeAuth();

// Optional: Also initialize when the module loads (in case of SSR or hot reload)
if (typeof window !== 'undefined') {
  // You can also re-initialize on focus if needed
  window.addEventListener('focus', () => {
    useUserStore.getState().initializeAuth();
  });
}

export default useUserStore;