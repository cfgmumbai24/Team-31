import React from "react";
import { useNavigate } from "react-router-dom";
import MainImg from "../assets/Margshala-Logo.png";

const Card = ({ title, description, link }) => {
  return (
    <a
      href={link}
      className="block p-4 border rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300"
    >
      <div className="mt-4">
        <h3 className="text-lg font-semibold">{title}</h3>
        <p className="text-gray-600 mt-2">{description}</p>
      </div>
    </a>
  );
};

function Explore() {
  return (
    <div className="">
      <div className="flex flex-col mb-20 gap-4">
        <h1>Welcome Explorer!!</h1>
        <p className="text-gray-500">
          Explore you path ahead and see whats in there for you
        </p>
      </div>
      <div className="flex flex-row gap-7">
        <Card
          title="Opportunities"
          description="Explore nearby jobs and opportunities."
          link="/explore/opportunities"
        />

        <Card
          title="Courses"
          description="Explore courses and Learning Paths"
          link="/explore/courses"
        />
      </div>
    </div>
  );
}

export default Explore;
