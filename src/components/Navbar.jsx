import React, { useContext, useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { userContext } from "../context/userContext";
import "react-loading-skeleton/dist/skeleton.css";
import Celekton from "./Celekton";
import { CircleUserRound } from "lucide-react";

const Navbar = () => {
    const [ready, SetReady] = useState(false);
    const [dropdown, setDropdown] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();

    const { LoginUser } = useContext(userContext);

    useEffect(() => {
        setTimeout(() => {
            SetReady(true);
        }, 500);
    }, []);
    const handleLogout = async () => {
        await fetch("http://localhost:3000/logout", {
            method: "GET",
            credentials: "include",
        });
        window.location.reload(); // refresh the page after logout
    };

    const isActive = (path) => location.pathname === path;

    return (
        <>
            <nav className="bg-white  fixed w-full z-20 top-0 start-0 border-b border-gray-200 dark:border-gray-600">
                <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
                    <Link
                        href="/"
                        className="flex items-center space-x-3 rtl:space-x-reverse"
                    >
                        <img
                            src="https://flowbite.com/docs/images/logo.svg"
                            className="h-8"
                            alt="Flowbite Logo"
                        />
                        <span className="self-center text-2xl font-semibold whitespace-nowrap dark:text-black">
                            Flowbite
                        </span>
                    </Link>
                    <div className="flex md:order-2 space-x-3 md:space-x-0 rtl:space-x-reverse gap-2">
                        {ready ? (
                            <>
                                {LoginUser ? (
                                    <>
                                        <div
                                            className="flex gap-2 border-2 border-gray-900 px-5 py-2 rounded-md "
                                            onClick={() =>
                                                setDropdown(!dropdown)
                                            }
                                        >
                                            <CircleUserRound />
                                            {LoginUser.username}
                                            {dropdown && (
                                                <div className="absolute  top-12 bg-white border border-gray-200 dark:border-gray-600 rounded-lg shadow-lg p-4 w-[10%]">
                                                    <ul className="flex flex-col gap-2">
                                                        <li>
                                                            <Link to="/profile">
                                                                Profile
                                                            </Link>
                                                        </li>
                                                        <li>
                                                            <Link
                                                                onClick={
                                                                    handleLogout
                                                                }
                                                            >
                                                                Logout
                                                            </Link>
                                                        </li>
                                                    </ul>
                                                </div>
                                            )}
                                        </div>
                                    </>
                                ) : (
                                    <>
                                        <button
                                            type="button"
                                            className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                                            onClick={() =>
                                                navigate("/register")
                                            }
                                        >
                                            SignUp
                                        </button>
                                        <button
                                            type="button"
                                            className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                                            onClick={() => navigate("/login")}
                                        >
                                            Login
                                        </button>
                                    </>
                                )}
                            </>
                        ) : (
                            <Celekton />
                        )}

                        <button
                            data-collapse-toggle="navbar-sticky"
                            type="button"
                            className="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
                            aria-controls="navbar-sticky"
                            aria-expanded="false"
                        >
                            <span className="sr-only">Open main menu</span>
                            <svg
                                className="w-5 h-5"
                                aria-hidden="true"
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 17 14"
                            >
                                <path
                                    stroke="currentColor"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M1 1h15M1 7h15M1 13h15"
                                />
                            </svg>
                        </button>
                    </div>
                    <div
                        className="items-center justify-between hidden w-full md:flex md:w-auto md:order-1"
                        id="navbar-sticky"
                    >
                        <ul className="flex flex-col p-4 md:p-0 mt-4 font-medium border border-gray-100 rounded-lg bg-gray-50 md:space-x-8 rtl:space-x-reverse md:flex-row md:mt-0 md:border-0 md:bg-white  ">
                            <li>
                                <Link
                                    to="/"
                                    className={`block py-2 px-3 rounded md:p-0 ${
                                        isActive("/")
                                            ? "text-blue-700 font-semibold"
                                            : "text-gray-900 md:text-gray-900 dark:text-black"
                                    }`}
                                    aria-current="page"
                                >
                                    Home
                                </Link>
                            </li>
                            <li>
                                <Link
                                    to="/about"
                                    className={`block py-2 px-3 rounded md:p-0 ${
                                        isActive("/about")
                                            ? "text-blue-700 font-semibold"
                                            : "text-gray-900 md:text-gray-900 dark:text-black"
                                    }`}
                                >
                                    About
                                </Link>
                            </li>
                            <li>
                                <Link
                                    to="/services"
                                    className={`block py-2 px-3 rounded md:p-0 ${
                                        isActive("/services")
                                            ? "text-blue-700 font-semibold"
                                            : "text-gray-900 md:text-gray-900 dark:text-black"
                                    }`}
                                >
                                    Services
                                </Link>
                            </li>
                            <li>
                                <Link
                                    to="/contact"
                                    className={`block py-2 px-3 rounded md:p-0 ${
                                        isActive("/contact")
                                            ? "text-blue-700 font-semibold"
                                            : "text-gray-900 md:text-gray-900 dark:text-black"
                                    }`}
                                >
                                    Contact
                                </Link>
                            </li>
                        </ul>
                    </div>
                </div>
            </nav>
        </>
    );
};

export default Navbar;
