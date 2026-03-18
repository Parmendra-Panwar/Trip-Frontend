import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchListings } from '../store/slices/listingSlice';
import ListingCard from '../components/ListingCard';
import Toaster from '../components/Toaster';

const AllListing = () => {
    const dispatch = useDispatch();

    // Redux selectors
    const { items = [], loading, hasNextPage } = useSelector(state => state.listings || {});

    // Local states
    const [showFallback, setShowFallback] = useState(false);

    const dummyListings = [
        {
            _id: "dummy1",
            title: "Manali Wooden Cottage",
            price: 2500,
            location: "Himachal",
            images: [{ url: "https://images.unsplash.com/photo-1518780664697-55e3ad937233?auto=format&fit=crop&w=800&q=60" }]
        },
        {
            _id: "dummy2",
            title: "Goa Beach Villa",
            price: 5000,
            location: "North Goa",
            images: [{ url: "https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?auto=format&fit=crop&w=800&q=60" }]
        },
        {
            _id: "dummy3",
            title: "Jaipur Heritage Stay",
            price: 3200,
            location: "Rajasthan",
            images: [{ url: "https://images.unsplash.com/photo-1590050752117-23a9d7fc9ba1?auto=format&fit=crop&w=800&q=60" }]
        },
        {
            _id: "dummy4",
            title: "Kerala Backwaters House",
            price: 4500,
            location: "Alleppey",
            images: [{ url: "https://images.unsplash.com/photo-1593693397690-362cb9666fc2?auto=format&fit=crop&w=800&q=60" }]
        },
    ];

    // 1. Initial Fetch and Fallback Timer
    useEffect(() => {
        let isMounted = true;
        let retryInterval;

        const fallbackTimer = setTimeout(() => {
            if (isMounted) setShowFallback(true);
        }, 2000);

        const attemptFetch = () => {
            if (!isMounted) return;

            dispatch(fetchListings('')).then((result) => {
                if (!isMounted) return;
                // Agar request reject hui, toh 5 sec baad retry karo
                if (result.meta.requestStatus === 'rejected') {
                    retryInterval = setTimeout(attemptFetch, 5000);
                }
            });
        };

        if (items.length === 0) attemptFetch();

        return () => {
            isMounted = false;
            clearTimeout(retryInterval);
            clearTimeout(fallbackTimer);
        };
    }, [dispatch]);

    // 2. Local state sync removed - using Redux state directly

    // 3. Load More logic (Cursor-based)
    const handleLoadMore = () => {
        const lastId = items[items.length - 1]?._id;

        if (lastId && !loading) {
            dispatch(fetchListings(lastId))
                .catch((err) => console.error("Pagination Error:", err));
        }
    };

    /**
     * TOASTER LOGIC FIX:
     * Hum loading state ko condition se hata rahe hain. 
     * Jab tak localListings khali hain aur 2 sec beet chuke hain, 
     * tab tak toaster permanent dikhega (chahe loading true ho ya retry wait mein false).
     */
    const shouldShowToaster = items.length === 0 && showFallback;

    return (
        <div className="space-y-8 pb-10">
            {/* Permanent Toaster during fallback state */}
            {shouldShowToaster && (
                <Toaster message="Backend is waking up, showing preview..." />
            )}

            <div>
                <h2 className="text-2xl font-bold text-slate-800 mb-6">
                    {items.length > 0 ? "Trending Destinations" : "Featured Preview"}
                </h2>

                {/* Grid logic: Real Data -> Dummy Data -> Spinner */}
                {items.length > 0 ? (
                    // 1. Real data from backend
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                        {items.map(item => <ListingCard key={item._id} data={item} />)}
                    </div>
                ) : showFallback ? (
                    // 2. Server taking time/failed: show Dummy
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 opacity-70">
                        {dummyListings.map(item => <ListingCard key={item._id} data={item} />)}
                    </div>
                ) : (
                    // 3. Initial 2 seconds: show Spinner
                    <div className="flex flex-col items-center justify-center py-20">
                        <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mb-4"></div>
                        <p className="text-slate-500 font-medium">Finding the best stays for you...</p>
                    </div>
                )}

                {/* Load More Button */}
                {items.length > 0 && hasNextPage && (
                    <div className="mt-12 flex justify-center">
                        <button
                            disabled={loading}
                            onClick={handleLoadMore}
                            className="px-8 py-3 bg-slate-900 text-white rounded-full font-bold shadow-lg transition-transform hover:scale-105 active:scale-95 disabled:opacity-50"
                        >
                            {loading ? "Loading..." : "Load More Destinations"}
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AllListing;