"use client";
import api from "@/lib/axios";
import { Delete02Icon, PlusSignIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import React, { useState, useRef, useEffect } from "react";

interface ImageData {
  id: string;
  url: string;
  file?: File;
}

interface ApiImage {
  _id: string;
  imageUrl: string;
  __v: number;
  createdAt: string;
  updatedAt: string;
}

interface ApiResponse {
  success: boolean;
  data: ApiImage[];
}

interface DeleteResponse {
  success: boolean;
  message?: string;
}

export default function CarouselImageUpload() {
  const [images, setImages] = useState<ImageData[]>([]);
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Fetch all carousel images
  const fetchImages = async () => {
    setLoading(true);
    try {
      const response = await api.get("/carousel/getAllImages");
      console.log(response)
      const result: ApiResponse = response.data;
      
      if (result && result.data) {
        const formattedImages: ImageData[] = result.data.map((img) => ({
          id: img._id,
          url: img.imageUrl,
        }));
        setImages(formattedImages);
      }
    } catch (error) {
      console.error("Error fetching images:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchImages();
  }, []);

  const handleAddClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    setUploading(true);
    try {
      for (const file of Array.from(files)) {
        await uploadImage(file);
      }
      // Refresh the images list after upload
      await fetchImages();
    } catch (error) {
      console.error("Error uploading images:", error);
    } finally {
      setUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const uploadImage = async (file: File) => {
    const formData = new FormData();
    formData.append("images", file);

    try {
      console.log("Uploading file:", file.name, file.size, file.type);
      
      const response = await api.post("/carousel/createImage", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      const result = response.data;
      console.log("Upload response:", result);

      if (!result.success) {
        throw new Error(result.message || "Failed to upload image");
      }

      return result;
    } catch (error) {
      console.error("Upload error:", error);
      throw error;
    }
  };

  const handleDelete = async (id: string) => {
    setDeletingId(id);
    try {
      const response = await api.delete(`/carousel/deleteImage/${id}`);
      const result: DeleteResponse = response.data;
      
      if (result.success) {
        // Remove the image from local state
        setImages((prev) => prev.filter((img) => img.id !== id));
        console.log("Image deleted successfully");
      } else {
        throw new Error(result.message || "Failed to delete image");
      }
    } catch (error) {
      console.error("Error deleting image:", error);
      // You might want to show an error message to the user here
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="min-h-screen ml-8">
      <div className="">
        <div className="flex justify-between items-center mb-8 px-10 py-4 bg-white rounded-lg">
          <h1 className="text-3xl font-bold text-gray-900">Carousel</h1>
          <button
            onClick={handleAddClick}
            disabled={uploading}
            className="flex items-center gap-2 bg-[#C9A040] hover:bg-[#8a6c28] text-gray-900 font-medium px-8 py-4 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {uploading ? (
              "Uploading..."
            ) : (
              <>
                <HugeiconsIcon icon={PlusSignIcon} />
                Add
              </>
            )}
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
            disabled={uploading}
          />

          {loading ? (
            <div className="flex justify-center items-center py-8">
              <p className="text-gray-600">Loading images...</p>
            </div>
          ) : images.length === 0 ? (
            <div>
              <p className="text-semibold text-gray-600 mb-3">Choose Image</p>
              <button
                onClick={handleAddClick}
                disabled={uploading}
                className="bg-[#C9A040] hover:bg-[#886c2a] text-gray-900 font-medium px-8 py-3 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {uploading ? "Uploading..." : "Select Image"}
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
                    alt="Carousel"
                    className={`w-full h-full object-cover transition-opacity duration-300 ${
                      hoveredId === image.id ? "opacity-70" : "opacity-100"
                    }`}
                  />
                  {hoveredId === image.id && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <button
                        onClick={() => handleDelete(image.id)}
                        disabled={deletingId === image.id}
                        className="bg-red-600 text-white font-medium px-4 py-2 rounded-lg transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {deletingId === image.id ? (
                          "Deleting..."
                        ) : (
                          <>
                            <HugeiconsIcon
                              icon={Delete02Icon}
                              size={24}
                              color="white"
                              strokeWidth={1.5}
                            />
                          </>
                        )}
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