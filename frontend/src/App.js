import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './layout';
import Home from './pages/home';
import Packages from './pages/packages';
import Gallery from './pages/gallery';
import BookingPage from './pages/booking';
import MyBookingsPage from './pages/mybooking';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout><Home /></Layout>} />
        <Route path="/packages" element={<Layout><Packages /></Layout>} />
        <Route path="/gallery" element={<Layout><Gallery /></Layout>} />
        <Route path="/booking" element={<Layout><BookingPage /></Layout>} />
        <Route path="/mybooking" element={<Layout><MyBookingsPage /></Layout>} />
      </Routes>
    </BrowserRouter>
  );
} 