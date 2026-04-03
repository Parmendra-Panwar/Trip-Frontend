import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { createBrowserRouter, RouterProvider, Outlet } from 'react-router-dom';

import Navbar from './components/Navbar';
import ToastContainer from './components/ToastContainer';
import { SpinnerIcon } from './components/icons';

import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import NotFound from './pages/NotFound';

import SingleListing from './pages/SingleListing';
import CreateListing from './pages/CreateListing';
import EditListing from './pages/EditListing';

import SingleActivity from './pages/SingleActivity';
import CreateActivity from './pages/CreateActivity';
import EditActivity from './pages/EditActivity';

import SingleTrip from './pages/SingleTrip';
import CreateTrip from './pages/CreateTrip';
import EditTrip from './pages/EditTrip';

import ProfilePage from './pages/ProfilePage';
import Activities from './pages/Activities';
import Listings from './pages/Listings';
import Trips from './pages/Trips';
import SavedItems from './pages/SavedItems';
import ItineraryForm from './pages/ItineraryForm';
import ItineraryBuilder from './pages/ItineraryBuilder';
import SingleItinerary from './pages/SingleItinerary';

import { getProfile } from './store/slices/authSlice';
import { fetchListings } from './store/slices/listingSlice';
import { resetCreateState } from './store/slices/createListingSlice';
import { fetchActivities } from './store/slices/activitySlice';
import { resetCreateActivityState } from './store/slices/createActivitySlice';
import { fetchTrips } from './store/slices/tripSlice';
import { resetCreateTripState } from './store/slices/createTripSlice';
import { useToast } from './hooks/useToast';

// ─── Layout ──────────────────────────────────────────────────────────────────
const Layout = () => (
  <div className="min-h-[100dvh] bg-slate-50 flex flex-col">
    <Navbar />
    <main className="flex-1 w-full flex flex-col pt-1">
      <Outlet />
    </main>
  </div>
);

// ─── Router ───────────────────────────────────────────────────────────────────
const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      { index: true, element: <Home /> },
      { path: 'login', element: <Login /> },
      { path: 'signup', element: <Signup /> },

      { path: 'activities', element: <Activities /> },
      { path: 'listings', element: <Listings /> },
      { path: 'trips', element: <Trips /> },

      { path: 'listing/:id', element: <SingleListing /> },
      { path: 'createlisting', element: <CreateListing /> },
      { path: 'edit-listing/:id', element: <EditListing /> },

      { path: 'activity/:id', element: <SingleActivity /> },
      { path: 'createactivity', element: <CreateActivity /> },
      { path: 'edit-activity/:id', element: <EditActivity /> },

      { path: 'trip/:id', element: <SingleTrip /> },
      { path: 'createtrip', element: <CreateTrip /> },
      { path: 'edit-trip/:id', element: <EditTrip /> },

      { path: 'profile/:username', element: <ProfilePage /> },
      { path: 'saved', element: <SavedItems /> },

      { path: 'plan-itinerary', element: <ItineraryForm /> },
      { path: 'itinerary-builder', element: <ItineraryBuilder /> },
      { path: 'itinerary/:id', element: <SingleItinerary /> },
    ],
  },
  { path: '*', element: <NotFound /> },
]);

// ─── App ─────────────────────────────────────────────────────────────────────
export default function App() {
  const dispatch = useDispatch();
  const toast = useToast();

  const { token, user, loading: authLoading } = useSelector(s => s.auth);
  const { uploading: listingUploading, success: listingSuccess, error: listingError } = useSelector(s => s.createListing);
  const { uploading: activityUploading, success: activitySuccess, error: activityError } = useSelector(s => s.createActivity);
  const { uploading: tripUploading, success: tripSuccess, error: tripError } = useSelector(s => s.createTrip);

  // ── Auth: fetch profile on cold load when token exists but user isn't loaded
  useEffect(() => {
    if (token && !user) dispatch(getProfile());
  }, [token, user, dispatch]);

  // ── Upload side-effects: ONE effect handles all three create flows
  useEffect(() => {
    if (listingSuccess) {
      toast.success('Listing published successfully!');
      dispatch(fetchListings(''));
      dispatch(resetCreateState());
    } else if (listingError) {
      toast.error(`Listing failed: ${listingError}`);
      dispatch(resetCreateState());
    }
  }, [listingSuccess, listingError]);

  useEffect(() => {
    if (activitySuccess) {
      toast.success('Activity published successfully!');
      dispatch(fetchActivities(''));
      dispatch(resetCreateActivityState());
    } else if (activityError) {
      toast.error(`Activity failed: ${activityError}`);
      dispatch(resetCreateActivityState());
    }
  }, [activitySuccess, activityError]);

  useEffect(() => {
    if (tripSuccess) {
      toast.success('Trip posted successfully!');
      dispatch(fetchTrips(''));
      dispatch(resetCreateTripState());
    } else if (tripError) {
      toast.error(`Trip failed: ${tripError}`);
      dispatch(resetCreateTripState());
    }
  }, [tripSuccess, tripError]);

  const isUploading = listingUploading || activityUploading || tripUploading;

  return (
    <>
      {/* Full-screen auth spinner — only while bootstrapping session */}
      {authLoading && token && !user && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-50">
          <SpinnerIcon className="w-10 h-10 text-blue-600" />
        </div>
      )}

      {/* Background upload indicator — bottom-left, non-blocking */}
      {isUploading && (
        <div className="fixed bottom-6 left-6 z-[9998] flex items-center gap-3 bg-slate-900 border border-slate-700/40 text-white text-sm font-medium px-4 py-3 rounded-2xl shadow-2xl">
          <SpinnerIcon className="w-4 h-4 text-white" />
          Uploading your memory…
        </div>
      )}

      {/* Global toasts — reads from Redux state, no Provider needed */}
      <ToastContainer />

      <RouterProvider router={router} />
    </>
  );
}