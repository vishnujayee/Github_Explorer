import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { SearchPage } from './pages/SearchPage';
import { DashboardPage } from './pages/DashboardPage';
import { Navbar } from './components/Navbar';
import { SearchProvider } from './contexts/SearchContext';
import './App.css';

function App() {
  return (
    <SearchProvider>
      <Router>
        <div className="min-h-screen bg-gray-50">
          <Navbar />
          <main className="container mx-auto px-4 py-8">
            <Routes>
              <Route path="/" element={<SearchPage />} />
              <Route path="/dashboard" element={<DashboardPage />} />
            </Routes>
          </main>
        </div>
      </Router>
    </SearchProvider>
  );
}

export default App; 