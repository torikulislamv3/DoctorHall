import React from 'react'
import './index.css';
import Login from './pages/Login';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'


export default function App() {
  return (
    <div>
      <Login />
      <ToastContainer />
    </div>
  )
}
