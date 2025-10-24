'use client'
import React, { useState } from 'react';
import { Edit2, X, Save } from 'lucide-react';
import { PencilEdit02Icon } from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';

interface ProfileData {
  name: string;
  phone: string;
  email: string;
  avatar: string;
}

const initialData: ProfileData = {
  name: "John Doe",
  phone: "+1 (555) 123-4567",
  email: "john.doe@example.com",
  avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=300&fit=crop"
};

export default function ProfilePage() {
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState<ProfileData>(initialData);
  const [tempData, setTempData] = useState<ProfileData>(initialData);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const handleEdit = () => {
    setIsEditing(true);
    setTempData(profileData);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setTempData(profileData);
  };

  const handleSave = () => {
    setProfileData(tempData);
    setIsEditing(false);
    console.log('Saved Profile Data:', tempData);
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
        setTempData(prev => ({ ...prev, avatar: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="min-h-screen ml-8">
      <div className="">
        {/* Header */}
        <div className="flex justify-between items-center mb-8 bg-white px-10 py-6 rounded-lg">
          <h1 className="text-3xl font-bold text-gray-900 ">Profile</h1>
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
                className="flex items-centerjustify-center gap-2 px-6 py-3 bg-gray-200 font-semibold text-[16px] leading-[24px] tracking-[0]text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
              >
                <X size={18} />
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="flex items-center justify-center gap-2 px-6 py-3 bg-[#C9A040] text-gray-800 font-semibold text-[16px] leading-[24px] tracking-[0] rounded-lg hover:bg-[#9e7e33] transition-colors"
              >
                <Save size={18} />
                Save
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
                  src={tempData.avatar}
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
                      {profileData.name}
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
                      {profileData.phone}
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