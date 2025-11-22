// Set base URL based on environment
const isProduction = process.env.NODE_ENV === 'production';
let baseRoute = isProduction 
    ? 'https://de-v-brosss-2tsm.vercel.app'  // Removed /api here
    : 'http://localhost:8081';

// For Vercel preview deployments
if (typeof window !== 'undefined' && window.location.hostname !== 'localhost') {
    baseRoute = 'https://de-v-brosss-2tsm.vercel.app';  // Removed /api here
}

// Export the configuration
export const baseStuff = {
    baseRoute: baseRoute + '/api'  // Add /api here for API requests
};

// Log the base URL for debugging
console.log('Base URL:', baseRoute);


