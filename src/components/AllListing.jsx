import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchListings } from '../store/slices/listingSlice';
import { fetchListingsApi } from '../services/listingService';
import ListingCard from '../components/ListingCard';
import Toaster from '../components/Toaster';

const AllListing = () => {
    const dispatch = useDispatch();

    // Redux selectors (Only stores the first 12 items)
    const { items: reduxItems = [], loading: reduxLoading, hasNextPage: reduxHasNextPage } = useSelector(state => state.listings || {});

    // Local states for pagination and fallbacks
    const [extraItems, setExtraItems] = useState([]);
    const [localHasNextPage, setLocalHasNextPage] = useState(null);
    const [loadingMore, setLoadingMore] = useState(false);
    const [showFallback, setShowFallback] = useState(false);

    const allItems = [...reduxItems, ...extraItems];
    const finalHasNextPage = localHasNextPage !== null ? localHasNextPage : reduxHasNextPage;

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

            // Fetch only the first page via Redux
            dispatch(fetchListings('')).then((result) => {
                if (!isMounted) return;
                if (result.meta?.requestStatus === 'rejected') {
                    retryInterval = setTimeout(attemptFetch, 5000);
                }
            });
        };

        if (reduxItems.length === 0) attemptFetch();

        return () => {
            isMounted = false;
            clearTimeout(retryInterval);
            clearTimeout(fallbackTimer);
        };
    }, [dispatch]);

    // 2. Load More logic (Stored strictly in RAM locally, not Redux)
    const handleLoadMore = async () => {
        const lastId = allItems[allItems.length - 1]?._id;

        if (lastId && !loadingMore) {
            setLoadingMore(true);
            try {
                const response = await fetchListingsApi(lastId);
                const fetchedItems = response.data?.listings || response.data || [];
                
                // Keep RAM efficient: Append to local memory only
                setExtraItems(prev => [...prev, ...fetchedItems]);
                setLocalHasNextPage(response.data?.hasNextPage || false);
            } catch (err) {
                console.error("Pagination Error:", err);
            } finally {
                setLoadingMore(false);
            }
        }
    };

    const shouldShowToaster = reduxItems.length === 0 && showFallback;

    return (
        <div className="w-full">
            {shouldShowToaster && (
                <Toaster message="Backend is waking up, showing preview..." />
            )}

            <div>
                <h2 className="text-[26px] font-[600] text-[#222222] tracking-tight mb-6 mt-6">
                    {allItems.length > 0 ? "Trending Destinations" : "Featured Preview"}
                </h2>

                {/* Grid logic: Real Data -> Dummy Data -> Spinner */}
                {allItems.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-12">
                        {allItems.map(item => <ListingCard key={item._id} data={item} />)}
                    </div>
                ) : showFallback ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-12 opacity-80">
                        {dummyListings.map(item => <ListingCard key={item._id} data={item} />)}
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center py-[100px] bg-[#F7F7F7] rounded-[1.5rem] my-4">
                        <div className="w-[40px] h-[40px] border-[3px] border-[#EBEBEB] border-t-[#222222] rounded-full animate-spin mb-6"></div>
                        <p className="text-[#222222] font-[500] text-[15px] tracking-tight">Finding the best stays for you...</p>
                    </div>
                )}

                {/* Load More Button */}
                {allItems.length > 0 && finalHasNextPage && (
                    <div className="mt-12 flex justify-center">
                        <button
                            disabled={loadingMore}
                            onClick={handleLoadMore}
                            className="px-6 py-3.5 bg-[#222222] text-white rounded-[10px] text-[15px] font-[600] transition-transform hover:bg-black active:scale-95 disabled:opacity-50"
                        >
                            {loadingMore ? "Loading..." : "Load More Destinations"}
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AllListing;