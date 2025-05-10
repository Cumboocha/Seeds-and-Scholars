import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import Dashboard from './Dashboard.jsx'
import Profile from './Profile.jsx'
import { createBrowserRouter, RouterProvider } from "react-router-dom";

const router = createBrowserRouter([
  { path: "/", element: <App /> },
  { path: "/dashboard", element: <Dashboard /> },
  { path: "/profile", element: <Profile /> },
]);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router}/>
  </StrictMode>,
)
