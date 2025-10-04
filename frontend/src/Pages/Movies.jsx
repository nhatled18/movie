import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import '../assets/styles/Movies.css';
import Pagination from "../Components/Pagination";

function Movies() {
  const [movies, setMovies] = useState([]);
  const [filter, setFilter] = useState({ type: '', genre: '', country: '', search: '' });
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    setLoading(true);
    let query = `page=${currentPage}&search=${filter.search}&`;
    if (filter.type) query += `type=${filter.type}&`;
    if (filter.genre) query += `genre=${filter.genre}&`;
    if (filter.country) query += `country=${filter.country}&`;
    
    fetch(`http://localhost:3001/api/movies?${query}`)
      .then(res => res.json())
      .then(data => {
        console.log("API response:", data);
         setMovies(Array.isArray(data.movies) ? data.movies : []);
        setTotalPages(data.totalPages || 1);
         setCurrentPage(data.currentPage || 1);
        setLoading(false);
      })
      .catch(err => {
        console.error("Fetch error:", err);
        console.error(err);
        setLoading(false);
      });
  }, [filter, currentPage]);

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="movies-page">
      <div className="movies-container">
        <h1 className="page-title">Danh sách phim</h1>

        {/* Filter Section */}
        <div className="filter-section">
          <input
            className="filter-input"
            type="text"
            placeholder="Tìm kiếm phim..."
            value={filter.search}
            onChange={e => {
              setFilter({ ...filter, search: e.target.value });
              setCurrentPage(1);
            }}
          />

          <select 
            className="filter-select"
            onChange={e => {
              setFilter({ ...filter, type: e.target.value });
              setCurrentPage(1);
            }}
            value={filter.type}
          >
            <option value="">Tất cả loại</option>
            <option value="movie">Phim lẻ</option>
            <option value="series">Phim bộ</option>
          </select>

          {/* <input
            className="filter-input"
            type="text"
            placeholder="Thể loại (vd: Action, Drama)"
            value={filter.genre}
            onChange={e => {
              setFilter({ ...filter, genre: e.target.value });
              setCurrentPage(1);
            }}
          />
   
          <input
            className="filter-input"
            type="text"
            placeholder="Quốc gia (vd: USA, Korea)"
            value={filter.country}
            onChange={e => {
              setFilter({ ...filter, country: e.target.value });
              setCurrentPage(1);
            }}
          /> */}

          <button 
            className="filter-reset"
            onClick={() => {
              setFilter({ type: '', genre: '', country: '', search: 'movie' });
              setCurrentPage(1);
            }}
          >
            Xóa bộ lọc
          </button>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="loading">
            <div className="spinner"></div>
            <p>Đang tải phim...</p>
          </div>
        )}

        {/* Movie Grid */}
        {!loading && movies.length > 0 && (
          <>
            <div className="movies-grid">
              {movies.map(movie => (
                <Link to={`/movies/${movie.id}`} key={movie.id} className="movie-card">
                  <div className="movie-poster">
                    {movie.poster ? (
                      <img src={movie.poster} alt={movie.title} />
                    ) : (
                      <div className="no-poster">
                        <span>🎬</span>
                      </div>
                    )}
                    <div className="movie-overlay">
                      <button className="play-btn">▶ Xem ngay</button>
                    </div>
                  </div>
                  <div className="movie-info">
                    <h3 className="movie-title">{movie.title}</h3>
                    <div className="movie-meta">
                      {movie.year && <span className="year">{movie.year}</span>}
                      {movie.type && (
                        <span className="rating">
                          {movie.type === 'movie' ? '🎬' : '📺'}
                        </span>
                      )}
                    </div>
                    {movie.genre && (
                      <p className="movie-genre">{movie.genre}</p>
                    )}
                  </div>
                </Link>
              ))}
            </div>

            {/* Pagination */}
            <Pagination 
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          </>
        )}

        {/* Empty State */}
        {!loading && movies.length === 0 && (
          <div className="empty-state">
            <span className="empty-icon">🎬</span>
            <h2>Không tìm thấy phim nào</h2>
            <p>Thử thay đổi bộ lọc hoặc tìm kiếm khác</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default Movies;