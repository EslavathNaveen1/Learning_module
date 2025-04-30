import MainHeader from "../Headers/MainHeader";
import MainHome from "../Home/MainHome"
import { useNavigate } from "react-router-dom";

import React from "react";
 
const About = () => {
  const navigate = useNavigate();
  return (
   
        <>
    
        <div className="max-w-4xl mx-auto p-8 text-center mt-2 bg-white rounded-xl shadow-md">
          <div className="inline-block mb-6">
            <h2 
              className="text-4xl font-bold mb-2 relative"
              style={{ color: "#A32CC4" }}
            >
              About            </h2>
          </div>
          
          <p className="text-[#333] text-lg mb-8 leading-relaxed">
            Welcome to <span className="font-semibold" style={{ color: "#A32CC4" }}>QTech E-Learning</span>, 
            your ultimate destination for high-quality e-learning. 
            We aim to bridge the gap between learners and experts through interactive and engaging courses.
          </p>
          
          <div className="grid md:grid-cols-2 gap-8 mb-8">
            <div className="bg-gray-50 p-6 rounded-lg shadow-sm">
              <h3 
                className="text-2xl font-semibold mb-4"
                style={{ color: "#A32CC4" }}
              >
                Our Mission
              </h3>
              <p className="text-[#333] leading-relaxed">
                Our mission is to empower individuals with knowledge and skills that help them excel in their careers.
                With our carefully curated content, we ensure a seamless and effective learning experience.
              </p>
            </div>
            
            <div className="bg-gray-50 p-6 rounded-lg shadow-sm">
              <h3 
                className="text-2xl font-semibold mb-4"
                style={{ color: "#A32CC4" }}
              >
                Why Choose Us?
              </h3>
              <ul className="space-y-3 text-left">
                {[
                  "Expert-led courses tailored for all levels",
                  "Interactive learning modules",
                  "24/7 accessibility across multiple devices"
                ].map((item, index) => (
                  <li key={index} className="flex items-start">
                    <div className="mr-2 mt-1 flex-shrink-0">
                      <svg className="w-5 h-5" viewBox="0 0 20 20" fill="currentColor" style={{ color: "#A32CC4" }}>
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <span className="text-[#333]">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          
          <div className="mt-8 mb-4">
            <p className="text-gray-700 text-lg font-medium mb-6">
              Join us today and start your journey toward success with QTech!
            </p>
            <button 
              className="px-8 py-3 text-white rounded-lg shadow-md transition-all hover:shadow-lg"
              style={{ backgroundColor: "#A32CC4" }}
              onClick={() => navigate("/login")}
            >
              Get Started
            </button>
          </div>
        </div>
      </>
  );
};
 
export default About;