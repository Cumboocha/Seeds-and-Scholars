import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import './index.css'
import App from './App.jsx'
import Dashboard from './Components/Dashboard.jsx'
import Profile from './Components/UserProfile.jsx'
import DashboardAdmin from './Components/DashboardAdmin.jsx'
import Devs from './Components/Devs.jsx';

const router = createBrowserRouter([
  { path: "/", element: <App /> },
  { path: "/dashboard", element: <Dashboard /> },
  { path: "/profile", element: <Profile /> },
  {path: "/admin", element: <DashboardAdmin />},
  {path: "/devs", element: <Devs />}
]);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router}/>
  </StrictMode>
)
