import { createBrowserRouter, RouterProvider } from "react-router-dom";
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
                <RouterProvider router={router} />
            </UserContextProvider>
        </>
    );
}

export default App;
