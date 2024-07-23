import { Link, useNavigate } from "react-router-dom";
import { getUserData } from "../services/api";
import { useState, useEffect } from "react";

export default function Navbar() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const checkLoginStatus = async () => {
      const token = localStorage.getItem('token');

      if (token) {
        try {
          const userData = await getUserData();
          setUser(userData); // if token is valid, set user data
          setIsLoggedIn(true);
        } catch (err) {
          console.error('Token not valid', err);
          localStorage.removeItem('token');
          setIsLoggedIn(false);
          setUser(null);
        }
      } else {
        setIsLoggedIn(false);
        setUser(null);
      }
    };

    checkLoginStatus();

    const handleStorageChange = () => {
      checkLoginStatus();
    };

    window.addEventListener("storage", handleStorageChange);
    window.addEventListener("loginStateChange", handleStorageChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener("loginStateChange", handleStorageChange);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsLoggedIn(false);
    setUser(null);
    navigate("/");
  };

  // avatar fallback img
  const fallbackAvatar = "https://res.cloudinary.com/dicfymkdl/image/upload/v1721642624/avatar_rsyffw.png";

  return (
    <nav className="w-full px-4 py-6 border-b-2">
      <div className="w-full lg:w-1/2 flex justify-between items-center m-auto">
        <Link to="/">
          <img 
            src='https://res.cloudinary.com/dicfymkdl/image/upload/v1721633225/mern-blog-logo_xbf5fp.png' 
            alt='logo' 
            className="w-[200px]" 
          />
        </Link>
        <ul className="flex items-center gap-12">
          {isLoggedIn ? (
            <>
              <li>
                <Link to="/create">
                  <button type="submit" className="px-4 py-2 text-white bg-[#646ECB] rounded-md">New post</button>
                </Link>
              </li>
              <li>
                {user ? (
                  <div className="flex items-center gap-4">
                    <img src={user.avatar ? user.avatar : fallbackAvatar} alt='user image' className="w-[50px] h-[50px] rounded-full" />
                    <div className="flex flex-col text-left">
                      <span>{user.name} {user.surname}</span>
                      <a className="text-[12px] underline cursor-pointer" onClick={handleLogout}>Logout</a>
                    </div>
                  </div>
                ) : null}
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
