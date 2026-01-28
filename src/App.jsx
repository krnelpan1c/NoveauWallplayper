import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import PickerPage from './pages/PickerPage';
import ViewerPage from './pages/ViewerPage';

function App() {
  return (
    <Router basename="/NoveauWallplayper">
      <Routes>
        <Route path="/" element={<PickerPage />} />
        <Route path="/view/:id" element={<ViewerPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
