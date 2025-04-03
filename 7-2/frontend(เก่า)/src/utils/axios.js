import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3000', // URL ของ Backend
});

// // // Add request interceptor
// // instance.interceptors.request.use(
// //   (config) => {
// //     // You can add auth token here if needed
// //     return config;
// //   },
// //   (error) => {
// //     return Promise.reject(error);
// //   }
// // );

// // // Add response interceptor
// // instance.interceptors.response.use(
// //   (response) => {
// //     return response;
// //   },
// //   (error) => {
// //     // Handle errors here
// //     console.error('API Error:', error);
// //     return Promise.reject(error);
// //   }
// );

export default api;