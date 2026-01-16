import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import Login from "./pages/Login";
import Register from "./pages/Register";
import HomePage from "./pages/HomePage";
import About from "./pages/About";
import Services from "./pages/Services";
import Contact from "./pages/Contact";
import { UserContextProvider } from "./context/userContext";
import Test from "./pages/Test";
import NotFound from "./pages/NotFound";
import MainLayout from "./layouts/MainLayout";
import Profile from "./pages/Profile";
import Blogs from "./pages/Blogs";
import CreateBlog from "./pages/CreateBlog";
import BlogDetail from "./pages/BlogDetail";
import Admin from "./pages/Admin";
function App() {
    const router = createBrowserRouter([
        {
            path: "/login",
            element: <Login />,
        },
        {
            path: "/register",
            element: <Register />,
        },
        {
            element: <MainLayout />,
            children: [
                {
                    index: true,
                    element: <HomePage />,
                },
                {
                    path: "about",
                    element: <About />,
                },
                {
                    path: "services",
                    element: <Services />,
                },
                {
                    path: "contact",
                    element: <Contact />,
                },
                {
                    path: "test",
                    element: <Test />,
                },
                {
                    path: "profile",
                    element: <Profile />,
                },
                {
                    path: "blogs",
                    element: <Blogs />,
                },
                {
                    path: "blogs/create",
                    element: <CreateBlog />,
                },
                {
                    path: "blogs/:id",
                    element: <BlogDetail />,
                },
                {
                    path: "admin",
                    element: <Admin />,
                },
                {
                    path: "*",
                    element: <NotFound />,
                },
            ],
        },
    ]);

    return (
        <>
            <UserContextProvider>
                <Toaster
                    position="top-right"
                    toastOptions={{
                        duration: 4000,
                        style: {
                            background: "#fff",
                            color: "#363636",
                            padding: "16px",
                            borderRadius: "8px",
                            boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
                        },
                        success: {
                            iconTheme: {
                                primary: "#10b981",
                                secondary: "#fff",
                            },
                        },
                        error: {
                            iconTheme: {
                                primary: "#ef4444",
                                secondary: "#fff",
                            },
                        },
                    }}
                />
                <RouterProvider router={router} />
            </UserContextProvider>
        </>
    );
}

export default App;
