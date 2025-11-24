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

// Minimal wrapper that only adds bottom spacing for navbar
const NavbarSpacer = ({ children }) => {
  return (
    <div style={{ 
      paddingBottom: '100px', // Only bottom padding for navbar
      minHeight: '100vh',
      margin: 0,
      paddingTop: 0 // Ensure no top padding
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
    <div className="app" style={{ margin: 0, padding: 0 }}>
      {isAuthenticated && <Navbar />}

      <main style={{ margin: 0, padding: 0 }}>
        <Routes>

          {/* PUBLIC ROUTES - No navbar spacing */}
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

          {/* PROTECTED ROUTES - Only bottom spacing for navbar */}
          <Route 
            path="/dashboard" 
            element={
              <ProtectedRoute>
                <NavbarSpacer>
                  <Dashboard />
                </NavbarSpacer>
              </ProtectedRoute>
            } 
          />
          
          <Route 
            path="/history" 
            element={
              <ProtectedRoute>
                <NavbarSpacer>
                  <History />
                </NavbarSpacer>
              </ProtectedRoute>
            } 
          />
          
          <Route 
            path="/chat" 
            element={
              <ProtectedRoute>
                <NavbarSpacer>
                  <Chat />
                </NavbarSpacer>
              </ProtectedRoute>
            } 
          />
          
          <Route 
            path="/add-money" 
            element={
              <ProtectedRoute>
                <NavbarSpacer>
                  <AddMoney />
                </NavbarSpacer>
              </ProtectedRoute>
            } 
          />
          
          <Route 
            path="/send-money" 
            element={
              <ProtectedRoute>
                <NavbarSpacer>
                  <SendMoney />
                </NavbarSpacer>
              </ProtectedRoute>
            } 
          />
          
          <Route 
            path="/settings" 
            element={
              <ProtectedRoute>
                <NavbarSpacer>
                  <Settings />
                </NavbarSpacer>
              </ProtectedRoute>
            } 
          />
          
          <Route 
            path="/contacts" 
            element={
              <ProtectedRoute>
                <NavbarSpacer>
                  <Contacts />
                </NavbarSpacer>
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