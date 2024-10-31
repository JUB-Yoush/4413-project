
import { Routes, Route } from 'react-router-dom';
import MerchPage from './pages/MerchPage';
import Navbar from './components/Navbar';
import TestPage from './pages/TestPage';
import LogInPage from "./pages/LogInPage.tsx";
import SignUpPage from "./pages/SignUpPage.tsx";

function App() {
  return (
    <div className="bg-cream min-h-screen">
      <Navbar />
      <Routes>
        <Route path="/" element={<MerchPage />} />
        <Route path="/login" element={<LogInPage />} />
        <Route path="/signup" element={<SignUpPage />} />
        <Route path="/test" element={<TestPage />} />
      </Routes>
    </div>
  );
}

export default App;
