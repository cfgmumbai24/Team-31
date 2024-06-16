import React, { useState } from 'react';

const jobListings = [
    { "Position": "Agricultural Officer", "Domain": "Agriculture", "Location": "Village A, Punjab" },
    { "Position": "Primary School Teacher", "Domain": "Education", "Location": "Village B, Uttar Pradesh" },
    { "Position": "Health Worker", "Domain": "Healthcare", "Location": "Village C, Bihar" },
    { "Position": "Village Development Officer", "Domain": "Administration", "Location": "Village D, Rajasthan" },
    { "Position": "Solar Technician", "Domain": "Renewable Energy", "Location": "Village E, Gujarat" },
    { "Position": "Microfinance Loan Officer", "Domain": "Finance", "Location": "Village F, Maharashtra" },
    { "Position": "Veterinary Assistant", "Domain": "Veterinary Services", "Location": "Village G, Karnataka" },
    { "Position": "Handicraft Trainer", "Domain": "Arts & Crafts", "Location": "Village H, West Bengal" },
    { "Position": "Water Resource Engineer", "Domain": "Civil Engineering", "Location": "Village I, Andhra Pradesh" },
    { "Position": "Community Social Worker", "Domain": "Social Services", "Location": "Village J, Tamil Nadu" }
];

const JobCard = ({ job }) => {
    return (
      <div className="border p-4 rounded-lg shadow-md">
        <h3 className="text-lg font-semibold">{job.Position}</h3>
        <p className="text-gray-600">Domain: {job.Domain}</p>
        <p className="text-gray-600">Location: {job.Location}</p>
      </div>
    );
  };

const JobList = () => {
  const [filter, setFilter] = useState({
    position: '',
    domain: '',
    location: ''
  });

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilter({ ...filter, [name]: value });
  };

  const filteredJobs = jobListings.filter(job => 
    (filter.position === '' || job.Position.toLowerCase().includes(filter.position.toLowerCase())) &&
    (filter.domain === '' || job.Domain.toLowerCase().includes(filter.domain.toLowerCase())) &&
    (filter.location === '' || job.Location.toLowerCase().includes(filter.location.toLowerCase()))
  );

  return (
    <div className="p-4">
      <div className="mb-4">
        <input
          type="text"
          name="position"
          placeholder="Filter by Position"
          value={filter.position}
          onChange={handleFilterChange}
          className="border p-2 mr-2 rounded"
        />
        <input
          type="text"
          name="domain"
          placeholder="Filter by Domain"
          value={filter.domain}
          onChange={handleFilterChange}
          className="border p-2 mr-2 rounded"
        />
        <input
          type="text"
          name="location"
          placeholder="Filter by Location"
          value={filter.location}
          onChange={handleFilterChange}
          className="border p-2 rounded"
        />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredJobs.map((job, index) => (
          <JobCard key={index} job={job} />
        ))}
      </div>
    </div>
  );
};

export default JobList;