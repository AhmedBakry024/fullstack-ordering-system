import { useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';  // Import useNavigate for navigation

const HomePage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();  // Hook for navigation

  // Effect to navigate based on user role
  useEffect(() => {
    if (user?.role) {
      switch (user.role) {
        case 'customer':
          navigate('/home-page');  // Navigate to customer dashboard
          break;
        case 'courier':
          navigate('/courier-dashboard');  // Navigate to courier dashboard
          break;
        case 'admin':
          navigate('/admin-dashboard');  // Navigate to admin dashboard
          break;
        default:
          navigate('/login');  // Redirect to login if role is not found
      }
    } else {
      navigate('/login');  // Redirect to login if no user is logged in
    }
  }, [user, navigate]);  // Re-run effect when user changes

  return (
    <div className="container mx-auto px-6 py-8">
      <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">
        Welcome {user?.name || 'Guest'}
      </h2>
      {/* Optionally display a loading or fallback state */}
      {!user && <p>Please log in to continue</p>}
    </div>
  );
};

export default HomePage;
