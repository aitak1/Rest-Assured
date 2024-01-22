import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Homepage from './Components/Homepage/Homepage.tsx';
import Dashboard from './Components/Dashboard/dashboard.tsx';
// Import other components (Dashboard, Login, etc.)

function App() {
  return (
    <Router>
      <div>
        <Routes>
          <Route path="/" element={<Homepage />} />
          <Route path="/dashboard" element={<Dashboard key="dashboard"/>} />
          {/* Other routes */}
        </Routes>
      </div>
    </Router>
  );
}

export default App;
