// routes/movies.js
const express = require('express');
const router = express.Router();

// Thay bằng API key của bạn
const OMDB_API_KEY = process.env.OMDB_API_KEY;
const OMDB_BASE_URL = 'http://www.omdbapi.com';

// GET all movies (search)
router.get('/', async (req, res) => {
  try {
    let { type, genre, country, search, page = 1 } = req.query;
    
    // QUAN TRỌNG: OMDB bắt buộc phải có search term
    // Nếu không có search, dùng từ khóa phổ biến
    if (!search || search.trim() === '') {
      search = 'movie'; // hoặc 'action', 'love', 'war', etc.
    }
    
    console.log('Search params:', { search, type, page });
    
    // OMDB search endpoint
    let url = `${OMDB_BASE_URL}/?apikey=${OMDB_API_KEY}&s=${encodeURIComponent(search)}&page=${page}`;
    
    if (type && type.trim() !== '') {
      url += `&type=${type}`; // movie, series, episode
    }
    
    console.log('OMDB URL:', url);
    
    const response = await fetch(url);
    const data = await response.json();
    
    console.log('OMDB Response:', data);
    
    if (data.Response === 'True') {
      // Format lại data cho frontend
      let movies = data.Search.map(movie => ({
        id: movie.imdbID,
        title: movie.Title,
        year: movie.Year,
        poster: movie.Poster !== 'N/A' ? movie.Poster : null,
        type: movie.Type
      }));
      
      // Filter by genre nếu có (OMDB không hỗ trợ filter genre trực tiếp)
      // Lưu ý: Cần gọi API detail để lấy genre, nhưng tốn quota
      // Tạm thời bỏ qua filter genre/country ở đây
      
      // Tính pagination
      const totalResults = parseInt(data.totalResults);
      const totalPages = Math.ceil(totalResults / 10); // OMDB trả 10 phim/page
      
      console.log(`Found ${movies.length} movies, total: ${totalResults}, pages: ${totalPages}`);
      
      res.json({
        movies: movies,
        currentPage: parseInt(page),
        totalPages: totalPages,
        total: totalResults
      });
    } else {
      // OMDB trả về lỗi (thường là "Movie not found!")
      console.log('OMDB Error:', data.Error);
      res.json({
        movies: [],
        currentPage: 1,
        totalPages: 0,
        total: 0
      });
    }
    
  } catch (error) {
    console.error('Error fetching movies:', error);
    res.status(500).json({ 
      message: 'Lỗi khi tải danh sách phim!',
      error: error.message 
    });
  }
});

// GET movie by ID (chi tiết phim)
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const url = `${OMDB_BASE_URL}/?apikey=${OMDB_API_KEY}&i=${id}&plot=full`;
    const response = await fetch(url);
    const data = await response.json();
    
    if (data.Response === 'True') {
      const movie = {
        id: data.imdbID,
        title: data.Title,
        year: data.Year,
        rating: data.imdbRating,
        poster: data.Poster !== 'N/A' ? data.Poster : null,
        genre: data.Genre,
        director: data.Director,
        actors: data.Actors,
        plot: data.Plot,
        runtime: data.Runtime,
        country: data.Country,
        language: data.Language,
        awards: data.Awards,
        type: data.Type
      };
      
      res.json(movie);
    } else {
      res.status(404).json({ message: 'Không tìm thấy phim!' });
    }
    
  } catch (error) {
    console.error('Error fetching movie detail:', error);
    res.status(500).json({ message: 'Lỗi khi tải thông tin phim!' });
  }
});

module.exports = router;