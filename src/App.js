import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
  Navigate,
} from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";
import "./App.css";
import Home from "./pages/Home/index";


const App = () => {
  return (
    <Router>
      <Home />
    </Router>
  );
};

export default App;
