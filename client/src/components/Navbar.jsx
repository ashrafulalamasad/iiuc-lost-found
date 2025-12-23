import { useState, useEffect } from "react";
import { NavLink, Link } from "react-router-dom";
import Hamburger from "hamburger-react";
import { useAuth } from "../context/AuthContext";
import { User, LogIn } from "lucide-react";
import Button from "./Button";

const handleNavClick = () => {
  window.scrollTo({ top: 0, behavior: "smooth" });
};

const Navbar = () => {
  const { currentUser } = useAuth();
  const [isOpen, setOpen] = useState(false);
  const [showNavbar, setShowNavbar] = useState(true);

  useEffect(() => {
    let lastScrollY = window.scrollY;
    const handleScroll = () => {
      if (window.scrollY < 50 || window.scrollY < lastScrollY) {
        setShowNavbar(true);
      } else if (window.scrollY > lastScrollY) {
        setShowNavbar(false);
      }
      lastScrollY = window.scrollY;
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      className={`bg-blue-100 text-red-600 shadow-md fixed left-4 right-4 md:left-6 md:right-6 top-4 rounded-full z-50 transition-all duration-500 ease-in-out ${
        showNavbar ? "translate-y-0 opacity-100" : "-translate-y-full opacity-0"
      }`}
    >
      <div className="mx-auto px-4 sm:px-8 md:px-10 py-4 flex justify-between items-center">
        {/* Logo */}
        <NavLink
          to="/"
          className="text-2xl max-[360px]:text-xl md:text-3xl lg:text-4xl font-bold flex items-center gap-2 md:gap-5"
          onClick={() => {
            setOpen(false);
            handleNavClick();
          }}
        >
          <img src="/search.png" alt="Search Icon" className="w-8 h-8" />
          <span className="bg-linear-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
            IIUC Lost & Found
          </span>
        </NavLink>

        {/* Mobile Hamburger */}
        <div className="lg:hidden">
          <Hamburger
            toggled={isOpen}
            toggle={setOpen}
            direction="right"
            size={28}
            color="#000000"
            label="Show menu"
            rounded
          />
        </div>

        {/* Menu Items */}
        <div
          className={`font-medium absolute lg:static top-20 left-0 w-full lg:w-auto lg:bg-transparent lg:p-0 transition-all duration-300 z-50 ${
            isOpen
              ? "flex flex-col w-full items-center bg-blue-100 rounded-4xl shadow-lg top-24 px-0 py-6 gap-6 animate-slideDown"
              : "hidden lg:flex lg:flex-row gap-x-3 xl:gap-x-6 items-center"
          }`}
        >
          <NavLink
            to="/"
            className={({ isActive }) =>
              `relative px-2 py-2 transition-colors duration-300 ${
                isActive ? "text-black after:w-full" : "text-black"
              } after:absolute after:left-0 after:bottom-0 after:h-0.5 after:bg-black after:transition-all after:duration-300 after:w-0 hover:after:w-full`
            }
            onClick={() => {
              setOpen(false);
              handleNavClick();
            }}
          >
            Home
          </NavLink>
          <NavLink
            to="/find"
            className={({ isActive }) =>
              `relative px-2 py-2 transition-colors duration-300 ${
                isActive ? "text-black after:w-full" : "text-black"
              } after:absolute after:left-0 after:bottom-0 after:h-0.5 after:bg-black after:transition-all after:duration-300 after:w-0 hover:after:w-full`
            }
            onClick={() => {
              setOpen(false);
              handleNavClick();
            }}
          >
            Lost Items
          </NavLink>
          <NavLink
            to="/report"
            className={({ isActive }) =>
              `relative px-2 py-2 transition-colors duration-300 ${
                isActive ? "text-black after:w-full" : "text-black"
              } after:absolute after:left-0 after:bottom-0 after:h-0.5 after:bg-black after:transition-all after:duration-300 after:w-0 hover:after:w-full`
            }
            onClick={() => {
              setOpen(false);
              handleNavClick();
            }}
          >
            Report Found
          </NavLink>
          <NavLink
            to="/about"
            className={({ isActive }) =>
              `relative px-2 py-2 transition-colors duration-300 ${
                isActive ? "text-black after:w-full" : "text-black"
              } after:absolute after:left-0 after:bottom-0 after:h-0.5 after:bg-black after:transition-all after:duration-300 after:w-0 hover:after:w-full`
            }
            onClick={() => {
              setOpen(false);
              handleNavClick();
            }}
          >
            About Us
          </NavLink>

          {/* Auth Button */}
          {currentUser ? (
            <Link
              to="/profile"
              className="flex items-center gap-2 hover:opacity-80 transition-opacity"
              onClick={() => {
                setOpen(false);
                handleNavClick();
              }}
            >
              <div className="w-10 h-10 rounded-full bg-white border-2 border-blue-600 overflow-hidden flex items-center justify-center">
                {(currentUser.photoURL || currentUser.providerData?.[0]?.photoURL) ? (
                  <img 
                    src={currentUser.photoURL || currentUser.providerData[0].photoURL} 
                    alt="Profile" 
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                    onError={(e) => e.target.style.display = 'none'}
                  />
                ) : (
                  <User size={20} className="text-blue-600" />
                )}
              </div>
              <span className="lg:hidden font-medium text-black">My Profile</span>
            </Link>
          ) : (
            <Button
              to="/login"
              variant="primary"
              size="md"
              icon={LogIn}
              className="bg-blue-700 hover:bg-green-600 hover:text-black shadow-none border-none"
              onClick={() => {
                setOpen(false);
                handleNavClick();
              }}
            >
              Sign In
            </Button>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
