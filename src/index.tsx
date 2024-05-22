import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import App from "./App";
import DatabasePage from "./pages/DatabasePage/DatabasePage";

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

const router = createBrowserRouter([
                                     {
                                       path: '/',
                                       element: <App />,
                                       errorElement: 'not found'
                                     },
                                     {
                                       path: '/database/:dbId',
                                       element: <DatabasePage />
                                       // errorElement: <DbPageNotFound /> // TODO: Impl
                                     }
                                   ]);

root.render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
