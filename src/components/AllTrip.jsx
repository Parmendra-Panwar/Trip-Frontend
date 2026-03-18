import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchTrips } from '../store/slices/tripSlice';
import TripCard from './TripCard';
import Toaster from './Toaster';

const AllTrip = () => {
    const dispatch = useDispatch();

    const { items = [], loading, hasNextPage } = useSelector(state => state.trips || {});

    const [showFallback, setShowFallback] = useState(false);

    const dummyTrips = [
        {
            _id: "dummy1",
            title: "Weekend Backpacking in the Himalayas",
            location: "Himachal",
            tags: ["mountains", "friends", "trekking"],
            images: [{ url: "https://images.unsplash.com/photo-1522083165195-3424ed129620?auto=format&fit=crop&w=800&q=60" }]
        },
        {
            _id: "dummy2",
            title: "Road trip along the coast",
            location: "Goa to Gokarna",
            tags: ["roadtrip", "beaches", "friends"],
            images: [{ url: "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=800&q=60" }]
        },
        {
            _id: "dummy3",
            title: "Desert Camping Getaway",
            location: "Jaisalmer",
            tags: ["camping", "desert", "stars"],
            images: [{ url: "https://images.unsplash.com/photo-1536411986927-5c5fbaab6aeb?auto=format&fit=crop&w=800&q=60" }]
        },
        {
            _id: "dummy4",
            title: "Spiritual journey in Varanasi",
            location: "Varanasi",
            tags: ["spiritual", "ganges", "culture"],
            images: [{ url: "https://images.unsplash.com/photo-1544287757-a8ab80d90b60?auto=format&fit=crop&w=800&q=60" }]
        },
    ];

    useEffect(() => {
        let isMounted = true;
        let retryInterval;

        const fallbackTimer = setTimeout(() => {
            if (isMounted) setShowFallback(true);
        }, 2000);

        const attemptFetch = () => {
            if (!isMounted) return;

            dispatch(fetchTrips('')).then((result) => {
                if (!isMounted) return;
                if (result.meta?.requestStatus === 'rejected') {
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

    const handleLoadMore = () => {
        const lastId = items[items.length - 1]?._id;

        if (lastId && !loading) {
            dispatch(fetchTrips(lastId))
                .catch((err) => console.error("Pagination Error:", err));
        }
    };

    const shouldShowToaster = items.length === 0 && showFallback;

    return (
        <div className="w-full">
            {shouldShowToaster && (
                <Toaster message="Backend is waking up, showing preview..." />
            )}

            <div>
                <h2 className="text-[26px] font-[600] text-[#222222] tracking-tight mb-6 border-t border-[#EBEBEB] pt-12">
                    {items.length > 0 ? "Shared Trips & Journeys" : "Featured Trips"}
                </h2>

                {items.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-12">
                        {items.map(item => <TripCard key={item._id} data={item} />)}
                    </div>
                ) : showFallback ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-12 opacity-80">
                        {dummyTrips.map(item => <TripCard key={item._id} data={item} />)}
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center py-[100px] bg-[#F7F7F7] rounded-[1.5rem] my-4">
                        <div className="w-[40px] h-[40px] border-[3px] border-[#EBEBEB] border-t-[#222222] rounded-full animate-spin mb-6"></div>
                        <p className="text-[#222222] font-[500] text-[15px] tracking-tight">Loading epic journeys...</p>
                    </div>
                )}

                {items.length > 0 && hasNextPage && (
                    <div className="mt-12 flex justify-center">
                        <button
                            disabled={loading}
                            onClick={handleLoadMore}
                            className="px-6 py-3.5 bg-[#222222] text-white rounded-[10px] text-[15px] font-[600] transition-transform hover:bg-black active:scale-95 disabled:opacity-50"
                        >
                            {loading ? "Loading..." : "Load More Trips"}
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AllTrip;
