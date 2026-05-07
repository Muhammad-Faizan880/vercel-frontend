import "./index.css";
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  useLocation,
} from "react-router-dom";
import { useContext } from "react";
import Home from "./pages/landing";
import AddEditProduct from "./pages/addEditProduct";
import ProductDetail from "./pages/productDetail";
import EditPage from "./pages/editPage";
import Login from "./auth/login";
import Signup from "./auth/register";
import ProtectedRoute from "./routes/protectedRoutes";
import Otp from "./auth/otp";
import Chat from "./pages/chat";
import Cart from "./pages/cart";
import Checkout from "./pages/checkout";
import Payment from "./pages/payment";
import PaymentSuccess from "./pages/paymentSuccess";
import FloatingCartButton from "./components/floatingCartButton";
import AdminDashboard from "./pages/AdminDashboard";
import { AuthContext } from "./context/authContext";
import ForgotPassword from "./auth/forgotPassword";
import ResetPassword from "./auth/resetPassword";

// token check helper
const isAuth = () => {
  return localStorage.getItem("token");
};

// Public Route Guard
const PublicRoute = ({ children }) => {
  if (isAuth()) {
    return <Navigate to="/" replace />;
  }
  return children;
};

// ✅ Conditional Cart Button - Role based (works with your authContext)
const ConditionalFloatingCartButton = () => {
  const { user } = useContext(AuthContext);
  const location = useLocation();
  const path = location.pathname;

  // Admin routes
  const adminRoutes = ["/admin", "/add", "/editPage"];
  const isAdminRoute = adminRoutes.some((route) => path.startsWith(route));

  // ❌ Don't show cart button if:
  // 1. User is admin, OR
  // 2. Route is admin route
  if (user?.role === "admin" || isAdminRoute) {
    return null;
  }

  // ✅ Show cart button only for normal users
  return <FloatingCartButton />;
};

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route
          path="/login"
          element={
            <PublicRoute>
              <Login />
            </PublicRoute>
          }
        />
        <Route
          path="/register"
          element={
            <PublicRoute>
              <Signup />
            </PublicRoute>
          }
        />
        <Route
          path="/otp"
          element={
            <PublicRoute>
              <Otp />
            </PublicRoute>
          }
        />

        <Route
          path="/forgot-password"
          element={
            <PublicRoute>
              <ForgotPassword />
            </PublicRoute>
          }
        />

        <Route
          path="/reset-password"
          element={
            <PublicRoute>
              <ResetPassword />
            </PublicRoute>
          }
        />

        {/* Admin Routes - NO cart button on these */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute adminOnly={true}>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/add"
          element={
            <ProtectedRoute adminOnly={true}>
              <AddEditProduct />
            </ProtectedRoute>
          }
        />
        <Route
          path="/editPage/:id"
          element={
            <ProtectedRoute adminOnly={true}>
              <EditPage />
            </ProtectedRoute>
          }
        />

        {/* User Routes - Cart button will show on these */}
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          }
        />
        <Route
          path="/productDetail/:id"
          element={
            <ProtectedRoute>
              <ProductDetail />
            </ProtectedRoute>
          }
        />
        <Route
          path="/chat"
          element={
            <ProtectedRoute>
              <Chat />
            </ProtectedRoute>
          }
        />
        <Route
          path="/cart"
          element={
            <ProtectedRoute>
              <Cart />
            </ProtectedRoute>
          }
        />
        <Route
          path="/checkout"
          element={
            <ProtectedRoute>
              <Checkout />
            </ProtectedRoute>
          }
        />
        <Route
          path="/payment"
          element={
            <ProtectedRoute>
              <Payment />
            </ProtectedRoute>
          }
        />
        <Route
          path="/payment-success"
          element={
            <ProtectedRoute>
              <PaymentSuccess />
            </ProtectedRoute>
          }
        />

        {/* Catch-all route */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>

      {/* ✅ FloatingCartButton - Shows ONLY on user routes, NOT on admin routes */}
      <ConditionalFloatingCartButton />
    </BrowserRouter>
  );
}

export default App;
