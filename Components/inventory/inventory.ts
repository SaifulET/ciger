export interface ProductImage {
  name: string;
  data: string;
}

export interface Product {
  _id?: string;
  name: string;
  images: string[];
  price: number;
  discount: number;
  quantity: string;
  averageRating: number;
  available: number;
  isBest: boolean;
  isNew: boolean;
  isInStock: boolean;
  colors: string[];
  category?: string;
  subCategory?: string;
  brand?: string;
  description?: string;
  updatedAt?: string;
  __v?: number;
}

export interface Brand {
  _id: string;
  name: string;
  image?: string;
  feature?: boolean;
  createdAt: string;
  updatedAt: string;
  __v?: number;
}

export interface ProductFormData {
  category: string;
  subCategory: string;
  brand: string;
  productName: string;
  productQuantity: string;
  productStock: string;
  productPrice: string;
  productSalePrice: string;
  productState: string[] | null;
  productDescription: string;
  selectedImages: ProductImage[];
  existingImages: string[];
}

export interface ApiResponse {
  success: boolean;
  data?: Product | Product[] | Brand[];
  count?: number;
  message?: string;
}

export const categoriesData = [
  { "label": "Tobacco Products", "subItems": ["Cigar", "Premium Cigar", "Pipe Tobacco"] },
  { "label": "Hookah", "subItems": ["Hookah Pipes", "Hookah Tobacco"] },
  { "label": "Nicotine Vapes", "subItems": ["Disposables"] },
  { "label": "Smokeless Tobacco", "subItems": ["Chewing Tobacco", "Snuff", "Nicotine Pouches", "Snus"] },
  { "label": "General Accessories", "subItems": ["Lighters & Torch Lighters", "Ashtrays", "Rolling Machines", "Storage & Cases", "Cleaning Tools"] },
  { "label": "THC", "subItems": ["Flowers", "PreRolls", "Disposables/Cartridges", "Edibles", "Concentrates"] },
  { "label": "Roll Your Own", "subItems": ["Tubes", "Wraps", "Rolling Papers", "Pre-Rolled Cones"] }
];

export const categories = categoriesData.map(cat => cat.label);
export const subCategories: Record<string, string[]> = {};

categoriesData.forEach(category => {
  subCategories[category.label] = category.subItems;
});