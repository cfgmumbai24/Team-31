import React from "react";
import MainImg from "../assets/Margshala-Logo.png";

const Navbar = () => {
  return (
    <header className="bg-white">
      <div className="mx-auto max-w-screen-xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="flex-1 md:flex md:items-center md:gap-12">
            <a className="block text-purple-500" href="/">
              <img alt="" src={MainImg} width={100} />
            </a>
          </div>

          <div className="md:flex md:items-center md:gap-12">
            <div className="flex items-center gap-4">
              <div className="sm:flex sm:gap-4">
              <a
                  className="rounded-md bg-teal-500 px-5 py-2.5 text-sm font-medium text-white shadow"
                  href="/explorer/login"
                >
                  Login
                </a>
                <a
                  className="rounded-md bg-teal-500 px-5 py-2.5 text-sm font-medium text-white shadow"
                  href="/explorer/signup"
                >
                  Apply
                </a>

                <a
                  className="rounded-md bg-teal-500 px-5 py-2.5 text-sm font-medium text-white shadow"
                  href="/mentor/signup"
                >
                  Mentor Sign-up
                </a>

                <a
                  className="rounded-md bg-teal-500 px-5 py-2.5 text-sm font-medium text-white shadow"
                  href="/chat"
                >
                  Chat
                </a>
              </div>

              <div className="block md:hidden">
                <button className="rounded bg-gray-100 p-2 text-gray-600 transition hover:text-gray-600/75">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M4 6h16M4 12h16M4 18h16"
                    />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
