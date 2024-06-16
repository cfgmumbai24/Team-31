import React, { useState } from "react";
import axios from "axios";
import { redirect } from "react-router-dom";
// import { useHistory } from 'react-router-dom';

const domains = [
  "Agriculture",
  "Education",
  "Healthcare",
  "Administration",
  "Renewable Energy",
  "Finance",
  "Veterinary Services",
  "Arts & Crafts",
  "Civil Engineering",
  "Social Services",
];

const MentorSign = () => {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    password: "",
    domain: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      //   const response = await axios.post('/abc', formData);
      //   console.log('Success:', response.data);
      console.log(formData);
      redirect("/mentordash");
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-10 border rounded-lg shadow-md bg-teal-200">
      <h2 className="text-2xl font-bold mb-4 text-center">Sign Up</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-gray-700">Name</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Phone</label>
          <input
            type="text"
            name="phone"
            value={formData.phone}
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
        <div className="mb-4">
          <label className="block text-gray-700">Domain</label>
          <select
            name="domain"
            value={formData.domain}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
          >
            <option value="" disabled>
              Select Domain
            </option>
            {domains.map((domain, index) => (
              <option key={index} value={domain}>
                {domain}
              </option>
            ))}
          </select>
        </div>
        <button
          type="submit"
          className="w-full bg-teal-500 text-white p-2 rounded"
        >
          Sign Up
        </button>
      </form>
    </div>
  );
};

export default MentorSign;
