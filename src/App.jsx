import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import PickerPage from './pages/PickerPage';
import ViewerPage from './pages/ViewerPage';

function App() {
  // Trim trailing slash from BASE_URL for React Router basename
  const basename = import.meta.env.BASE_URL.replace(/\/$/, "");

  return (
    <Router basename={basename}>
      <Routes>
        <Route path="/" element={<PickerPage />} />
        <Route path="/view/:id" element={<ViewerPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
