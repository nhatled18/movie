import axios from 'axios';


const API_BASE_URL = 'http://localhost:3001/api'; 


const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 5000, // Thời gian chờ tối đa (tuỳ chọn)
});


export const getMovies = async (filters = {}) => {
  try {
    const response = await api.get('/movies', {
      params: filters, // Truyền các bộ lọc (type, genre, country) dưới dạng query params
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching movies:', error);
    throw error;
  }
};

// Hàm lấy chi tiết phim theo ID
export const getMovieById = async (id) => {
  try {
    const response = await api.get(`/movies/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching movie details:', error);
    throw error;
  }
};

// Hàm tìm kiếm phim theo tiêu đề
export const searchMovies = async (title, type = '') => {
  try {
    const response = await api.get(`/movies/search/${encodeURIComponent(title)}`, {
      params: { type },
    });
    return response.data;
  } catch (error) {
    console.error('Error searching movies:', error);
    throw error;
  }
};

export default api;


