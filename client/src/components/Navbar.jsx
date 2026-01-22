import { useState, useEffect } from "react";
import { NavLink, Link } from "react-router-dom";
import Hamburger from "hamburger-react";
import { useAuth } from "../context/AuthContext";
import { useSocket } from "../context/SocketContext";
import { User, LogIn } from "lucide-react";
import Button from "./Button";

const handleNavClick = () => {
  window.scrollTo({ top: 0, behavior: "smooth" });
};

const Navbar = () => {
  const { currentUser } = useAuth();
  const { unreadCount } = useSocket();
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
    <div
      className={`fixed left-2 right-3 md:left-6 md:right-6 top-4 z-50 transition-all duration-500 ease-in-out ${
        showNavbar ? "translate-y-0 opacity-100" : "-translate-y-full opacity-0"
      }`}
    >
      <div className="flex items-center justify-between lg:justify-center gap-2">
        <nav className="max-w-7xl flex-1 bg-blue-200 rounded-full">
          <div className="mx-auto px-3 sm:px-4 md:px-5 py-2 sm:py-3 md:py-4 flex justify-between items-center">
        {/* Logo */}
        <NavLink
          to="/"
          className="text-2xl max-[450px]:text-[18px] md:text-3xl [@media(min-width:1100px)]:text-4xl font-semibold flex items-center gap-2 max-[360px]:gap-1 sm:gap-3 md:gap-3"
          onClick={() => {
            setOpen(false);
            handleNavClick();
          }}
        >
          <img src="/search.png" alt="Search Icon" className="w-6 max-[360px]:w-5 sm:w-8" />
          <span className="font-[orbitron] text-black">IIUC Lost & Found</span>
        </NavLink>

        {/* Mobile Hamburger */}
        <div className="lg:hidden">
          <Hamburger
            toggled={isOpen}
            toggle={setOpen}
            direction="right"
            size={26}
            color="#000000"
            label="Show menu"
            rounded
          />
        </div>

        {/* Menu Items */}
        <div
          className={`font-medium absolute lg:static top-20 left-0 w-full lg:w-auto lg:bg-transparent lg:p-0 transition-all duration-300 z-50 ${
            isOpen
              ? "flex flex-col w-full items-center bg-blue-200 rounded-4xl shadow-lg top-24 px-0 py-6 gap-6 animate-slideDown"
              : "hidden lg:flex lg:flex-row gap-x-2 xl:gap-x-6 items-center"
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
              <div className="w-10 h-10 rounded-full bg-white border-2 border-black overflow-hidden flex items-center justify-center">
                {currentUser.photoURL ||
                currentUser.providerData?.[0]?.photoURL ? (
                  <img
                    src={
                      currentUser.photoURL ||
                      currentUser.providerData[0].photoURL
                    }
                    alt="Profile"
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                    onError={(e) => (e.target.style.display = "none")}
                  />
                ) : (
                  <User size={20} className="text-blue-600" />
                )}
              </div>
              <span className="lg:hidden font-medium text-black">
                My Profile
              </span>
            </Link>
          ) : (
            <Button
              to="/login"
              size="md"
              icon={LogIn}
              bgColor="bg-green-600"
              textColor="text-black"
              hoverBgColor="bg-yellow-800"
              hoverTextColor="group-hover/btn:text-white"
              className="w-32 h-10 sm:w-auto border-2 border-black shadow-md"
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

        {/* Message Icon - outside navbar for all screens */}
        <NavLink
          to={currentUser ? "/inbox" : "/login"}
          className="flex items-center justify-center cursor-pointer"
          onClick={handleNavClick}
        >
          <span className="relative">
            <img src="/message.png" alt="Messages" className="w-10 max-[360px]:w-8 md:w-12" />
            {currentUser && unreadCount > 0 && (
              <span className="absolute -top-1 -right-2 w-6 h-6 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                {unreadCount > 9 ? "9+" : unreadCount}
              </span>
            )}
          </span>
        </NavLink>
      </div>
    </div>
  );
};

export default Navbar;
