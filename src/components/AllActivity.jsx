import { useEffect, useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchActivities } from '../store/slices/activitySlice';
import { fetchActivitiesApi } from '../services/activityService';
import ActivityCard from '../components/ActivityCard';
import { useToast } from '../hooks/useToast';

const AllActivity = () => {
    const dispatch = useDispatch();
    const toast = useToast();
    const fallbackToastShown = useRef(false);

    const { items: reduxItems = [], loading: reduxLoading, hasNextPage: reduxHasNextPage } = useSelector(state => state.activities || {});

    const [extraItems, setExtraItems] = useState([]);
    const [localHasNextPage, setLocalHasNextPage] = useState(null);
    const [loadingMore, setLoadingMore] = useState(false);
    const [showFallback, setShowFallback] = useState(false);

    const allItems = [...reduxItems, ...extraItems];
    const finalHasNextPage = localHasNextPage !== null ? localHasNextPage : reduxHasNextPage;

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
        let pollInterval;
        let retryCount = 1;
        let fallbackTimer;

        // Helper to handle individual fetch attempts
        const attemptFetch = async (isRetry, count) => {
            if (!isMounted) return false;

            // Show toast only during retry phase
            if (isRetry) {
                toast.info(`Backend is waking up, showing preview... (Attempt ${count}/5)`);
            }

            const result = await dispatch(fetchActivities(''));

            if (result.meta?.requestStatus === 'fulfilled') {
                setShowFallback(false);
                if (pollInterval) clearInterval(pollInterval);
                if (fallbackTimer) clearTimeout(fallbackTimer);
                return true;
            }
            return false;
        };

        // 1. Immediate API Hit (0s mark)
        // This allows the server to start responding while the loader is active
        attemptFetch(false, 0);

        // 2. Initial Loading Phase (Wait 5 seconds)
        fallbackTimer = setTimeout(async () => {
            // If data already loaded or component unmounted, do nothing
            if (!isMounted || reduxItems.length > 0) return;

            // Switch from Loader to Dummy/Fallback UI
            setShowFallback(true);

            // Start Retries: First retry happens exactly at the 5s mark
            const success = await attemptFetch(true, retryCount);
            if (success) return;

            // 3. Subsequent Retries (Attempt 2-5 every 5 seconds)
            pollInterval = setInterval(async () => {
                if (!isMounted) return;
                retryCount++;

                if (retryCount <= 5) {
                    const ok = await attemptFetch(true, retryCount);
                    if (ok) clearInterval(pollInterval);
                } else {
                    // Final failure after all attempts
                    clearInterval(pollInterval);
                    toast.dismiss();
                    toast.error("Sorry for the server issue. Please try again later or contact panwparmendra7@gmail.com");
                }
            }, 5000);
        }, 5000);

        return () => {
            isMounted = false;
            clearTimeout(fallbackTimer);
            if (pollInterval) clearInterval(pollInterval);
        };
    }, [dispatch]);

    const handleLoadMore = async () => {
        const lastId = allItems[allItems.length - 1]?._id;

        if (lastId && !loadingMore) {
            setLoadingMore(true);
            try {
                const response = await fetchActivitiesApi(lastId);
                const fetchedItems = response.data?.activities || response.data || [];

                setExtraItems(prev => [...prev, ...fetchedItems]);
                setLocalHasNextPage(response.data?.hasNextPage || false);
            } catch (err) {
                console.error("Pagination Error:", err);
            } finally {
                setLoadingMore(false);
            }
        }
    };

    return (
        <div className="w-full">
            <div>
                <h2 className="text-[26px] font-[600] text-[#222222] tracking-tight mb-6 border-t border-[#EBEBEB] pt-12">
                    {allItems.length > 0 ? "Trending Activities" : "Featured Activities"}
                </h2>

                {allItems.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-12">
                        {allItems.map(item => <ActivityCard key={item._id} data={item} />)}
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

                {allItems.length > 0 && finalHasNextPage && (
                    <div className="mt-12 flex justify-center">
                        <button
                            disabled={loadingMore}
                            onClick={handleLoadMore}
                            className="px-6 py-3.5 bg-[#222222] text-white rounded-[10px] text-[15px] font-[600] transition-transform hover:bg-black active:scale-95 disabled:opacity-50"
                        >
                            {loadingMore ? "Loading..." : "Load More Activities"}
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AllActivity;
