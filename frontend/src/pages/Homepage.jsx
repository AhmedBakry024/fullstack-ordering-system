import { useAuth } from '../context/AuthContext';
import AdminDashboard from '../pages/AdminDashboard';
import CourierDashboard from '../pages/CourierDashboard';
import CustomerDashboard from '../pages/CustomerDashboard';

const HomePage = () => {
  const { user } = useAuth();

  const renderDashboard = () => {
    switch (user?.role) {
      case 'customer':
        return <CustomerDashboard />;
      case 'courier':
        return <CourierDashboard />;
      case 'admin':
        return <AdminDashboard />;
      default:
        return <div>Please log in to continue</div>;
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Welcome {user?.name}</h1>
      {renderDashboard()}
    </div>
  );
};

export default HomePage;