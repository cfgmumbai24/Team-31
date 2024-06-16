import React from "react";

const CTA = () => {
  return (
    <section className="bg-gray-50 border-y">
      <div className="p-8 md:p-12 lg:px-16 lg:py-24">
        <div className="mx-auto max-w-2xl text-center ">
          <h2 className="text-2xl font-bold text-gray-900 md:text-3xl">
            What we provide ?
          </h2>

          <div className="flex flex-row justify-around m-10 gap-16 w-50">
            <div className="border p-4 rounded-lg shadow-md">
              <h3 className="text-lg font-semibold">KhojShala</h3>
              <p className="text-gray-600">
                Get to know the nearby opportunities and mentorships
              </p>
            </div>
            <div className="border p-4 rounded-lg shadow-md">
              <h3 className="text-lg font-semibold">Swarojgar Fellowship</h3>
              <p className="text-gray-600">
                Grow your business with out help and your ambition
              </p>
            </div>
          </div>
        </div>
        <div className="flex justify-center">
          <div className="mt-4 md:mt-8">
            <a
              href="/explorer/signup"
              className="inline-block rounded bg-teal-500 px-12 py-3 text-sm font-medium text-white transition hover:bg-emerald-700 focus:outline-none focus:ring focus:ring-yellow-400"
            >
              Get Started Today
            </a>
          </div>
        </div>
        <div className="max-w-md mx-auto mt-20 p-4 border rounded-lg shadow-md text-center">
          <h2 className="text-2xl font-bold mb-4">Join Newsletter</h2>
          <form className="flex items-center justify-center gap-5">
            <input
              type="email"
              name="email"
              className="p-2 border rounded-l"
              placeholder="Enter your email"
              required
            />
            <button
              type="submit"
              className="bg-teal-500 text-white p-2 rounded-r"
            >
              Sign Up
            </button>
          </form>
        </div>
      </div>
    </section>
  );
};

export default CTA;
