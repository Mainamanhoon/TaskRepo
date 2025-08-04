import React from 'react';
import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from 'react-router-dom';

// Layouts
import RootLayout from './layouts/RootLayout';

// Pages
import CalculatorPage from './pages/CalculatorPage';
import ShaderPage from './pages/ShaderPage';
import NotFoundPage from './pages/NotFoundPage';


// Create the router
const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<RootLayout />}>
      <Route index element={<CalculatorPage />} />
      <Route path="shader" element={<ShaderPage />} />
      <Route path="*" element={<NotFoundPage />} />
    </Route>
  )
);

function App() {
  return <RouterProvider router={router} />;
}

export default App;