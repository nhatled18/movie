import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import '../assets/styles/MovieDetail.css';

function MovieDetail() {
  const { id } = useParams();
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetch(`http://localhost:3001/api/movies/${id}`)
      .then(res => res.json())
      .then(data => {
        setMovie(data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, [id]);

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Đang tải phim...</p>
      </div>
    );
  }

  if (!movie) {
    return (
      <div className="error-container">
        <h2>Không tìm thấy phim</h2>
      </div>
    );
  }

  return (
    <div className="movie-detail-page">
      {/* Background Backdrop */}
      {movie.poster && (
        <div 
          className="backdrop" 
          style={{ backgroundImage: `url(${movie.poster})` }}
        ></div>
      )}

      <div className="movie-detail-container">
        {/* Video Player */}
        <div className="player-section">
          <iframe
            src={`https://vidsrc.xyz/embed/movie/${id}`}
            className="video-player"
            allowFullScreen
            title={movie.title}
          ></iframe>
        </div>

        {/* Movie Info */}
        <div className="movie-info-section">
          <div className="movie-header">
            <h1 className="movie-title">{movie.title}</h1>
            <div className="movie-meta">
              {movie.year && <span className="meta-item">📅 {movie.year}</span>}
              {movie.runtime && <span className="meta-item">⏱️ {movie.runtime}</span>}
              {movie.rating && <span className="meta-item rating">⭐ {movie.rating}/10</span>}
            </div>
          </div>

          <div className="movie-details">
            {movie.genre && (
              <div className="detail-row">
                <strong>Thể loại:</strong>
                <span>{movie.genre}</span>
              </div>
            )}

            {movie.director && (
              <div className="detail-row">
                <strong>Đạo diễn:</strong>
                <span>{movie.director}</span>
              </div>
            )}

            {movie.actors && (
              <div className="detail-row">
                <strong>Diễn viên:</strong>
                <span>{movie.actors}</span>
              </div>
            )}

            {movie.country && (
              <div className="detail-row">
                <strong>Quốc gia:</strong>
                <span>{movie.country}</span>
              </div>
            )}

            {movie.language && (
              <div className="detail-row">
                <strong>Ngôn ngữ:</strong>
                <span>{movie.language}</span>
              </div>
            )}

            {movie.awards && movie.awards !== 'N/A' && (
              <div className="detail-row">
                <strong>Giải thưởng:</strong>
                <span>{movie.awards}</span>
              </div>
            )}
          </div>

          {movie.description && (
           <div className="movie-description">
              <h3>Nội dung phim</h3>
              <p>{movie.description}</p>
            </div>
          )} 
        </div>
      </div>
    </div>
  );
}

export default MovieDetail;