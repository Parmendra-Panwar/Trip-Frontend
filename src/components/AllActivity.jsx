import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchActivities } from '../store/slices/activitySlice';
import ActivityCard from '../components/ActivityCard';
import Toaster from '../components/Toaster';

const AllActivity = () => {
    const dispatch = useDispatch();

    const { items = [], loading, hasNextPage } = useSelector(state => state.activities || {});

    const [showFallback, setShowFallback] = useState(false);

    const dummyActivities = [
        {
            _id: "dummy1",
            title: "Himalayan Trekking",
            price: 5500,
            location: "Himachal",
            country: "India",
            duration: "3 days",
            difficulty: "Hard",
            images: [{ url: "https://images.unsplash.com/photo-1551632811-561f32a74c0c?auto=format&fit=crop&w=800&q=60" }]
        },
        {
            _id: "dummy2",
            title: "Scuba Diving in Andaman",
            price: 8000,
            location: "Andaman",
            country: "India",
            duration: "4 hours",
            difficulty: "Moderate",
            images: [{ url: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=800&q=60" }]
        },
        {
            _id: "dummy3",
            title: "Desert Safari",
            price: 3200,
            location: "Rajasthan",
            country: "India",
            duration: "6 hours",
            difficulty: "Easy",
            images: [{ url: "https://images.unsplash.com/photo-1536411986927-5c5fbaab6aeb?auto=format&fit=crop&w=800&q=60" }]
        },
        {
            _id: "dummy4",
            title: "River Rafting",
            price: 1500,
            location: "Rishikesh",
            country: "India",
            duration: "2 hours",
            difficulty: "High-Risk",
            images: [{ url: "https://images.unsplash.com/photo-1534149957077-03b070440268?auto=format&fit=crop&w=800&q=60" }]
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

            dispatch(fetchActivities('')).then((result) => {
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
            dispatch(fetchActivities(lastId))
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
                    {items.length > 0 ? "Trending Activities" : "Featured Activities"}
                </h2>

                {items.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-12">
                        {items.map(item => <ActivityCard key={item._id} data={item} />)}
                    </div>
                ) : showFallback ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-12 opacity-80">
                        {dummyActivities.map(item => <ActivityCard key={item._id} data={item} />)}
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center py-[100px] bg-[#F7F7F7] rounded-[1.5rem] my-4">
                        <div className="w-[40px] h-[40px] border-[3px] border-[#EBEBEB] border-t-[#222222] rounded-full animate-spin mb-6"></div>
                        <p className="text-[#222222] font-[500] text-[15px] tracking-tight">Finding the best activities for you...</p>
                    </div>
                )}

                {items.length > 0 && hasNextPage && (
                    <div className="mt-12 flex justify-center">
                        <button
                            disabled={loading}
                            onClick={handleLoadMore}
                            className="px-6 py-3.5 bg-[#222222] text-white rounded-[10px] text-[15px] font-[600] transition-transform hover:bg-black active:scale-95 disabled:opacity-50"
                        >
                            {loading ? "Loading..." : "Load More Activities"}
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AllActivity;
