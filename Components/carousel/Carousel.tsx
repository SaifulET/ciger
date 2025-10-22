"use client";
import { Delete02Icon, PlusSignIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import React, { useState, useRef, useEffect } from "react";

interface ImageData {
  id: string;
  url: string;
  file: File;
}

export default function CarouselImageUpload() {
  const [images, setImages] = useState<ImageData[]>([]);
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    console.log(
      "Current images:",
      images.map((img) => ({
        id: img.id,
        name: img.file.name,
        size: img.file.size,
        type: img.file.type,
      }))
    );
  }, [images]);

  const handleAddClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const newImages: ImageData[] = Array.from(files).map((file) => ({
      id: `${Date.now()}-${Math.random()}`,
      url: URL.createObjectURL(file),
      file: file,
    }));

    setImages((prev) => [...prev, ...newImages]);

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleDelete = (id: string) => {
    setImages((prev) => {
      const imageToDelete = prev.find((img) => img.id === id);
      if (imageToDelete) {
        URL.revokeObjectURL(imageToDelete.url);
      }
      return prev.filter((img) => img.id !== id);
    });
  };

  return (
    <div className="min-h-screen ml-8">
      <div className="">
        <div className="flex justify-between items-center mb-8 px-10 py-4 bg-white rounded-lg">
          <h1 className="text-3xl font-bold text-gray-900">Carousel</h1>
          <button
            onClick={handleAddClick}
            className="flex items-center gap-2 bg-[#C9A040] hover:bg-[#8a6c28] text-gray-900 font-medium px-8 py-4 rounded-lg transition-colors"
          >
            <HugeiconsIcon icon={PlusSignIcon} />
            Add
          </button>
        </div>

        <div className="px-10 py-4 bg-white rounded-lg">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            multiple
            onChange={handleFileChange}
            className="hidden"
          />

          {images.length === 0 ? (
            <div>
              <p className="text-semibold text-gray-600 mb-3">Choose Image</p>
              <button
                onClick={handleAddClick}
                className="bg-[#C9A040] hover:bg-[#886c2a] text-gray-900 font-medium px-8 py-3 rounded-lg transition-colors"
              >
                Select Image
              </button>

              <div className="grid grid-cols-3 gap-4 mt-6">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="aspect-video bg-gray-100 rounded-lg" />
                ))}
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-3 gap-4">
              {images.map((image) => (
                <div
                  key={image.id}
                  className="relative aspect-video bg-gray-100 rounded-lg overflow-hidden group"
                  onMouseEnter={() => setHoveredId(image.id)}
                  onMouseLeave={() => setHoveredId(null)}
                >
                  <img
                    src={image.url}
                    alt="Uploaded"
                    className={`w-full h-full object-cover transition-opacity duration-300 ${
                      hoveredId === image.id ? "opacity-70" : "opacity-100"
                    }`}
                  />
                  {hoveredId === image.id && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <button
                        onClick={() => handleDelete(image.id)}
                        className="bg-red-600  text-white  font-medium px-4 py-2 rounded-lg transition-colors flex items-center gap-2"
                      >
                        <HugeiconsIcon
                          icon={Delete02Icon}
                          size={24}
                          color="white "
                          strokeWidth={1.5}
                        />
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
