import { Link } from "react-router-dom";
import React from "react";
const Home = () => {
  return (
    <div className="text-center p-6">
      <h1 className="text-3xl mb-4">Welcome to Task Manager</h1>
      <Link to="/login" className="p-2 bg-blue-500 text-white rounded mr-2">Login</Link>
      <Link to="/register" className="p-2 bg-green-500 text-white rounded">Register</Link>
    </div>
  );
};

export default Home;
