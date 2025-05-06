import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import BookingForm from './components/BookingForm';
import AdminPanel from './components/AdminPanel';
import Analytics from './components/Analytics';
import { motion } from 'framer-motion';
import { useRequestStore } from './store/useRequestStore';

const App: React.FC = () => {
  const { fetchRequests } = useRequestStore();

  useEffect(() => {
    fetchRequests();
    if ('serviceWorker' in navigator && 'PushManager' in window) {
      navigator.serviceWorker.register('/sw.js').then(reg => {
        Notification.requestPermission().then(permission => {
          if (permission === 'granted') {
            reg.pushManager.subscribe({ userVisibleOnly: true }).then(sub => {
              console.log('Push subscription:', sub);
            });
          }
        });
      });
    }
  }, [fetchRequests]);

  return (
    <BrowserRouter basename="/doctor-net">
      <div className="min-h-screen">
        <Navbar />
        <motion.div
          className="container"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Routes>
            <Route path="/" element={<BookingForm />} />
            <Route path="/admin" element={<AdminPanel />} />
            <Route path="/analytics" element={<Analytics />} />
          </Routes>
        </motion.div>
      </div>
    </BrowserRouter>
  );
};

export default App;