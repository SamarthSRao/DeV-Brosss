// Set base URL based on environment
const isProduction = process.env.NODE_ENV === 'production';
const baseRoute = isProduction 
    ? 'https://de-v-brosss-a4cj.vercel.app/'  // Replace with your actual backend Vercel URL
    : 'http://localhost:8081/api';

// For development with Vercel previews
if (typeof window !== 'undefined' && window.location.hostname !== 'localhost') {
    baseRoute = 'https://de-v-brosss-a4cj.vercel.app/';
}

export const baseStuff = {
    baseRoute
};

