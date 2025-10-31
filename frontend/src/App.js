import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { ConfigProvider } from './contexts/ConfigContext';
import { AuthCallback } from './components/auth/AuthCallback';
import { ProtectedRoute } from './components/auth/ProtectedRoute';
import VerifyEmail from './components/auth/VerifyEmail';
import Layout from './layout';
import Home from './pages/home';
import Packages from './pages/packages';
import Gallery from './pages/gallery';
import BookingPage from './pages/booking';
import MyBookingsPage from './pages/mybooking';
import Contact from './pages/contact';

export default function App() {
  return (
    <AuthProvider>
      <ConfigProvider>
        <BrowserRouter>
          <Routes>
            {/* Public pages */}
            <Route 
              path="/" 
              element={
                <Layout>
                  <Home />
                </Layout>
              } 
            />
            <Route 
              path="/packages" 
              element={
                <Layout>
                  <Packages />
                </Layout>
              } 
            />
            <Route 
              path="/gallery" 
              element={
                <Layout>
                  <Gallery />
                </Layout>
              } 
            />
            <Route 
              path="/contact" 
              element={
                <Layout>
                  <Contact />
                </Layout>
              } 
            />

            {/* Protected pages */}
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

            {/* Auth + utility routes */}
            <Route path="/auth/callback" element={<AuthCallback />} />
            <Route path="/verify-email" element={<VerifyEmail />} />
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
      </ConfigProvider>
    </AuthProvider>
  );
}
