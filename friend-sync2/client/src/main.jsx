import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Index from "./Index/Index";
import UserHomepage from "./UserHomepage/UserHomepage"
import SignUp from "./SignUp/SignUp"
import { GoogleOAuthProvider } from '@react-oauth/google';
import TellUsAboutYourself from "./TellAboutYourself/TellUsAboutYourself";
import FriendHomepage from './FriendHomepage/FriendHomepage'

const router = createBrowserRouter([
  {
    path: "/",
    element: <Index />,
  },
  {
    path: "homepage",
    element: <UserHomepage />,
  },
  {
    path: "sign-up",
    element: <SignUp />,
  },
  {
    path: "tell-us-about-yourself",
    element: <TellUsAboutYourself />,
  },
  {
    path: "friend-homepage",
    element: <FriendHomepage />,
  },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <GoogleOAuthProvider clientId={import.meta.env.VITE_CLIENT_ID}>
      <RouterProvider router={router} />
    </GoogleOAuthProvider>
  </React.StrictMode>
);