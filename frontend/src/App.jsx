import Layout from "./components/Layouts/layout"
import UploadZone from "./components/Pages/NewDesign/upload-zone"
import DocumentGrid from "./components/Pages/NewDesign/document-grid"
import ActionButtons from "./components/Pages/NewDesign/action-buttons"
import './App.css'

function App() {

  return (
    <Layout>
      <ActionButtons />
      <UploadZone />
      <div className="mt-8">
        <DocumentGrid />
      </div>
    </Layout>
  )
}

export default App
