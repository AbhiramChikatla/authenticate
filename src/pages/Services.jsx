import React from "react";

const services = [
    {
        title: "Authentication",
        desc: "Email/password login with sensible validation and session handling.",
    },
    {
        title: "User Profiles",
        desc: "Starter profile layout you can extend with preferences and avatars.",
    },
    {
        title: "Access Control",
        desc: "Role-based patterns ready to customize for your app needs.",
    },
];

const Services = () => {
    return (
        <div className="px-4 pb-12 bg-gradient-to-br from-gray-50 to-blue-50 min-h-screen">
            <div className="max-w-6xl mx-auto">
                <div className="mb-8 text-center">
                    <h1 className="text-3xl font-bold text-gray-800">
                        Services
                    </h1>
                    <p className="text-gray-600 mt-2">
                        A simple list you can adapt to your feature set.
                    </p>
                </div>
                <div className="grid md:grid-cols-3 gap-6">
                    {services.map((item) => (
                        <div
                            key={item.title}
                            className="bg-white rounded-2xl shadow-md border border-gray-100 p-6 hover:-translate-y-1 transition-transform"
                        >
                            <h2 className="text-xl font-semibold text-gray-800">
                                {item.title}
                            </h2>
                            <p className="text-gray-600 mt-3 text-sm leading-relaxed">
                                {item.desc}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Services;
