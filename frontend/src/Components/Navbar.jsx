import { Link } from 'react-router-dom';
import '../assets/styles/Navbar.css';

function Navbar() {
  return (
    <nav className="navbar">
      <div className="navbar-left">
        <h1>MyMovie</h1>
        <ul>
          <li><Link to="/">Home</Link></li>
          <li><Link to="/movies">Phim</Link></li>
        </ul>
      </div>
      <div className="navbar-right">
        <Link to="/login">Login</Link>
      </div>
    </nav>
  );
}

export default Navbar;
