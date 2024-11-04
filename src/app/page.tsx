"use client";
import React from "react";
import Link from "next/link";

const LandingPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-100">
      {/* Hero Section */}
      <header
        className="relative w-full h-screen flex items-center justify-center bg-cover bg-center"
        style={{ backgroundImage: "url(download.jpeg)" }}
      >
        <div className="absolute inset-0 bg-black opacity-50"></div>
        <div className="relative text-center text-white">
          <h1 className="text-4xl md:text-5xl font-bold">
            Driving Sustainability Metrics Forward
          </h1>
          <p className="mt-4 text-lg md:text-xl max-w-xl mx-auto">
            Empowering industrial companies to measure, improve, and achieve
            sustainability goals with Oren&apos;s B2B software solutions.
          </p>
          <Link href="/login" className="px-5">
            <button className="mt-8 px-6 py-3 bg-orenBlue text-white font-semibold rounded-md shadow hover:bg-orenBlue-dark transition-colors">
              Login
            </button>
          </Link>
          <Link href="/signup">
            <button className="mt-8 px-6 py-3 bg-orenBlue text-white font-semibold rounded-md shadow hover:bg-orenBlue-dark transition-colors">
              Signup
            </button>
          </Link>
        </div>
      </header>

      {/* About Section */}
      <section className="py-16 px-6 bg-white text-center">
        <h2 className="text-3xl font-semibold text-orenBlue">About Oren</h2>
        <p className="mt-4 max-w-3xl mx-auto text-gray-700">
          At Oren, we are committed to helping companies track and improve their
          environmental impact by providing insightful metrics on carbon
          emissions, water usage, waste generation, and more. With our intuitive
          platform, you can compare performance against industry benchmarks and
          drive meaningful change.
        </p>
      </section>

      {/* Metrics Summary Section */}
      <section className="py-16 bg-gray-100">
        <h2 className="text-3xl text-center font-semibold text-orenBlue">
          Sustainability Metrics
        </h2>
        <div className="mt-8 max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          <div className="p-6 bg-white rounded-lg shadow-lg border">
            <h3 className="text-xl font-semibold text-orenBlue">
              Carbon Emissions
            </h3>
            <p className="mt-2 text-gray-700">
              Track yearly carbon emissions and reduce environmental footprint.
            </p>
          </div>
          <div className="p-6 bg-white rounded-lg shadow-lg border">
            <h3 className="text-xl font-semibold text-orenBlue">Water Usage</h3>
            <p className="mt-2 text-gray-700">
              Monitor water consumption and manage resources effectively.
            </p>
          </div>
          <div className="p-6 bg-white rounded-lg shadow-lg border">
            <h3 className="text-xl font-semibold text-orenBlue">
              Waste Generated
            </h3>
            <p className="mt-2 text-gray-700">
              Track and reduce waste generation for a cleaner environment.
            </p>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 bg-orenBlue text-center text-white">
        <h2 className="text-3xl font-semibold">
          Ready to Transform Your Sustainability Metrics?
        </h2>
        <p className="mt-4 max-w-2xl mx-auto">
          Join Oren and start making a measurable impact on the environment
          today.
        </p>
        <button className="mt-8 px-6 py-3 bg-white text-orenBlue font-semibold rounded-md shadow hover:bg-gray-100 transition-colors">
          Get Started
        </button>
      </section>

      {/* Footer */}
      <footer className="py-8 bg-gray-800 text-center text-gray-400">
        <p>&copy; {new Date().getFullYear()} Oren. All rights reserved.</p>
        <a href="#" className="text-orenBlue hover:underline">
          Privacy Policy
        </a>{" "}
        |
        <a href="#" className="text-orenBlue hover:underline">
          Terms of Service
        </a>
      </footer>
    </div>
  );
};

export default LandingPage;
