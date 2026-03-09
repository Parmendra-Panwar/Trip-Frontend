import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchListings } from '../store/slices/listingSlice'; // Future thunk
import ListingCard from '../components/ListingCard';
import Toaster from '../components/Toaster';

const Home = () => {
    const dispatch = useDispatch();
    const { items = [], loading, pagination } = useSelector(state => state.listings || {});

    const dummyListings = [
        { id: 1, title: "Manali Wooden Cottage", price: 2500, location: "Himachal", image: "https://images.unsplash.com/photo-1518780664697-55e3ad937233" },
        { id: 2, title: "Goa Beach Villa", price: 5000, location: "North Goa", image: "https://images.unsplash.com/photo-1499793983690-e29da59ef1c2" },
        { id: 3, title: "Jaipur Heritage Stay", price: 3200, location: "Rajasthan", image: "https://www.jaipurtravel.com/images/umaid-bhawan.jpg" },
        { id: 4, title: "Kerala Backwaters House", price: 4500, location: "Alleppey", image: "https://images.unsplash.com/photo-1593693397690-362cb9666fc2" },
    ];

    useEffect(() => {
        let interval;

        const attemptFetch = () => {
            dispatch(fetchListings(1)).then((result) => {
                // Agar data nahi mila (backend sleeping), toh 5 sec baad fir try karo
                if (result.meta.requestStatus === 'rejected') {
                    interval = setTimeout(attemptFetch, 5000);
                }
            });
        };

        if (items.length === 0) {
            attemptFetch();
        }

        return () => clearTimeout(interval); // Cleanup on unmount
    }, [dispatch]);

    const handleLoadMore = () => {
        if (pagination.currentPage < pagination.totalPages) {
            dispatch(fetchListings(pagination.currentPage + 1));
        }
    };

    // Agar real data (items) hai toh wo dikhao, varna dummy
    const displayData = items && items.length > 0 ? items : dummyListings;

    return (
        <div className="space-y-8 pb-10">
            {loading && items.length === 0 && <Toaster message="Backend is loading real data..." />}
            {/* Hero Section */}
            <section className="relative h-[400px] rounded-3xl overflow-hidden flex items-center justify-center">
                <img
                    src="https://images.unsplash.com/photo-1469474968028-56623f02e42e"
                    className="absolute inset-0 w-full h-full object-cover brightness-50"
                    alt="Travel"
                />
                <div className="relative text-center text-white px-4">
                    <h1 className="text-4xl md:text-6xl font-black mb-4 tracking-tight">Find Your Next Adventure.</h1>
                    <p className="text-lg md:text-xl opacity-90 mb-8 font-medium">Explore the best stays and trips curated for you.</p>

                    {/* Search Bar */}
                    <div className="bg-white p-2 rounded-full flex items-center max-w-2xl mx-auto shadow-2xl">
                        <input
                            type="text"
                            placeholder="Search destinations..."
                            className="flex-1 px-6 py-2 text-slate-800 outline-none rounded-full"
                        />
                        <button className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-full font-bold transition-all">
                            Search
                        </button>
                    </div>
                </div>
            </section>

            {/* Grid Section */}
            <div>
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-slate-800">
                        {items.length > 0 ? "Trending Destinations" : "Featured Preview"}
                    </h2>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {displayData.map(item => (
                        <ListingCard key={item._id || item.id} data={item} />
                    ))}
                </div>

                {/* Pagination Controls */}
                {items.length > 0 && pagination?.currentPage < pagination?.totalPages && (
                    <div className="mt-12 flex justify-center">
                        <button
                            disabled={loading}
                            onClick={handleLoadMore}
                            className="px-8 py-3 bg-slate-900 text-white rounded-full disabled:opacity-50 hover:bg-slate-800 transition-all font-bold shadow-lg flex items-center gap-2"
                        >
                            {loading ? (
                                <>
                                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                    Loading...
                                </>
                            ) : (
                                "Load More Destinations"
                            )}
                        </button>
                    </div>
                )}

                {/* Agar saara data load ho gaya toh ek sweet message */}
                {items.length > 0 && pagination?.currentPage === pagination?.totalPages && (
                    <p className="text-center text-slate-500 mt-12 font-medium">
                        You've seen all our destinations! 🌍
                    </p>
                )}
            </div>
        </div>
    );
};

export default Home;