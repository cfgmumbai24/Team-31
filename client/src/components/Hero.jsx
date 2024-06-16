import React from "react";
import MainImg from "../assets/Margshala-Logo.png";

const Hero = () => {
  return (
    <section className="overflow-hidden bg-gray-50 sm:grid sm:grid-cols-2 sm:items-center">
      <div className="p-8 md:p-12 lg:px-16 lg:py-24">
        <div className="mx-auto max-w-xl text-center ltr:sm:text-left rtl:sm:text-right">
          <h2 className="text-2xl font-bold text-gray-900 md:text-3xl">
            Who are we?
          </h2>

          <p className="hidden text-gray-500 md:mt-4 md:block">
            Decisions made at a young age often define the trajectory of our
            lives. If you are a youth who has been thinking of starting your own
            business, Margshala is just the program for you! Margshala will …
          </p>
        </div>
      </div>

      <img alt="" src={MainImg} />
    </section>
  );
};

export default Hero;
