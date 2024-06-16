import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const ExplorerLogin = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    phone_number: "",
    password: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  function showError() {
    const errorElem = document.getElementById('error');
    errorElem.textContent = "Login failed";
    setTimeout(function() {
      errorElem.textContent = ''; // Clear the text after 5 seconds
    }, 5000); // 5000 milliseconds = 5 seconds
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/login', formData);
      
      if(response.status === 200){
        navigate("/explore");
      } else {
        showError();
      }
    } catch (error) {
      showError();
      console.error("Error:", error);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-10 border rounded-lg shadow-md bg-teal-200">
      <h2 className="text-2xl font-bold mb-4 text-center">Login</h2>
      <form onSubmit={handleSubmit}>
        
        <div className="mb-4">
          <label className="block text-gray-700">Phone Number</label>
          <input
            type="text"
            name="phone_number"
            value={formData.phone_number}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Password</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
          />
        </div>
        <button
          type="submit"
          className="w-full bg-teal-500 text-white p-2 rounded"
        >
          Login
        </button>
      </form>
      <p id="error" className="text-red-500 mt-4"></p>
    </div>
  );
};

export default ExplorerLogin;