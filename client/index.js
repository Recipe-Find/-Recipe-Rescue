import React from 'react';
import { createRoot } from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import App from './App.jsx';
import Login from './Components/Login.jsx';
import Logout from './Components/Logout.jsx';
import Signup from './Components/Signup.jsx';
import FavoriteRecipe from './Components/FavoriteRecipe.js';

const root = createRoot(document.getElementById('root'));
const router = createBrowserRouter([
  { path: '/', element: <App /> },
  {
    path: '/login',
    element: <Login />
  },
  { path: '/signup', element: <Signup /> },
  { path: '/logout', element: <Logout /> },
  { path: '/favoriteRecipe', element: <FavoriteRecipe /> }
]);
root.render(<RouterProvider router={router} />);
