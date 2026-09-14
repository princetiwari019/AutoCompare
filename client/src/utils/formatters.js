/**
 * Utility function to format numeric INR values into human-readable text
 * e.g., 800000 -> ₹8.00 Lakh
 * e.g., 1208000 -> ₹12.08 Lakh
 * e.g., 6090000 -> ₹60.90 Lakh
 * e.g., 124000 -> ₹1.24 Lakh
 */
export const formatINR = (price) => {
  if (price === undefined || price === null || isNaN(price)) return '₹0';

  const numPrice = Number(price);

  if (numPrice >= 10000000) {
    return `₹${(numPrice / 10000000).toFixed(2)} Cr`;
  }
  if (numPrice >= 100000) {
    return `₹${(numPrice / 100000).toFixed(2)} Lakh`;
  }
  return `₹${numPrice.toLocaleString('en-IN')}`;
};

/**
 * Utility function to resolve vehicle image URLs dynamically.
 * Prepends backend URL (http://localhost:5000) for local /uploads/ paths while preserving external URLs.
 */
const BACKEND_URL = import.meta.env.VITE_API_BASE_URL
  ? import.meta.env.VITE_API_BASE_URL.replace(/\/$/, '')
  : 'http://localhost:5000';

export const getImageUrl = (url) => {
  if (!url || typeof url !== 'string') return '';

  if (url.startsWith('http://') || url.startsWith('https://') || url.startsWith('data:')) {
    return url;
  }

  if (url.startsWith('/uploads')) {
    return `${BACKEND_URL}${url}`;
  }

  if (url.startsWith('uploads/')) {
    return `${BACKEND_URL}/${url}`;
  }

  return url;
};
