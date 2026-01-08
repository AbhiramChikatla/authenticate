import React from "react";

const Contact = () => {
    return (
        <div className="px-4 pb-12 bg-gradient-to-br from-indigo-50 to-purple-100 min-h-screen">
            <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-lg p-8">
                <h1 className="text-3xl font-bold text-gray-800 mb-4">
                    Contact
                </h1>
                <p className="text-gray-600 mb-6">
                    This is a starter contact page. Add your support channels,
                    forms, or links here.
                </p>
                <div className="space-y-3 text-gray-700">
                    <p>
                        <span className="font-semibold">Email:</span>{" "}
                        support@example.com
                    </p>
                    <p>
                        <span className="font-semibold">Phone:</span> +1 (555)
                        123-4567
                    </p>
                    <p>
                        <span className="font-semibold">Hours:</span> Mon–Fri,
                        9am–6pm
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Contact;
