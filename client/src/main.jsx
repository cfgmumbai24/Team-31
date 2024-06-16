import React from "react";
import App from "./App.jsx";
import "./index.css";
import Explore from "./pages/Explore.jsx";
import Home from "./pages/Home.jsx";

import * as ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./index.css";
import Opportunities from "./pages/Opportunities.jsx";
import Courses from "./pages/Courses.jsx";
import MentorSign from "./components/mentorSign.jsx";
import MentorDash from "./components/mentorDash.jsx";
import ExplorerApply from "./pages/ExplorerApply.jsx";
import ChatBot from "./components/chatbot.jsx";
import ExplorerLogin from "./components/explorerLogin.jsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "/explore",
    element: <Explore />,
  },
  {
    path: "/explore/opportunities",
    element: <Opportunities />,
  },
  {
    path: "/explore/courses",
    element: <Courses />,
  },
  {
    path: "/mentor/signup",
    element: <MentorSign />,
  },
  {
    path: "/mentordash",
    element: <MentorDash />,
  },
  {
    path: "/explorer/signup",
    element: <ExplorerApply />,
  },
  {
    path: "/chat",
    element: <ChatBot />,
  },
  {
    path: "/explorer/login",
    element: <ExplorerLogin />,
  },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
