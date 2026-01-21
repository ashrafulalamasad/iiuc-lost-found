import { NavLink } from "react-router-dom";
import { useState } from "react";
import Modal from "./Modal";

const quickLinks = [
  { name: "Home", href: "/" },
  { name: "Find Lost Items", href: "/find" },
  { name: "Report Found Items", href: "/report" },
  { name: "About", href: "/about" },
];

const Footer = () => {
  const [openModal, setOpenModal] = useState(null);
  return (
    <footer className="bg-blue-100 pt-4">
      <div className="mx-auto pb-4 flex flex-col md:flex-row items-center md:items-start md:justify-start gap-6">
        {/* Logo and site name */}
        <div className="md:w-1/3 flex flex-col items-center gap-2">
          <NavLink to="/" className="flex items-center gap-2 mb-2" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
            <img src="/search.png" alt="IIUC Lost & Found Logo" className="w-8 h-8" />
            <span className="text-2xl sm:text-3xl font-extrabold font-[orbitron] text-black">IIUC Lost & Found</span>
          </NavLink>
          <p className="text-black text-md max-w-xs text-center">
            Helping IIUC students finding lost items and reporting found items easily.
          </p>
        </div>
        <div className="w-full md:w-2/3 flex justify-between">
          {/* Quick Links */}
          <div className="w-1/2 flex flex-col items-center gap-2">
            <span className="text-xl font-bold text-blue-700 mb-2">Quick Links</span>
            <ul className="flex flex-col gap-1">
              {quickLinks.map(link => (
                <li key={link.name}>
                  <NavLink to={link.href} className="text-black hover:text-red-600 font-medium text-sm md:text-base" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
                    {link.name}
                  </NavLink>
                </li>
              ))}
            </ul>
          </div>
          {/* Policy Links */}
          <div className="w-1/2 flex flex-col items-center gap-2">
            <span className="text-xl font-bold text-blue-700 mb-2">Other Links</span>
            <ul className="flex flex-col gap-1">
              <li>
                <button 
                  onClick={() => setOpenModal('terms')} 
                  className="text-black hover:text-red-600 font-medium text-sm md:text-base cursor-pointer"
                >
                  Terms of Service
                </button>
              </li>
              <li>
                <button 
                  onClick={() => setOpenModal('privacy')} 
                  className="text-black hover:text-red-600 font-medium text-sm md:text-base cursor-pointer"
                >
                  Privacy Policy
                </button>
              </li>
            </ul>
          </div>
        </div>
      </div>
      <div className="border-t border-gray-400 py-2 text-center text-black text-md">
        &copy; {new Date().getFullYear()} IIUC Lost & Found. All rights reserved. <br />
        Made by <a href="https://ashraful.tech" target="_blank" rel="noopener noreferrer" className="text-blue-700 hover:underline font-semibold">Ashraful Alam</a>
      </div>

      {/* Terms of Service Modal */}
      <Modal 
        isOpen={openModal === 'terms'} 
        onClose={() => setOpenModal(null)}
        title="Terms of Service"
      >
        <div className="prose prose-sm max-w-none">
          <p className="mb-4 text-gray-700 leading-relaxed">
            Welcome to IIUC Lost & Found. By using this platform, you agree to the following:
          </p>
          <ul className="list-disc list-inside space-y-3 text-gray-700">
            <li>
              <strong>Honesty:</strong> You must only post genuine claims. False reporting will result in a ban.
            </li>
            <li>
              <strong>Ownership:</strong> You must provide proof (photos, receipts, or unique descriptions) to claim an item.
            </li>
            <li>
              <strong>Responsibility:</strong> The platform connects students; we are not responsible for the items themselves.
            </li>
            <li>
              <strong>Student Status:</strong> You must be a current student or staff member with a valid Ugrad Mail to use this service.
            </li>
            <li>
              <strong>Reporting Logic:</strong> This platform is exclusively for reporting <em>Found</em> items. If you lose an item, please search the feed instead of creating a new post.
            </li>
            <li>
              <strong>Gender Policy:</strong> Direct face-to-face meetups are strictly restricted to the same gender (Male-Male or Female-Female).
            </li>
            <li>
              <strong>Cross-Gender Claims:</strong> If the Finder and Claimer are of opposite genders, the item must be deposited at the University office or any designated location for handover.
            </li>
            <li>
              <strong>Account Termination:</strong> The administration reserves the right to suspend accounts for abusive behavior or violating university conduct rules.
            </li>
          </ul>
        </div>
      </Modal>

      {/* Privacy Policy Modal */}
      <Modal 
        isOpen={openModal === 'privacy'} 
        onClose={() => setOpenModal(null)}
        title="Privacy Policy"
      >
        <div className="prose prose-sm max-w-none">
          <p className="mb-4 text-gray-700 leading-relaxed">
            Your privacy is important to us.
          </p>
          <ul className="list-disc list-inside space-y-3 text-gray-700">
            <li>
              <strong>Data Collection:</strong> We only collect your Name, Student Email, and Phone Number to facilitate item returns.
            </li>
            <li>
              <strong>Visibility:</strong> Your contact details are only shared with the person you are communicating with regarding an item.
            </li>
            <li>
              <strong>No Sharing:</strong> We do not sell or share your data with any third parties.
            </li>
            <li>
              <strong>Cookies:</strong> We use essential cookies to keep you logged in.
            </li>
            <li>
              <strong>Image Privacy:</strong> When uploading photos of sensitive documents (IDs, Credit Cards), please blur confidential numbers to prevent misuse.
            </li>
            <li>
              <strong>Activity Logs:</strong> We record timestamps and IP addresses of posts to ensure account security and prevent spam.
            </li>
            <li>
              <strong>Data Retention:</strong> Information regarding "Solved" cases is automatically archived or deleted after a specific period to ensure database efficiency.
            </li>
            <li>
              <strong>Google Auth:</strong> Since we use Google Login (Edu Mail), your password is never stored on our servers; authentication is handled securely by Google.
            </li>
          </ul>
        </div>
      </Modal>
    </footer>
  );
};

export default Footer;
