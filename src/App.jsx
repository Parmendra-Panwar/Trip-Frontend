import { createBrowserRouter, RouterProvider, Outlet } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';

const Layout = () => (
  <div className="min-h-screen bg-slate-50">
    <Navbar />
    <main className="max-w-7xl mx-auto p-4">
      <Outlet />
    </main>
  </div>
);

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      { index: true, element: <Home /> },
      { path: "login", element: <Login /> },
      { path: "signup", element: <Signup /> },
    ],
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;