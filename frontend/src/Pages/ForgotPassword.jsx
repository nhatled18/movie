import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../assets/styles/ForgotPassword.css';

function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');
    setLoading(true);

    try {
      const res = await fetch('http://localhost:3001/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });

      const data = await res.json();

      if (res.ok) {
        setMessage('Hướng dẫn khôi phục mật khẩu đã được gửi đến email của bạn!');
      } else {
        setError(data.message || 'Không thể gửi yêu cầu khôi phục mật khẩu!');
      }
    } catch (err) {
      setError('Lỗi kết nối server!');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="forgot-password-page">
      <div className="forgot-password-container">
        <div className="forgot-password-box">
          <h1 className="forgot-password-title">Quên mật khẩu</h1>
          <p className="forgot-password-subtitle">Nhập email để khôi phục mật khẩu</p>

          {message && (
            <div className="success-message">
              {message}
            </div>
          )}
          {error && (
            <div className="error-message">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="forgot-password-form">
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                id="email"
                type="email"
                placeholder="Nhập email của bạn"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={loading}
              />
            </div>

            <button type="submit" className="forgot-password-btn" disabled={loading}>
              {loading ? 'Đang gửi...' : 'Gửi yêu cầu'}
            </button>
          </form>

          <div className="forgot-password-footer">
            <p onClick={() => navigate('/login')} style={{ cursor: 'pointer' }}>
              Quay lại đăng nhập
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ForgotPassword;