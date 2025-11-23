
'use client'
import React, { useEffect } from "react";
import { ArrowLeft, Edit } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useBlogStore } from '@/app/store/blogStore';

export default function BlogDetails() {
  const params = useParams();
  const id = params.id as string;
  const { currentBlog, fetchBlogById, loading } = useBlogStore();

  useEffect(() => {
    if (id) {
      fetchBlogById(id);
    }
  }, [id, fetchBlogById]);

  if (loading) {
    return (
      <div className="min-h-screen ml-16 flex justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#C9A040]"></div>
      </div>
    );
  }

  if (!currentBlog) {
    return (
      <div className="min-h-screen ml-16 flex justify-center items-center">
        <div className="text-gray-500">Blog not found</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen ml-16 text-gray-800">
      {/* Header */}
      <div className="bg-white  px-4 py-4 rounded-lg">
        <div className=" flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Link href="/pages/blogs">
              {" "}
              <button className="flex items-center hover:text-gray-900">
                <ArrowLeft className="w-4 h-4 mr-1" />
                <span>Blog Management</span>
              </button>
            </Link>

            <span className="text-gray-400">&gt;</span>
            <span className="text-gray-900">Blog Details</span>
          </div>
          <Link href={`/pages/blogs/edit/${currentBlog._id}`}>
            {" "}
            <button className="bg-[#C9A040] hover:bg-yellow-600  px-6 py-3 rounded-lg flex items-center gap-2 text-sm font-blod">
              <Edit className="w-4 h-4" />
              Edit Blog
            </button>
          </Link>
        </div>
      </div>

      {/* Main Content */}
      <div className="  py-8">
        {/* Title Section */}
        <div className="bg-white rounded-lg shadow-sm p-8 mb-6">
          <h1 className="text-3xl font-bold text-center">{currentBlog.name}</h1>
        </div>

        {/* Image Section */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden mb-6">
          <img
            src={currentBlog.image}
            alt={currentBlog.name}
            className="w-full h-64 object-cover"
          />
        </div>

        {/* Description Section */}
        <div className="bg-white rounded-lg shadow-sm p-8 mb-6">
          <h2 className="text-xl font-bold mb-4">Description</h2>
          <div 
            className="text-gray-700 text-sm leading-relaxed"
            dangerouslySetInnerHTML={{ __html: currentBlog.description || 'No description available' }}
          />
        </div>

        {/* Meta Information */}
        <div className="bg-white rounded-lg shadow-sm p-8">
          <h2 className="text-xl font-bold mb-4">Blog Information</h2>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="font-semibold">Created:</span>{' '}
              {new Date(currentBlog.createdAt).toLocaleDateString()}
            </div>
            <div>
              <span className="font-semibold">Last Updated:</span>{' '}
              {new Date(currentBlog.updatedAt).toLocaleDateString()}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}