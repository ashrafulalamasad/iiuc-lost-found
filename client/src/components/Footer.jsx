import { NavLink } from "react-router-dom";
import { useState } from "react";
import Modal from "./Modal";
import YoutubePlayer from "./YoutubePlayer";

const quickLinks = [
  { name: "Home", href: "/" },
  { name: "Find Lost Items", href: "/find" },
  { name: "Report Found Items", href: "/report" },
  { name: "About", href: "/about" },
];

const Footer = () => {
  const [openModal, setOpenModal] = useState(null);
  return (
    <footer className="bg-slate-200 border-t border-slate-300 pt-4">
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
                <span className="text-xl font-bold text-green-700 mb-2 border-b-2 border-green-700 pb-1">Quick Links</span>
                <ul className="flex flex-col gap-1">
                  {quickLinks.map(link => (
                    <li key={link.name}>
                      <NavLink to={link.href} className="text-black hover:text-green-700 font-medium text-sm md:text-base" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
                        {link.name}
                      </NavLink>
                    </li>
                  ))}
                </ul>
              </div>
          {/* Policy Links */}
          <div className="w-1/2 flex flex-col items-center gap-2">
            <span className="text-xl font-bold text-green-700 mb-2 border-b-2 border-green-700 pb-1">Other Links</span>
            <ul className="flex flex-col gap-1">
              <li>
                <button 
                  onClick={() => setOpenModal('terms')} 
                  className="text-black hover:text-green-700 font-medium text-sm md:text-base cursor-pointer"
                >
                  Terms of Service
                </button>
              </li>
              <li>
                <button 
                  onClick={() => setOpenModal('privacy')} 
                  className="text-black hover:text-green-700 font-medium text-sm md:text-base cursor-pointer"
                >
                  Privacy Policy
                </button>
              </li>
              <li>
                <button 
                  onClick={() => setOpenModal('userguides')} 
                  className="text-black hover:text-green-700 font-medium text-sm md:text-base cursor-pointer"
                >
                  User Guides
                </button>
              </li>
            </ul>
          </div>
        </div>
      </div>
      <div className="border-t border-slate-400 py-2 text-center text-black text-md">
        &copy; {new Date().getFullYear()} IIUC Lost & Found. All rights reserved. <br />
        Made by <a href="https://ashraful.tech" target="_blank" rel="noopener noreferrer" className="text-green-700 hover:underline font-semibold">Ashraful Alam</a>
      </div>

      {/* Terms of Service Modal */}
      <Modal 
        isOpen={openModal === 'terms'} 
        onClose={() => setOpenModal(null)}
        title="Terms of Service"
      >
        <div className="prose prose-sm max-w-none">
          <p className="mb-6 text-black text-base leading-relaxed font-medium">
            Welcome to IIUC Lost & Found. By using this platform, you agree to the following:
          </p>
          <ul className="space-y-4">
            <li className="bg-gray-50 p-4 rounded-lg border-l-4 border-green-600">
              <strong className="text-black text-base">Honesty:</strong> 
              <span className="text-gray-800 ml-2">You must only post genuine claims. False reporting will result in a ban.</span>
            </li>
            <li className="bg-gray-50 p-4 rounded-lg border-l-4 border-green-600">
              <strong className="text-black text-base">Ownership:</strong> 
              <span className="text-gray-800 ml-2">You must provide proof (photos, receipts, or unique descriptions) to claim an item.</span>
            </li>
            <li className="bg-gray-50 p-4 rounded-lg border-l-4 border-green-600">
              <strong className="text-black text-base">Responsibility:</strong> 
              <span className="text-gray-800 ml-2">The platform connects students; we are not responsible for the items themselves.</span>
            </li>
            <li className="bg-gray-50 p-4 rounded-lg border-l-4 border-green-600">
              <strong className="text-black text-base">Student Status:</strong> 
              <span className="text-gray-800 ml-2">You must be a current student or staff member with a valid Ugrad Mail to use this service.</span>
            </li>
            <li className="bg-gray-50 p-4 rounded-lg border-l-4 border-green-600">
              <strong className="text-black text-base">Reporting Logic:</strong> 
              <span className="text-gray-800 ml-2">This platform is exclusively for reporting <strong>Found</strong> items. If you lose an item, please search the feed instead of creating a new post.</span>
            </li>
            <li className="bg-gray-50 p-4 rounded-lg border-l-4 border-green-600">
              <strong className="text-black text-base">Gender Policy:</strong> 
              <span className="text-gray-800 ml-2">Direct face-to-face meetups are strictly restricted to the same gender (Male-Male or Female-Female).</span>
            </li>
            <li className="bg-gray-50 p-4 rounded-lg border-l-4 border-green-600">
              <strong className="text-black text-base">Cross-Gender Claims:</strong> 
              <span className="text-gray-800 ml-2">If the Finder and Claimer are of opposite genders, the item must be deposited at the University office or any designated location for handover.</span>
            </li>
            <li className="bg-gray-50 p-4 rounded-lg border-l-4 border-green-600">
              <strong className="text-black text-base">Account Termination:</strong> 
              <span className="text-gray-800 ml-2">The administration reserves the right to suspend accounts for abusive behavior or violating university conduct rules.</span>
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
          <p className="mb-6 text-black text-base leading-relaxed font-medium">
            Your privacy is important to us.
          </p>
          <ul className="space-y-4">
            <li className="bg-gray-50 p-4 rounded-lg border-l-4 border-green-600">
              <strong className="text-black text-base">Data Collection:</strong> 
              <span className="text-gray-800 ml-2">We only collect your Name, Student Email, and Phone Number to facilitate item returns.</span>
            </li>
            <li className="bg-gray-50 p-4 rounded-lg border-l-4 border-green-600">
              <strong className="text-black text-base">Visibility:</strong> 
              <span className="text-gray-800 ml-2">Your contact details are only shared with the person you are communicating with regarding an item.</span>
            </li>
            <li className="bg-gray-50 p-4 rounded-lg border-l-4 border-green-600">
              <strong className="text-black text-base">No Sharing:</strong> 
              <span className="text-gray-800 ml-2">We do not sell or share your data with any third parties.</span>
            </li>
            <li className="bg-gray-50 p-4 rounded-lg border-l-4 border-green-600">
              <strong className="text-black text-base">Cookies:</strong> 
              <span className="text-gray-800 ml-2">We use essential cookies to keep you logged in.</span>
            </li>
            <li className="bg-gray-50 p-4 rounded-lg border-l-4 border-green-600">
              <strong className="text-black text-base">Image Privacy:</strong> 
              <span className="text-gray-800 ml-2">When uploading photos of sensitive documents (IDs, Credit Cards), please blur confidential numbers to prevent misuse.</span>
            </li>
            <li className="bg-gray-50 p-4 rounded-lg border-l-4 border-green-600">
              <strong className="text-black text-base">Activity Logs:</strong> 
              <span className="text-gray-800 ml-2">We record timestamps and IP addresses of posts to ensure account security and prevent spam.</span>
            </li>
            <li className="bg-gray-50 p-4 rounded-lg border-l-4 border-green-600">
              <strong className="text-black text-base">Data Retention:</strong> 
              <span className="text-gray-800 ml-2">Information regarding "Solved" cases is automatically archived or deleted after a specific period to ensure database efficiency.</span>
            </li>
            <li className="bg-gray-50 p-4 rounded-lg border-l-4 border-green-600">
              <strong className="text-black text-base">Google Auth:</strong> 
              <span className="text-gray-800 ml-2">Since we use Google Login (Edu Mail), your password is never stored on our servers; authentication is handled securely by Google.</span>
            </li>
          </ul>
        </div>
      </Modal>

      {/* User Guides Modal */}
      <Modal 
        isOpen={openModal === 'userguides'} 
        onClose={() => setOpenModal(null)}
        title="User Guides"
      >
        <div className="prose prose-sm max-w-none">
          <p className="mb-6 text-black text-base leading-relaxed font-medium">
            Welcome to the IIUC Lost & Found platform! This comprehensive guide will walk you through all the features and help you make the most of this service.
          </p>
          <div className="bg-green-50 p-6 rounded-xl border-2 border-green-600 mb-6">
            <h3 className="text-xl font-bold text-black mb-4 flex items-center gap-2">
              📚 What You'll Learn:
            </h3>
            <ul className="space-y-2 text-black">
              <li className="flex items-start gap-2">
                <span className="text-green-600 font-bold">✓</span>
                <span>How to sign in with your Ugrad Mail</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-600 font-bold">✓</span>
                <span>How to search for your lost items</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-600 font-bold">✓</span>
                <span>How to report found items</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-600 font-bold">✓</span>
                <span>How to claim items and communicate with finders</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-600 font-bold">✓</span>
                <span>Understanding the gender policy for safe meetups</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-600 font-bold">✓</span>
                <span>Best practices for quick reunions</span>
              </li>
            </ul>
          </div>
          <p className="mb-6 font-semibold text-base text-center bg-amber-500 text-black py-3 px-4 rounded-lg">
            🎥 Watch this complete walkthrough video to get started:
          </p>
          <YoutubePlayer videoId="xQc6o_q46e4" title="IIUC Lost & Found Platform Walkthrough"/>
        </div>
      </Modal>
    </footer>
  );
};

export default Footer;
