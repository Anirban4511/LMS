import { Button } from "./components/ui/button";
import "./App.css";
import Login from "./pages/login";
import Navbar from "./components/Navbar";
import HeroSection from "./pages/student/admin/HeroSection";
import { createBrowserRouter } from "react-router-dom";
import MainLayout from "./layout/MainLayout";
import { RouterProvider } from "react-router-dom";
import Courses from "./pages/student/Courses";
import MyLearning from "./pages/student/MyLearning";
import Profile from "./pages/student/Profile";
import ForgotPassword from "./forgotpassword/Forgotpassword";
import ResetPassword from "./reset-password/ResetPassword";

const appRouter = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    children: [
      {
        path: "/",
        element: (
          <>
            <HeroSection />
            <Courses />
          </>
        ),
      },
      {
        path: "login",
        element: <Login />,
      },
      {
        path: "my-learning",
        element: <MyLearning />,
      },
      {
        path: "profile",
        element: <Profile />,
      },
      { path: "forgot-password", element: <ForgotPassword /> },
      {
        path: "reset-password/:token",
        element: <ResetPassword />,
      },
    ],
  },
]);
function App() {
  return (
    <main>
      <RouterProvider router={appRouter} />
    </main>
  );
}

export default App;
