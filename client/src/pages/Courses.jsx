import React from "react";
import CourseLists from "../components/courseLists";
import MainImg from "../assets/Margshala-Logo.png";

function Courses() {
  return (
    <div className="">
      <div className="flex-1 md:flex md:items-center md:gap-12">
        <a className="block text-purple-500" href="/">
          <img alt="" src={MainImg} width={100} />
        </a>
      </div>
      <div className="flex flex-col m-10 gap-4">
        <h1 className="text-teal-500">Courses</h1>
      </div>
      <CourseLists />
    </div>
  );
}

export default Courses;
