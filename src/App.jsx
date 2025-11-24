import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import History from "./pages/History";
import Signup from "./pages/Signup";
import Chat from "./pages/chat";
import { useAuth } from "./context/AuthContext";
import Navbar from "./components/Navbar";
import "./index.css";
import AddMoney from "./pages/AddMoney";
import SendMoney from "./pages/SendMoney";
import Settings from "./pages/Settings";
import Contacts from "./pages/Contacts";
import ForgotPassword from "./pages/ForgotPassword";

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return <div className="fullscreen-loader">Loading...</div>;
  }

  return isAuthenticated ? children : <Navigate to="/login" replace />;
};

const PublicRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return <div className="fullscreen-loader">Loading...</div>;
  }

  return !isAuthenticated ? children : <Navigate to="/dashboard" replace />;
};

// Wrapper component for pages that need navbar spacing
const PageWithNavbar = ({ children }) => {
  return (
    <div style={{ 
      paddingBottom: '120px', // Space for navbar
      minHeight: '100vh'
    }}>
      {children}
    </div>
  );
};

function App() {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return <div className="fullscreen-loader">Initializing...</div>;
  }

  return (
    <div className="app">
      {isAuthenticated && <Navbar />}

      <main>
        <Routes>

          {/* PUBLIC ROUTES */}
          <Route
            path="/login"
            element={
              <PublicRoute>
                <Login />
              </PublicRoute>
            }
          />

          <Route
            path="/signup"
            element={
              <PublicRoute>
                <Signup />
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

          {/* PROTECTED ROUTES WITH NAVBAR SPACING */}
          <Route 
            path="/dashboard" 
            element={
              <ProtectedRoute>
                <PageWithNavbar>
                  <Dashboard />
                </PageWithNavbar>
              </ProtectedRoute>
            } 
          />
          
          <Route 
            path="/history" 
            element={
              <ProtectedRoute>
                <PageWithNavbar>
                  <History />
                </PageWithNavbar>
              </ProtectedRoute>
            } 
          />
          
          <Route 
            path="/chat" 
            element={
              <ProtectedRoute>
                <PageWithNavbar>
                  <Chat />
                </PageWithNavbar>
              </ProtectedRoute>
            } 
          />
          
          <Route 
            path="/add-money" 
            element={
              <ProtectedRoute>
                <PageWithNavbar>
                  <AddMoney />
                </PageWithNavbar>
              </ProtectedRoute>
            } 
          />
          
          <Route 
            path="/send-money" 
            element={
              <ProtectedRoute>
                <PageWithNavbar>
                  <SendMoney />
                </PageWithNavbar>
              </ProtectedRoute>
            } 
          />
          
          <Route 
            path="/settings" 
            element={
              <ProtectedRoute>
                <PageWithNavbar>
                  <Settings />
                </PageWithNavbar>
              </ProtectedRoute>
            } 
          />
          
          <Route 
            path="/contacts" 
            element={
              <ProtectedRoute>
                <PageWithNavbar>
                  <Contacts />
                </PageWithNavbar>
              </ProtectedRoute>
            } 
          />

          {/* DEFAULT */}
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="*" element={<Navigate to="/login" replace />} />

        </Routes>
      </main>
    </div>
  );
}

export default App;