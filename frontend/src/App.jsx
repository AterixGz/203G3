import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Layout from "./components/Layouts/layout";
import ActionButtons from "./components/Pages/NewDesign/action-buttons";
import UploadZone from "./components/Pages/NewDesign/upload-zone";
import DocumentGrid from "./components/Pages/NewDesign/document-grid";
import Login from "./components/Pages/Login";
import Register from "./components/Pages/Register";

const isAuthenticated = () => {
  return localStorage.getItem("token") !== null; // เช็คว่ามี token ไหม
};

const ProtectedRoute = ({ children }) => {
  return isAuthenticated() ? children : <Navigate to="/login" replace />;
};

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Layout>
                <ActionButtons />
                <UploadZone />
                <div className="mt-8">
                  <DocumentGrid />
                </div>
              </Layout>
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
};

export default App;
