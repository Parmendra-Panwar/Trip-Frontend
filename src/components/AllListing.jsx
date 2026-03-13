import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchListings, resetPagination } from '../store/slices/listingSlice';
import ListingCard from '../components/ListingCard';
import Toaster from '../components/Toaster';

const AllListing = () => {
    const dispatch = useDispatch();
    const { items = [], loading, pagination } = useSelector(state => state.listings || {});

    const [localListings, setLocalListings] = useState([]);
    const [showFallback, setShowFallback] = useState(false); // 2 sec baad true hoga

    const dummyListings = [
        {
            id: 1,
            title: "Manali Wooden Cottage",
            price: 2500,
            location: "Himachal",
            images: [{ url: "https://images.unsplash.com/photo-1518780664697-55e3ad937233?auto=format&fit=crop&w=800&q=60" }]
        },
        {
            id: 2,
            title: "Goa Beach Villa",
            price: 5000,
            location: "North Goa",
            images: [{ url: "https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?auto=format&fit=crop&w=800&q=60" }]
        },
        {
            id: 3,
            title: "Jaipur Heritage Stay",
            price: 3200,
            location: "Rajasthan",
            images: [{ url: "https://images.unsplash.com/photo-1590050752117-23a9d7fc9ba1?auto=format&fit=crop&w=800&q=60" }]
        },
        {
            id: 4,
            title: "Kerala Backwaters House",
            price: 4500,
            location: "Alleppey",
            images: [{ url: "https://images.unsplash.com/photo-1593693397690-362cb9666fc2?auto=format&fit=crop&w=800&q=60" }]
        },
    ];

    useEffect(() => {
        let isMounted = true;
        let interval;

        // Start 2-second timer for fallback
        const fallbackTimer = setTimeout(() => {
            if (isMounted) setShowFallback(true);
        }, 2000);

        const attemptFetch = () => {
            if (!isMounted) return;
            dispatch(fetchListings(1)).then((result) => {
                if (!isMounted) return;
                if (result.meta.requestStatus === 'rejected') {
                    interval = setTimeout(attemptFetch, 5000);
                }
            });
        };

        if (items.length === 0) attemptFetch();

        return () => {
            isMounted = false;
            clearTimeout(interval);
            clearTimeout(fallbackTimer); // Cleanup timer
            dispatch(resetPagination());
        };
    }, [dispatch]);

    useEffect(() => {
        // Agar page 1 ka data (new load ya background refresh) aaya hai, toh reset kardo
        if (pagination.currentPage === 1 && items.length > 0) {
            setLocalListings(items);
        }
    }, [items, pagination.currentPage]);

    const handleLoadMore = () => {
        if (pagination.currentPage < pagination.totalPages) {
            dispatch(fetchListings(pagination.currentPage + 1))
                .unwrap()
                .then((payload) => setLocalListings(prev => [...prev, ...payload.listings]))
                .catch((err) => console.error(err));
        }
    };

    // UI State Logic
    const isFetchingInitialData = loading && localListings.length === 0

    return (
        <div className="space-y-8 pb-10">
            {/* Show Toaster only after 2 seconds AND if backend is still loading */}
            {isFetchingInitialData && showFallback && (
                <Toaster message="Backend is waking up, showing preview..." />
            )}

            {/* Grid Section */}
            <div>
                <h2 className="text-2xl font-bold text-slate-800 mb-6">
                    {localListings.length > 0 ? "Trending Destinations" : "Featured Preview"}
                </h2>

                {/* LOGIC: 
                    1. Agar data hai, toh data dikhao.
                    2. Agar data nahi hai aur 2 sec beet gaye, toh dummy dikhao.
                    3. Agar 2 sec se kam hue hain, toh bada spinner dikhao.
                */}
                {localListings.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                        {localListings.map(item => <ListingCard key={item._id} data={item} />)}
                    </div>
                ) : showFallback ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                        {dummyListings.map(item => <ListingCard key={item.id} data={item} />)}
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center py-20">
                        <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mb-4"></div>
                        <p className="text-slate-500 font-medium">Fetching best deals for you...</p>
                    </div>
                )}

                {/* Load More */}
                {localListings.length > 0 && pagination?.currentPage < pagination?.totalPages && (
                    <div className="mt-12 flex justify-center">
                        <button disabled={loading} onClick={handleLoadMore} className="px-8 py-3 bg-slate-900 text-white rounded-full font-bold shadow-lg">
                            {loading ? "Loading..." : "Load More Destinations"}
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AllListing;