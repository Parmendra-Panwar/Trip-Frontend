import { useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { fetchListingById } from '../services/listingService';
import ImageModal from '../components/ImageModal';

const SingleListing = () => {
    const { id } = useParams();
    const [listing, setListing] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedImgIndex, setSelectedImgIndex] = useState(0);

    const openModal = (index) => {
        setSelectedImgIndex(index);
        setIsModalOpen(true);
    };

    useEffect(() => {
        const loadData = async () => {
            try {
                setLoading(true);
                const response = await fetchListingById(id);
                setListing(response.data);
            } catch (err) {
                setError(err.message || "Something went wrong");
            } finally {
                setLoading(false);
            }
        };

        if (id) loadData();
    }, [id]);

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;

    const data = listing?.listing;

    const displayTags = data?.tags?.length > 0 ? data.tags : ["wifi", "pool", "budget"];

    return (
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-6">
            {/* Modal Component */}
            {isModalOpen && (
                <ImageModal
                    images={data.images}
                    currentIndex={selectedImgIndex}
                    setCurrentIndex={setSelectedImgIndex}
                    onClose={() => setIsModalOpen(false)}
                />
            )}

            {/* 1. Header Section */}
            <div className="mb-6">
                <h1 className="text-3xl font-bold text-slate-900">{data?.title}</h1>
                <p className="text-slate-600 underline font-medium">
                    {data?.location}, {data?.country}
                </p>
            </div>

            {/*2. Image Gallery Fix (Added onClick) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 rounded-3xl overflow-hidden h-[300px] md:h-[500px]">
                <div className="h-full cursor-pointer" onClick={() => openModal(0)}>
                    <img
                        src={data?.images[0]?.url}
                        className="w-full h-full object-cover hover:opacity-90 transition duration-300"
                        alt="Main"
                    />
                </div>

                <div className="hidden md:grid grid-rows-2 gap-4 h-full">
                    {/* Image 2 Click */}
                    <div className="cursor-pointer overflow-hidden" onClick={() => openModal(1)}>
                        <img
                            src={data?.images[1]?.url || data?.images[0]?.url}
                            className="w-full h-full object-cover hover:scale-105 transition duration-300"
                        />
                    </div>
                    {/* Image 3 Click */}
                    <div className="cursor-pointer overflow-hidden" onClick={() => openModal(2)}>
                        <img
                            src={data?.images[2]?.url || data?.images[0]?.url}
                            className="w-full h-full object-cover hover:scale-105 transition duration-300"
                        />
                    </div>
                </div>
            </div>

            {/* 3. Content Section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 mt-10">
                {/* Left Side: Info */}
                <div className="lg:col-span-2 space-y-8">
                    <div className="border-b pb-8">
                        <h2 className="text-2xl font-semibold mb-2">About this {data?.category}</h2>
                        <p className="text-slate-700 leading-relaxed text-lg">{data?.description}</p>
                    </div>

                    {/* Tags */}
                    <div className="flex gap-2 flex-wrap">
                        {displayTags.map(tag => (
                            <span key={tag} className="px-4 py-2 bg-slate-100 rounded-full text-sm font-medium text-slate-600">
                                #{tag}
                            </span>
                        ))}
                    </div>

                    {/* Reviews Section */}
                    <div className="border-t pt-8">
                        <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                            ★ {data?.reviews?.length > 0 ? "5.0" : "New"} · {data?.reviews?.length} Reviews
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {data?.reviews?.map(rev => (
                                <div key={rev._id} className="p-4 border rounded-2xl bg-slate-50">
                                    <p className="font-bold text-slate-800">{rev.author?.username || "Guest User"}</p>
                                    <p className="text-xs text-slate-500 mb-2">{new Date(rev.createdAt).toLocaleDateString()}</p>
                                    <p className="text-slate-600">"{rev.comment}"</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Right Side: Sticky Booking Card */}
                <div className="relative">
                    <div className="sticky top-24 p-6 border rounded-3xl shadow-xl space-y-4 bg-white">
                        <div className="flex justify-between items-center">
                            <p className="text-2xl font-bold">₹{data?.price.toLocaleString('en-IN')} <span className="text-sm font-normal text-slate-500">/ night</span></p>
                        </div>
                        <button className="w-full py-4 bg-rose-600 hover:bg-rose-700 text-white rounded-xl font-bold text-lg transition-all">
                            Reserve Now
                        </button>
                        <p className="text-center text-sm text-slate-500">You won't be charged yet</p>
                    </div>
                </div>
            </div>

            {/* 4. Map Section */}
            <div className="mt-12 border-t pt-10">
                <h3 className="text-2xl font-bold mb-6">Where you'll be</h3>
                <div className="h-[400px] bg-slate-200 rounded-3xl overflow-hidden flex items-center justify-center">
                    {/* Leaflet/Google Map yahan aayega latitude/longitude use karke */}
                    <p className="text-slate-500 italic">Map Component (Lat: {listing?.latitude}, Long: {listing?.longitude})</p>
                </div>
            </div>
        </div>
    );
};

export default SingleListing;