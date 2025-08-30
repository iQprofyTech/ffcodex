import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import './index.css';
import 'reactflow/dist/style.css';
import App from './App';
import CanvasPage from './pages/CanvasPage';

createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />}> 
          <Route index element={<Navigate to="/canvas" replace />} />
          <Route path="/canvas" element={<CanvasPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);
