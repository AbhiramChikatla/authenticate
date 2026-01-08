import React from "react";
import { Link } from "react-router-dom";
import { Home, Search, AlertCircle } from "lucide-react";

const NotFound = () => {
    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center px-4">
            <div className="max-w-2xl w-full text-center">
                {/* 404 Illustration */}
                <div className="mb-8">
                    <div className="inline-flex items-center justify-center">
                        <h1 className="text-9xl font-bold text-gray-300">4</h1>
                        <div className="relative mx-4">
                            <div className="w-24 h-24 rounded-full bg-blue-500 flex items-center justify-center animate-pulse">
                                <AlertCircle className="w-12 h-12 text-white" />
                            </div>
                        </div>
                        <h1 className="text-9xl font-bold text-gray-300">4</h1>
                    </div>
                </div>

                {/* Error Message */}
                <div className="mb-8">
                    <h2 className="text-3xl font-bold text-gray-800 mb-4">
                        Oops! Page Not Found
                    </h2>
                    <p className="text-lg text-gray-600 mb-2">
                        The page you are looking for might have been removed,
                        had its name changed, or is temporarily unavailable.
                    </p>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                    <Link
                        to="/"
                        className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-lg shadow-lg transition-all duration-200 transform hover:scale-105"
                    >
                        <Home className="w-5 h-5" />
                        Go to Homepage
                    </Link>
                    <button
                        onClick={() => window.history.back()}
                        className="flex items-center gap-2 bg-gray-600 hover:bg-gray-700 text-white font-semibold px-6 py-3 rounded-lg shadow-lg transition-all duration-200 transform hover:scale-105"
                    >
                        <Search className="w-5 h-5" />
                        Go Back
                    </button>
                </div>

                {/* Additional Help Text */}
                <div className="mt-12 p-6 bg-white rounded-lg shadow-md">
                    <h3 className="text-lg font-semibold text-gray-800 mb-3">
                        Need Help?
                    </h3>
                    <p className="text-gray-600">
                        If you believe this is an error, please contact support
                        or try navigating from the homepage.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default NotFound;
