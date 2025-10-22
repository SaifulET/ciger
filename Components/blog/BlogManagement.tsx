'use client'
import React from 'react';
import { useRouter } from 'next/navigation';
import { PencilEdit02Icon } from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';

// Mock blog data
const blogData = [
  {
    id: 1,
    image: "https://images.unsplash.com/photo-1606665997683-23f0e1bd8f0a?w=400&h=300&fit=crop",
    title: "Cigar is the best product",
    description: "Discover the art of cigar smoking. From selecting the perfect blend to enjoying every flavorful puff."
  },
  {
    id: 2,
    image: "https://images.unsplash.com/photo-1606665997683-23f0e1bd8f0a?w=400&h=300&fit=crop",
    title: "Cigar is the best product",
    description: "Discover the art of cigar smoking. From selecting the perfect blend to enjoying every flavorful puff."
  },
  {
    id: 3,
    image: "https://images.unsplash.com/photo-1606665997683-23f0e1bd8f0a?w=400&h=300&fit=crop",
    title: "Cigar is the best product",
    description: "Discover the art of cigar smoking. From selecting the perfect blend to enjoying every flavorful puff."
  }, {
    id: 4,
    image: "https://images.unsplash.com/photo-1606665997683-23f0e1bd8f0a?w=400&h=300&fit=crop",
    title: "Cigar is the best product",
    description: "Discover the art of cigar smoking. From selecting the perfect blend to enjoying every flavorful puff."
  },
  {
    id: 5,
    image: "https://images.unsplash.com/photo-1606665997683-23f0e1bd8f0a?w=400&h=300&fit=crop",
    title: "Cigar is the best product",
    description: "Discover the art of cigar smoking. From selecting the perfect blend to enjoying every flavorful puff."
  },
  {
    id: 6,
    image: "https://images.unsplash.com/photo-1606665997683-23f0e1bd8f0a?w=400&h=300&fit=crop",
    title: "Cigar is the best product",
    description: "Discover the art of cigar smoking. From selecting the perfect blend to enjoying every flavorful puff."
  },
 
];

interface BlogCardProps {
  id: number;
  image: string;
  title: string;
  description: string;
}

const BlogCard: React.FC<BlogCardProps> = ({ id, image, title, description }) => {
  const router = useRouter();

  const handleEdit = () => {
    router.push(`/pages/blogs/edit/${id}`);
  };

  const handleView = () => {
    router.push(`/pages/blogs/view/${id}`);
  };

  return (
    <div className="bg-white rounded-lg overflow-hidden shadow-md w-[444px] ">
      <img 
        src={image} 
        alt={title}
        className="w-full h-48 object-cover"
      />
      <div className="p-4">
        <h3 className="text-lg font-semibold mb-2">{title}</h3>
        <p className="text-gray-600 text-sm mb-4 line-clamp-2">
          {description}
        </p>
        <div className="flex justify-between">
          <button 
            onClick={handleEdit}
            className="flex items-center gap-1 bg-[#F5F5F5] py-1.5 border border-gray-300 rounded-lg font-semibold text-[16px] leading-[24px] tracking-[0] hover:bg-[#c5c4c4] px-16"
          >
            <HugeiconsIcon icon={PencilEdit02Icon} />
            Edit
          </button>
          <button 
            onClick={handleView}
            className="  py-1.5 bg-[#C9A040]  rounded-lg font-semibold text-[16px] leading-[24px] tracking-[0] hover:bg-[#9c7c32] px-20"
          >
            View
          </button>
        </div>
      </div>
    </div>
  );
};

const BlogManagement: React.FC = () => {
  const router = useRouter();

  const handleCreateBlog = () => {
    router.push('/pages/blogs/create');
  };

  return (
    <div className="min-h-screen  ml-8 ">
      <div className="">
        <div className="flex justify-between items-center mb-8 px-6 py-7 rounded-lg bg-white">
          <h1 className="font-bold text-[40px] leading-[48px] tracking-[0]">Blog Management</h1>
          <button 
            onClick={handleCreateBlog}
            className="px-4 py-3 bg-[#C9A040] font-bold text-[16px] leading-[24px] tracking-[0] rounded-lg hover:bg-[#b48f38] flex items-center gap-2"
          >
            <HugeiconsIcon icon={PencilEdit02Icon} />
            Create Blog
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {blogData.map((blog) => (
            <BlogCard
              key={blog.id}
              id={blog.id}
              image={blog.image}
              title={blog.title}
              description={blog.description}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default BlogManagement;