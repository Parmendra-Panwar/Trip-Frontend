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
import EditListing from './pages/EditListing';

import SingleActivity from './pages/SingleActivity';
import CreateActivity from './pages/CreateActivity';
import EditActivity from './pages/EditActivity';

import SingleTrip from './pages/SingleTrip';
import CreateTrip from './pages/CreateTrip';
import EditTrip from './pages/EditTrip';

import Toaster from './components/Toaster';

import { fetchListings } from './store/slices/listingSlice';
import { resetCreateState } from './store/slices/createListingSlice';
import { fetchActivities } from './store/slices/activitySlice';
import { resetCreateActivityState } from './store/slices/createActivitySlice';
import { fetchTrips } from './store/slices/tripSlice';
import { resetCreateTripState } from './store/slices/createTripSlice';
import ProfilePage from './pages/ProfilePage';
import Activities from './pages/Activities';
import Listings from './pages/Listings';
import Trips from './pages/Trips';

const Layout = () => (
  <div className="min-h-[100dvh] bg-slate-50 flex flex-col">
    <Navbar />
    <main className="flex-1 w-full flex flex-col pt-1">
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

      { path: "activities", element: <Activities /> },
      { path: "listings", element: <Listings /> },
      { path: "trips", element: <Trips /> },

      { path: "listing/:id", element: <SingleListing /> },
      { path: "createlisting", element: <CreateListing /> },
      { path: "edit-listing/:id", element: <EditListing /> },

      { path: "activity/:id", element: <SingleActivity /> },
      { path: "createactivity", element: <CreateActivity /> },
      { path: "edit-activity/:id", element: <EditActivity /> },

      { path: "trip/:id", element: <SingleTrip /> },
      { path: "createtrip", element: <CreateTrip /> },
      { path: "edit-trip/:id", element: <EditTrip /> },

      { path: "profile/:username", element: <ProfilePage /> },
    ],
  },
  {
    path: "*", element: <NotFound />
  }
]);

function App() {
  const dispatch = useDispatch();
  const { loading, token, user } = useSelector((state) => state.auth);
  const { uploading: listingUploading, success: listingSuccess } = useSelector(state => state.createListing);
  const { uploading: activityUploading, success: activitySuccess } = useSelector(state => state.createActivity);
  const { uploading: tripUploading, success: tripSuccess } = useSelector(state => state.createTrip);

  useEffect(() => {
    if (token && !user) {
      dispatch(getProfile());
    }
  }, [dispatch, token, user]);

  useEffect(() => {
    if (listingSuccess) {
      dispatch(fetchListings(''));
      dispatch(resetCreateState());
    }
    if (activitySuccess) {
      dispatch(fetchActivities(''));
      dispatch(resetCreateActivityState());
    }
    if (tripSuccess) {
      dispatch(fetchTrips(''));
      dispatch(resetCreateTripState());
    }
  }, [listingSuccess, activitySuccess, tripSuccess, dispatch]);

  return (
    <>
      {/* Spinner as a fixed overlay so Router never unmounts */}
      {loading && token && !user && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-50">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
        </div>
      )}
      {(listingUploading || activityUploading || tripUploading) && <Toaster message="Uploading your memory... 🚀" />}

      <RouterProvider router={router} />
    </>
  );
}

export default App;