import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { createBrowserRouter, RouterProvider, Outlet } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import { getProfile } from './store/slices/authSlice';
import SingleListing from './pages/SingleListing';
import NotFound from './pages/NotFound';
import CreateListing from './pages/CreateListing';
import Toaster from './components/Toaster';

import { fetchListings } from './store/slices/listingSlice';
import { resetCreateState } from './store/slices/createListingSlice';

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
      { path: "listing/:id", element: <SingleListing /> },
      { path: "createlisting", element: <CreateListing /> },
    ],
  },
  {
    path: "*", element: <NotFound />
  }
]);

function App() {
  const dispatch = useDispatch();
  const { loading, token, user } = useSelector((state) => state.auth);
  const { uploading, success } = useSelector(state => state.createListing);

  useEffect(() => {
    if (token && !user) {
      dispatch(getProfile());
    }
  }, [dispatch, token, user]);

  useEffect(() => {
    if (success) {
      dispatch(fetchListings(1)); // Global fetch on success
      dispatch(resetCreateState()); // Reset state
    }
  }, [success, dispatch]);

  return (
    <>
      {/* Spinner as a fixed overlay so Router never unmounts */}
      {loading && token && !user && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-50">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
        </div>
      )}
      {uploading && <Toaster message="Uploading your magic spot... 🚀" />}

      <RouterProvider router={router} />
    </>
  );
}

export default App;