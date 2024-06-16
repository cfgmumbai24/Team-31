import React from "react";
import { useState } from "react";
import JobList from "../components/jobLists";
import MainImg from "../assets/Margshala-Logo.png";

function Opportunities() {
  return (
    <div className="">
      <div className="flex-1 md:flex md:items-center md:gap-12">
        <a className="block text-purple-500" href="/">
          <img alt="" src={MainImg} width={100} />
        </a>
      </div>
      <div className="flex flex-col m-10 gap-4">
        <h1 className="text-teal-500">Opportunities</h1>
        <p className="text-gray-500">
          Filter them by Position, Domain or Location
        </p>
      </div>
      <JobList />
    </div>
  );
}

export default Opportunities;
