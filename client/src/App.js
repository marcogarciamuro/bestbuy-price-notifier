import Home from "./components/Home/Home";
import React from "react";
import Register from "./components/Register";
import Login from "./components/Login";
import TrackProduct from "./components/TrackProduct";
import { AuthProvider } from "./contexts/AuthContext";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import CustomNavbar from "./components/CustomNavbar";

function App() {
  return (
    <>
      <Router>
        <AuthProvider>
          <CustomNavbar />
          <Routes>
            <Route exact path="/" element={<Home />} />
            <Route path="/track-product" element={<TrackProduct />} />
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} />
          </Routes>
        </AuthProvider>
      </Router>
    </>
  );
}

export default App;
