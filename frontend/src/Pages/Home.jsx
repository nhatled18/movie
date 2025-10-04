import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import '../assets/styles/Home.css';

function Home() {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('http://localhost:3001/api/movies')
      .then(res => res.json())
      .then(data => {
      setMovies(data.movies.slice(0, 12));
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  return (
    <div className="home-page">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <h1 className="hero-title">Chào mừng đến MyMovie</h1>
          <p className="hero-subtitle">Xem phim chất lượng cao, cập nhật liên tục</p>
          <div className="hero-buttons">
            <Link to="/movies" className="btn-primary">
              Khám phá ngay
            </Link>
          </div>
        </div>
        <div className="hero-overlay"></div>
      </section>

      {/* Info Cards */}
      <section className="info-section">
        <div className="container">
          <div className="info-cards">
            <div className="info-card">
              <div className="info-icon">🎬</div>
              <h3>Kho phim khổng lồ</h3>
              <p>Hàng ngàn bộ phim chất lượng cao</p>
            </div>
            <div className="info-card">
              <div className="info-icon">⚡</div>
              <h3>Cập nhật nhanh</h3>
              <p>Phim mới được cập nhật hàng ngày</p>
            </div>
            <div className="info-card">
              <div className="info-icon">📱</div>
              <h3>Xem mọi nơi</h3>
              <p>Tương thích mọi thiết bị</p>
            </div>
          </div>
        </div>
      </section>

      {/* Movies Section */}
      <section className="movies-section">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">Phim mới cập nhật</h2>
            <Link to="/movies" className="view-all">
              Xem tất cả →
            </Link>
          </div>

          {loading && (
            <div className="loading">
              <div className="spinner"></div>
              <p>Đang tải phim...</p>
            </div>
          )}

          {!loading && movies.length > 0 && (
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
                      <button className="play-btn">▶</button>
                    </div>
                  </div>
                  <div className="movie-info">
                    <h3 className="movie-title">{movie.title}</h3>
                    <div className="movie-meta">
                      {movie.year && <span className="year">{movie.year}</span>}
                      {movie.rating && (
                        <span className="rating">⭐ {movie.rating}</span>
                      )}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}

          {!loading && movies.length === 0 && (
            <div className="empty-state">
              <span className="empty-icon">🎬</span>
              <p>Chưa có phim nào</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

export default Home;