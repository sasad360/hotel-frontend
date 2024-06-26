import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import {RouterProvider} from "react-router-dom";
import router from "./Assets/router.js";
import {ContextProvider} from "./Context/ContextProvider";
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer, toast } from 'react-toastify';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <ContextProvider>
            <ToastContainer />
        <RouterProvider router={router}/>
    </ContextProvider>
  </React.StrictMode>
);