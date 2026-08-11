import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { CompareProvider } from './context/CompareContext';
import Navbar from './components/common/Navbar';
import Footer from './components/common/Footer';
import CompareFloatingBar from './components/common/CompareFloatingBar';

import HomePage from './pages/HomePage';
import ListingPage from './pages/ListingPage';
import DetailsPage from './pages/DetailsPage';
import ComparePage from './pages/ComparePage';
import BudgetExplorerPage from './pages/BudgetExplorerPage';
import RecommendationPage from './pages/RecommendationPage';
import AdminDashboardPage from './pages/AdminDashboardPage';
import AdminLoginPage from './pages/AdminLoginPage';
import AdminAddVehiclePage from './pages/AdminAddVehiclePage';
import AdminEditVehiclePage from './pages/AdminEditVehiclePage';
import AdminSettingsPage from './pages/AdminSettingsPage';
import AdminProtectedRoute from './components/admin/AdminProtectedRoute';
import AiAdvisorPage from './pages/AiAdvisorPage';

function App() {
  return (
    <Router>
      <CompareProvider>
        <div className="min-h-screen flex flex-col transition-colors duration-300">
          <Navbar />
          
          <main className="flex-1">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/vehicles" element={<ListingPage />} />
              <Route path="/cars" element={<ListingPage defaultType="car" />} />
              <Route path="/bikes" element={<ListingPage defaultType="bike" />} />
              <Route path="/vehicles/:id" element={<DetailsPage />} />
              <Route path="/compare" element={<ComparePage />} />
              <Route path="/budget-finder" element={<BudgetExplorerPage />} />
              <Route path="/recommend" element={<RecommendationPage />} />
              
              {/* Admin Auth & Protected Routes */}
              <Route path="/admin/login" element={<AdminLoginPage />} />
              <Route
                path="/admin"
                element={
                  <AdminProtectedRoute>
                    <AdminDashboardPage />
                  </AdminProtectedRoute>
                }
              />
              <Route
                path="/admin/vehicles/new"
                element={
                  <AdminProtectedRoute>
                    <AdminAddVehiclePage />
                  </AdminProtectedRoute>
                }
              />
              <Route
                path="/admin/vehicles/:id/edit"
                element={
                  <AdminProtectedRoute>
                    <AdminEditVehiclePage />
                  </AdminProtectedRoute>
                }
              />
              <Route
                path="/admin/settings"
                element={
                  <AdminProtectedRoute>
                    <AdminSettingsPage />
                  </AdminProtectedRoute>
                }
              />

              <Route path="/ai-advisor" element={<AiAdvisorPage />} />
            </Routes>
          </main>

          <CompareFloatingBar />
          <Footer />
        </div>
      </CompareProvider>
    </Router>
  );
}

export default App;
