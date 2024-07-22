import { Link, useNavigate } from "react-router-dom";
import { getUserData } from "../services/api";
import { useState, useEffect } from "react";

export default function Navbar() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if token exist inside localStorage
    const checkLoginStatus = async () => {

      const token = localStorage.getItem('token');

      if (token) {
        try {
          await getUserData();
          setIsLoggedIn(true); 
        } catch (err) {
          console.error('token not valid', err);
          localStorage.removeItem('token');
          setIsLoggedIn(false); 
        }
      } else {
        setIsLoggedIn(false);
      }
    };

    // call login status func
    checkLoginStatus();

    // Listener to check login status
    window.addEventListener("storage", checkLoginStatus);
    window.addEventListener("loginStateChange", checkLoginStatus);

    // remove event listeners
    return () => {
      window.removeEventListener("storage", checkLoginStatus);
      window.removeEventListener("loginStateChange", checkLoginStatus);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsLoggedIn(false);
    navigate("/");
  };

  return (
    <nav className="w-full px-4 py-6 border-b-2">
      <div className="w-full lg:w-2/3 flex justify-between items-center m-auto">
        <Link to="/">
          <img src='https://res.cloudinary.com/dicfymkdl/image/upload/v1721633225/mern-blog-logo_xbf5fp.png' alt='logo' className="w-[200px]" />
        </Link>

        <ul className="flex gap-4">
          <li className="nav-item">
            <Link to="/" className="nav-link">
              Home
            </Link>
          </li>
          {isLoggedIn ? (
            <>
              <li className="nav-item">
                <Link to="/create" className="nav-link">
                  Nuovo Post
                </Link>
              </li>
              <li className="nav-item">
                <button onClick={handleLogout} className="nav-link">
                  Logout
                </button>
              </li>
            </>
          ) : (
            <>
              <li className="nav-item">
                <Link to="/login" className="nav-link">
                  Login
                </Link>
              </li>
              <li className="nav-item">
                <Link to="/register" className="nav-link">
                  Registrati
                </Link>
              </li>
            </>
          )}
        </ul>
      </div>
    </nav>
  );
}