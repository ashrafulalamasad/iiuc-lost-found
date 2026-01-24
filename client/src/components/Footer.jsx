import { NavLink } from "react-router-dom";

const quickLinks = [
  { name: "Home", href: "/" },
  { name: "Find Lost Items", href: "/find" },
  { name: "Report Found Items", href: "/report" },
  { name: "About", href: "/about" },
];

const otherLinks = [
  { name: "Terms of Service", href: "/terms" },
  { name: "Privacy Policy", href: "/privacy" },
  { name: "User Guides", href: "/guides" },
];

const Footer = () => {
  return (
    <footer className="bg-slate-200 border-t border-slate-300 pt-4">
      <div className="mx-auto pb-4 flex flex-col md:flex-row items-center md:items-start md:justify-start gap-6">
        {/* Logo and site name */}
        <div className="md:w-1/3 flex flex-col items-center gap-2">
          <NavLink
            to="/"
            className="flex items-center gap-2 mb-2"
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          >
            <img
              src="/search.png"
              alt="IIUC Lost & Found Logo"
              className="w-8 h-8"
            />
            <span className="text-2xl sm:text-3xl font-extrabold font-[orbitron] text-black">
              IIUC Lost & Found
            </span>
          </NavLink>
          <p className="text-black text-md max-w-xs text-center">
            Helping IIUC students finding lost items and reporting found items
            easily.
          </p>
        </div>
        <div className="w-full md:w-2/3 flex justify-between">
          {/* Quick Links */}
          <div className="w-1/2 flex flex-col items-center gap-2">
            <span className="text-xl font-bold text-green-700 mb-2 border-b-2 border-green-700 pb-1">
              Quick Links
            </span>
            <ul className="flex flex-col gap-1">
              {quickLinks.map((link) => (
                <li key={link.name}>
                  <NavLink
                    to={link.href}
                    className="text-black hover:text-green-700 font-medium text-sm md:text-base"
                    onClick={() =>
                      window.scrollTo({ top: 0, behavior: "smooth" })
                    }
                  >
                    {link.name}
                  </NavLink>
                </li>
              ))}
            </ul>
          </div>
          {/* Policy Links */}
          <div className="w-1/2 flex flex-col items-center gap-2">
            <span className="text-xl font-bold text-green-700 mb-2 border-b-2 border-green-700 pb-1">
              Other Links
            </span>
            <ul className="flex flex-col gap-1">
              {otherLinks.map((link) => (
                <li key={link.name}>
                  <NavLink
                    to={link.href}
                    className="text-black hover:text-green-700 font-medium text-sm md:text-base"
                    onClick={() =>
                      window.scrollTo({ top: 0, behavior: "smooth" })
                    }
                  >
                    {link.name}
                  </NavLink>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
      <div className="border-t border-slate-400 py-2 text-center text-black text-md">
        &copy; {new Date().getFullYear()} IIUC Lost & Found. All rights
        reserved. <br />
        Made by{" "}
        <a
          href="https://ashraful.tech"
          target="_blank"
          rel="noopener noreferrer"
          className="text-green-700 hover:underline font-semibold"
        >
          Ashraful Alam
        </a>
      </div>
    </footer>
  );
};

export default Footer;
