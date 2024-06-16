import React, { useState } from 'react';

const courses = [
    {
        "courseName": "Advanced Agricultural Techniques",
        "domain": "Agriculture",
        "description": "Learn advanced techniques in agriculture to improve crop yield and sustainability."
    },
    {
        "courseName": "Primary Education Pedagogy",
        "domain": "Education",
        "description": "Understand the modern pedagogical methods for effective primary education."
    },
    {
        "courseName": "Community Health and Hygiene",
        "domain": "Healthcare",
        "description": "Gain knowledge on maintaining and promoting health and hygiene in rural communities."
    },
    {
        "courseName": "Rural Administration and Governance",
        "domain": "Administration",
        "description": "Learn about rural administration and the governance frameworks for village development."
    },
    {
        "courseName": "Introduction to Solar Energy",
        "domain": "Renewable Energy",
        "description": "Explore the fundamentals of solar energy and its applications in rural settings."
    },
    {
        "courseName": "Microfinance and Rural Economy",
        "domain": "Finance",
        "description": "Understand the role of microfinance in boosting the rural economy."
    },
    {
        "courseName": "Basics of Veterinary Science",
        "domain": "Veterinary Services",
        "description": "Learn the basic principles of veterinary science and animal healthcare."
    },
    {
        "courseName": "Handicrafts and Small Scale Industries",
        "domain": "Arts & Crafts",
        "description": "Explore the techniques and business aspects of handicrafts and small-scale industries."
    },
    {
        "courseName": "Water Resource Management",
        "domain": "Civil Engineering",
        "description": "Understand the principles of water resource management and conservation."
    },
    {
        "courseName": "Social Work in Rural Areas",
        "domain": "Social Services",
        "description": "Learn about the challenges and strategies for social work in rural communities."
    }
];


const CourseCard = ({ course }) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleAccordion = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="border p-4 rounded-lg shadow-md">
      <h3 className="text-lg font-semibold">{course.courseName}</h3>
      <p className="text-gray-600">Domain: {course.domain}</p>
      <button 
        onClick={toggleAccordion} 
        className="text-blue-500 mt-2 focus:outline-none"
      >
        {isOpen ? "Hide Description" : "Show Description"}
      </button>
      {isOpen && <p className="text-gray-600 mt-2">{course.description}</p>}
    </div>
  );
};

function CourseLists() {
  const [filter, setFilter] = useState({
    courseName: '',
    domain: ''
  });

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilter({ ...filter, [name]: value });
  };

  const filteredCourses = courses.filter(course => 
    (filter.courseName === '' || course.courseName.toLowerCase().includes(filter.courseName.toLowerCase())) &&
    (filter.domain === '' || course.domain.toLowerCase().includes(filter.domain.toLowerCase()))
  );

  return (
    <div className="p-4">
      <div className="mb-4">
        <input
          type="text"
          name="courseName"
          placeholder="Filter by Course Name"
          value={filter.courseName}
          onChange={handleFilterChange}
          className="border p-2 mr-2 rounded"
        />
        <input
          type="text"
          name="domain"
          placeholder="Filter by Domain"
          value={filter.domain}
          onChange={handleFilterChange}
          className="border p-2 rounded"
        />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredCourses.map((course, index) => (
          <CourseCard key={index} course={course} />
        ))}
      </div>
    </div>
  );
};
  
  export default CourseLists