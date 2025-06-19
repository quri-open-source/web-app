export const environment = {
  production: false,
  apiBaseUrl: 'https://opensourceback-production.up.railway.app/api/v1',
  projectsApiBaseUrl: 'http://localhost:3000/projects',
  cloudinaryApiBaseUrl: 'https://api.cloudinary.com/v1_1/dkkfv72vo/image',
  devUser: '8b3c1e7e-0d6a-4f6f-915a-77cfb0f9c8c1', // Changed to match production environment
  devRole: 'customer', // Default role
  defaultPreviewImageUrl: 'https://picsum.photos/150/150',
  defaultProjectStatus: 'blueprint',
  defaultGarmentSize: 'M',
  defaultGarmentColor: '#FFFFFF',
  garmentColorImagesUrl: 'https://res.cloudinary.com/dkkfv72vo/image/upload/v1747000549/Frame_530_hfhrko.webp',
  currencyCode: 'PEN', // Added to match production environment
};
