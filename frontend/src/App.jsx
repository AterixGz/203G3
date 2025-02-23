import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Layout from "./components/Layouts/layout";
import ActionButtons from "./components/Pages/NewDesign/action-buttons";
import UploadZone from "./components/Pages/NewDesign/upload-zone";
import DocumentGrid from "./components/Pages/NewDesign/document-grid";
import Login from "./components/Pages/Login";
import Register from "./components/Pages/Register";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route
          path="/dashboard"
          element={
            <Layout>
              <ActionButtons />
              <UploadZone />
              <div className="mt-8">
                <DocumentGrid />
              </div>
            </Layout>
          }
        />
      </Routes>
    </Router>
  );
};

export default App;
