import React from "react";

const About = () => {
    return (
        <div className="px-4 pb-12 bg-gradient-to-br from-blue-50 to-indigo-100 min-h-screen">
            <div className="max-w-5xl mx-auto bg-white rounded-2xl shadow-lg p-8">
                <h1 className="text-3xl font-bold text-gray-800 mb-4">
                    About Us
                </h1>
                <p className="text-gray-600 leading-relaxed mb-6">
                    We are focused on delivering simple, secure authentication
                    experiences. This page is a starter placeholder—customize it
                    with your team story, mission, and product highlights.
                </p>
                <div className="grid md:grid-cols-3 gap-4">
                    <div className="bg-blue-50 border border-blue-100 rounded-xl p-4">
                        <p className="text-lg font-semibold text-gray-800">
                            Secure by Design
                        </p>
                        <p className="text-gray-600 text-sm mt-2">
                            Built with sensible defaults to protect user data.
                        </p>
                    </div>
                    <div className="bg-indigo-50 border border-indigo-100 rounded-xl p-4">
                        <p className="text-lg font-semibold text-gray-800">
                            Fast Experience
                        </p>
                        <p className="text-gray-600 text-sm mt-2">
                            Lightweight UI that keeps sign-in quick.
                        </p>
                    </div>
                    <div className="bg-purple-50 border border-purple-100 rounded-xl p-4">
                        <p className="text-lg font-semibold text-gray-800">
                            Developer Friendly
                        </p>
                        <p className="text-gray-600 text-sm mt-2">
                            Clean structure so you can extend easily.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default About;
