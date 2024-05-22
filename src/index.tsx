import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import DatabasePage from "./pages/DatabasePage/DatabasePage";
import DbDisplayTable from './pages/DatabasesDisplay/DatabasesDisplay';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

const router = createBrowserRouter([
                                     {
                                       path: '/',
                                       element: <DbDisplayTable />,
                                       errorElement: 'not found'
                                     },
                                     {
                                       path: '/database/:dbId',
                                       element: <DatabasePage />,
                                       errorElement: 'Database page not found'
                                     }
                                   ]);

root.render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
