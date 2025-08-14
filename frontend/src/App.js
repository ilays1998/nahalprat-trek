import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { AuthCallback } from './components/auth/AuthCallback';
import { ProtectedRoute } from './components/auth/ProtectedRoute';
import Layout from './layout';
import Home from './pages/home';
import Packages from './pages/packages';
import Gallery from './pages/gallery';
import BookingPage from './pages/booking';
import MyBookingsPage from './pages/mybooking';

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* All pages now require authentication */}
          <Route 
            path="/" 
            element={
              <Layout>
                <ProtectedRoute>
                  <Home />
                </ProtectedRoute>
              </Layout>
            } 
          />
          <Route 
            path="/packages" 
            element={
              <Layout>
                <ProtectedRoute>
                  <Packages />
                </ProtectedRoute>
              </Layout>
            } 
          />
          <Route 
            path="/gallery" 
            element={
              <Layout>
                <ProtectedRoute>
                  <Gallery />
                </ProtectedRoute>
              </Layout>
            } 
          />
          <Route 
            path="/booking" 
            element={
              <Layout>
                <ProtectedRoute>
                  <BookingPage />
                </ProtectedRoute>
              </Layout>
            } 
          />
          <Route 
            path="/mybooking" 
            element={
              <Layout>
                <ProtectedRoute>
                  <MyBookingsPage />
                </ProtectedRoute>
              </Layout>
            } 
          />
          <Route path="/auth/callback" element={<AuthCallback />} />
          <Route 
            path="/login-error" 
            element={
              <Layout>
                <div className="text-center py-12">
                  <h2 className="text-2xl font-bold text-red-600 mb-4">Login Error</h2>
                  <p className="text-gray-600">There was an error during login. Please try again.</p>
                </div>
              </Layout>
            } 
          />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
} 