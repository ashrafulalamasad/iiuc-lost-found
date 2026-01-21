import { Routes, Route, useLocation, Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import Login from "./pages/Login";
import FindItems from "./pages/FindItems";
import ReportItem from "./pages/ReportItem";
import About from "./pages/About";
import Profile from "./pages/Profile";
import ItemDetails from "./pages/ItemDetails";
import Inbox from "./pages/Inbox";
import Chat from "./pages/Chat";
import GenderModal from "./components/GenderModal";
import { useAuth } from "./context/AuthContext";
import { authAPI } from "./services/api";

function ProtectedRoute({ children }) {
  const { currentUser, loading } = useAuth();

  if (loading) return <div>Loading...</div>;
  if (!currentUser) return <Navigate to="/login" />;

  return children;
}

function App() {
  const location = useLocation();
  const { currentUser, backendUser, refetchUser } = useAuth();
  const [isUpdatingGender, setIsUpdatingGender] = useState(false);
  
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  const handleGenderSelect = async (gender) => {
    if (!backendUser?.id) {
      alert('User data not loaded. Please refresh the page.');
      return;
    }
    
    setIsUpdatingGender(true);
    try {
      const response = await authAPI.updateGender(backendUser.id, gender);
      console.log('Gender update response:', response);
      // Refetch user data to update context
      await refetchUser();
    } catch (error) {
      console.error('Failed to update gender:', error);
      alert('Failed to update gender. Please try again.');
    } finally {
      setIsUpdatingGender(false);
    }
  };

  // Show gender modal if user is logged in but hasn't set gender
  const needsGenderSelection = currentUser && backendUser && !backendUser.gender;
  
  // Debug logging
  useEffect(() => {
    console.log('=== Gender Modal Debug ===');
    console.log('currentUser:', currentUser ? 'Logged in' : 'Not logged in');
    console.log('backendUser:', backendUser);
    console.log('backendUser.gender:', backendUser?.gender);
    console.log('needsGenderSelection:', needsGenderSelection);
  }, [currentUser, backendUser, needsGenderSelection]);

  return (
    <div className="min-h-screen flex flex-col text-slate-900">
      <Navbar />
      
      {/* Global Gender Modal - Blocks all interaction until gender is set */}
      {needsGenderSelection && (
        <GenderModal 
          onGenderSelect={handleGenderSelect}
          userName={currentUser?.displayName || backendUser?.fullName}
          isUpdating={isUpdatingGender}
        />
      )}

      <main className="grow">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/find" element={<FindItems />} />
          <Route path="/item/:id" element={<ItemDetails />} />
          <Route path="/about" element={<About />} />

          {/* Protected Routes */}
          <Route
            path="/report"
            element={
              <ProtectedRoute>
                <ReportItem />
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />
          <Route
            path="/inbox"
            element={
              <ProtectedRoute>
                <Inbox />
              </ProtectedRoute>
            }
          />
          <Route
            path="/chat/:claimId"
            element={
              <ProtectedRoute>
                <Chat />
              </ProtectedRoute>
            }
          />
        </Routes>
      </main>

      <Footer />
    </div>
  );
}

export default App;
