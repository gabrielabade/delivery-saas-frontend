import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App'
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from 'react-toastify';


import { AuthProvider } from './contexts/AuthContext'
import { StoreProvider } from './contexts/StoreContext'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AuthProvider>
      <StoreProvider>
        <App />
      </StoreProvider>
    </AuthProvider>
    <ToastContainer position="top-right" autoClose={3000} theme="colored" />
  </StrictMode>,
)
