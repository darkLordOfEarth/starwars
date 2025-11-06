import React from "react";
import ReactFlow from "reactflow";
import "reactflow/dist/style.css";
import { Outlet } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import './assets/css/app.css';
function App() {

  return (
   <div className="page-wrapper">
      <div className="page-content">
        <Header />
        <Outlet />
      </div>
      <Footer />
    </div>
  )
}

export default App
