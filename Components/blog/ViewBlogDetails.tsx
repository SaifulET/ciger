import React from "react";
import { ArrowLeft, Edit } from "lucide-react";
import Link from "next/link";

// Sample blog data - replace with your actual data
const blogData = {
  title: "Hang up your boots",
  image:
    "https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=800&h=400&fit=crop",
  description:
    "A little change in your smoking routine won't hurt you. The Good Stuff Red Pipe Tobacco 16oz bags are designed to impress your senses in such a way, where you can keep smoking their contents for many years on end and never get tired of them. What's great about this product is that unlike its competition, this delicatessen sponsors a full flavored smoke without any compromise on the strength of taste. Filled into even proportions in order to ensure smoking consistency, you can now enjoy your favorite tobacco from any pipe or roll your own allies. Stuffed into re-sealable 16oz packages, Good Stuff has appropriated their genius engineering for their packages in order to preserve the integrity of their contents. That means that you are more than welcome to enjoy your favorite tobacco on any single occasion of time without having to worry about a depreciation in its quality. Buy twelve of these bags now and save 5%.",
  tag: "A little change in your smoking routine won't hurt you. The Good Stuff Red Pipe Tobacco 16oz bags are designed to impress your senses in such a way, where you can keep smoking their contents for many years on end and never get tired of them. What's great about this product is that unlike its competition, this delicatessen sponsors a full flavored smoke without any compromise on the strength of taste. Filled into even proportions in order to ensure smoking consistency, you can now enjoy your favorite tobacco from any pipe or roll your own allies. Stuffed into re-sealable 16oz packages, Good Stuff has appropriated their genius engineering for their packages in order to preserve the integrity of their contents. That means that you are more than welcome to enjoy your favorite tobacco on any single occasion of time without having to worry about a depreciation in its quality. Buy twelve of these bags now and save 5%.",
};

export default function BlogDetails() {
  return (
    <div className="min-h-screen ml-16">
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
          <Link href="/pages/blogs/edit/123">
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
          <h1 className="text-3xl font-bold text-center">{blogData.title}</h1>
        </div>

        {/* Image Section */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden mb-6">
          <img
            src={blogData.image}
            alt={blogData.title}
            className="w-full h-64 object-cover"
          />
        </div>

        {/* Description Section */}
        <div className="bg-white rounded-lg shadow-sm p-8 mb-6">
          <h2 className="text-xl font-bold mb-4">Description</h2>
          <p className="text-gray-700 text-sm leading-relaxed">
            {blogData.description}
          </p>
        </div>

        {/* Tag Section */}
        <div className="bg-white rounded-lg shadow-sm p-8">
          <h2 className="text-xl font-bold mb-4">Tag</h2>
          <p className="text-gray-700 text-sm leading-relaxed">
            {blogData.tag}
          </p>
        </div>
      </div>
    </div>
  );
}
