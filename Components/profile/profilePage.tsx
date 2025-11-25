'use client'
import React, { useState, useEffect } from 'react';
import { Edit2, X, Save } from 'lucide-react';
import { PencilEdit02Icon } from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';
import api from '@/lib/axios';

interface ProfileData {
  _id?: string;
  firstName?: string;
  lastName?: string;
  name: string;
  phone: string;
  email: string;
  image: string;
  isSignin?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export default function ProfilePage() {
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState<ProfileData>({
    name: "",
    phone: "",
    email: "",
    image: ""
  });
  const [tempData, setTempData] = useState<ProfileData>({
    name: "",
    phone: "",
    email: "",
    image: ""
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  // Fetch profile data from API
  const fetchProfileData = async () => {
    try {
      setLoading(true);
      const response = await api.get('/admin/getAdmin');
      const result = await response.data;
      console.log(result,"46")
      
      if (result.success) {
        const apiData = result.data;
        const formattedData: ProfileData = {
          _id: apiData._id,
          name: apiData.name || `${apiData.firstName || ''} ${apiData.lastName || ''}`.trim() || 'No Name',
          phone: apiData.phone || '',
          email: apiData.email,
          image: apiData.image,
          isSignin: apiData.isSignin,
          createdAt: apiData.createdAt,
          updatedAt: apiData.updatedAt
        };
        
        setProfileData(formattedData);
        setTempData(formattedData);
      }
    } catch (error) {
      console.error('Error fetching profile data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfileData();
  }, []);

  const handleEdit = () => {
    setIsEditing(true);
    setTempData(profileData);
    setImageFile(null);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setTempData(profileData);
    setImageFile(null);
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      
      // Create FormData to handle file upload

      console.log(tempData,"92")
      const formData = new FormData();
      
      // Add text fields
      formData.append('name', tempData.name);
      formData.append('phone', tempData.phone);
      formData.append('email', tempData.email);
      
      // Add image file if a new one was selected
      if (imageFile) {
        formData.append('image', imageFile);
      }

      const response = await api.put('/admin/updateAdmin', 
        formData,{headers: { 'Content-Type': 'multipart/form-data' }},
      
      );

      const result = await response.data;

      if (result.success) {
        const updatedData = result.data;
        const formattedData: ProfileData = {
          _id: updatedData._id,
          name: updatedData.name || `${updatedData.firstName || ''} ${updatedData.lastName || ''}`.trim(),
          phone: updatedData.phone,
          email: updatedData.email,
          image: updatedData.image || tempData.image,
          isSignin: updatedData.isSignin,
          createdAt: updatedData.createdAt,
          updatedAt: updatedData.updatedAt
        };
        
        setProfileData(formattedData);
        setIsEditing(false);
        setImageFile(null);
        console.log('Profile updated successfully:', formattedData);
      } else {
        console.error('Failed to update profile:', result);
        // Handle error (you might want to show an error message to the user)
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      // Handle error (you might want to show an error message to the user)
    } finally {
      setSaving(false);
    }
  };

  const handleChange = (field: keyof ProfileData, value: string) => {
    setTempData(prev => ({ ...prev, [field]: value }));
  };

  const handleImageClick = () => {
    if (isEditing && fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        // Set the preview image
        setTempData(prev => ({ ...prev, image: reader.result as string }));
        // Store the actual file for upload
        setImageFile(file);
      };
      reader.readAsDataURL(file);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen ml-8 flex items-center justify-center text-gray-800">
        <div className="text-lg">Loading profile...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen ml-8  text-gray-800">
      <div className="">
        {/* Header */}
        <div className="flex justify-between items-center mb-8 bg-white px-10 py-6 rounded-lg">
          <h1 className="text-3xl font-bold text-gray-900">Profile</h1>
          {!isEditing ? (
            <button
              onClick={handleEdit}
              className="flex items-center justify-center gap-2 px-6 py-3 bg-[#C9A040] text-gray-800 rounded-lg hover:bg-[#9e7e33] transition-colors font-semibold text-[16px] leading-[24px] tracking-[0]"
            >
              <HugeiconsIcon icon={PencilEdit02Icon} />
              Edit
            </button>
          ) : (
            <div className="flex gap-3">
              <button
                onClick={handleCancel}
                disabled={saving}
                className="flex items-center justify-center gap-2 px-6 py-3 bg-gray-200 font-semibold text-[16px] leading-[24px] tracking-[0] text-gray-700 rounded-lg hover:bg-gray-300 transition-colors disabled:opacity-50"
              >
                <X size={18} />
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={saving}
                className="flex items-center justify-center gap-2 px-6 py-3 bg-[#C9A040] text-gray-800 font-semibold text-[16px] leading-[24px] tracking-[0] rounded-lg hover:bg-[#9e7e33] transition-colors disabled:opacity-50"
              >
                <Save size={18} />
                {saving ? 'Saving...' : 'Save'}
              </button>
            </div>
          )}
        </div>

        {/* Profile Card */}
        <div className="bg-white rounded-2xl shadow-sm p-8 py-10">
          <div className="flex flex-col md:flex-row gap-8">
            {/* Avatar Section */}
            <div className="relative w-48 h-48">
              <div className="w-48 h-48 rounded-full overflow-hidden border-4 border-gray-100">
                <img
                  src={isEditing ? tempData.image : profileData.image}
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              </div>
              {isEditing && (
                <>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                  />
                  <button 
                    onClick={handleImageClick}
                    className="absolute -bottom-1 right-2 w-12 h-12 bg-[#C9A040] rounded-full flex items-center justify-center text-gray-800 shadow-lg hover:bg-[#9e7e33] transition-colors border-2 border-[#C9A040]"
                  >
                    <HugeiconsIcon icon={PencilEdit02Icon} />
                  </button>
                </>
              )}
            </div>

            {/* Personal Information */}
            <div className="flex-1">
              <h2 className="font-semibold text-[28px] leading-[36px] tracking-[0] text-gray-900 mb-6">
                Personal Information
              </h2>
              
              <div className="grid md:grid-cols-2 gap-6">
                {/* Name Field */}
                <div>
                  <label className="block font-semibold text-[18px] leading-[26px] tracking-[0] text-gray-700 mb-2">
                    Name
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={tempData.name}
                      onChange={(e) => handleChange('name', e.target.value)}
                      className="w-full px-4 py-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#C9A040] focus:border-transparent outline-none bg-[#F5F5F5]"
                      placeholder="Enter name"
                    />
                  ) : (
                    <div className="w-full px-4 py-4 bg-[#F5F5F5] rounded-lg text-gray-900">
                      {profileData.name || 'Not set'}
                    </div>
                  )}
                </div>

                {/* Phone Field */}
                <div>
                  <label className="block font-semibold text-[18px] leading-[26px] tracking-[0] text-gray-700 mb-2">
                    Phone
                  </label>
                  {isEditing ? (
                    <input
                      type="tel"
                      value={tempData.phone}
                      onChange={(e) => handleChange('phone', e.target.value)}
                      className="w-full px-4 py-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#C9A040] focus:border-transparent outline-none bg-[#F5F5F5]"
                      placeholder="Enter phone"
                    />
                  ) : (
                    <div className="w-full px-4 py-4 bg-[#F5F5F5] rounded-lg text-gray-900">
                      {profileData.phone || 'Not set'}
                    </div>
                  )}
                </div>

                {/* Email Field */}
                <div className="md:col-span-2">
                  <label className="block font-semibold text-[18px] leading-[26px] tracking-[0] text-gray-700 mb-2">
                    Email
                  </label>
                  {isEditing ? (
                    <input
                      type="email"
                      value={tempData.email}
                      onChange={(e) => handleChange('email', e.target.value)}
                      className="w-full px-4 py-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#C9A040] focus:border-transparent outline-none bg-[#F5F5F5]"
                      placeholder="Enter email"
                    />
                  ) : (
                    <div className="w-full px-4 py-4 bg-[#F5F5F5] rounded-lg text-gray-900">
                      {profileData.email}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}