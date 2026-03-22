import { useParams, useNavigate } from 'react-router-dom';
import { useState, useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { deleteTripApi, fetchTripById } from '../services/tripService';
import { removeTrip } from '../store/slices/tripSlicee';

import ImageModal from '../components/ImageModal';
import ReviewSection from '../components/ReviewSection';

const SingleTrip = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const { user: currentUser } = useSelector((state) => state.auth);

    const [tripResponse, setTripResponse] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedImgIndex, setSelectedImgIndex] = useState(0);
    const [showMenu, setShowMenu] = useState(false);
    const menuRef = useRef();

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (menuRef.current && !menuRef.current.contains(event.target)) setShowMenu(false);
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    useEffect(() => {
        const loadData = async () => {
            try {
                setLoading(true);
                const response = await fetchTripById(id);
                setTripResponse(response.data);
            } catch (err) {
                setError(err.message || "Something went wrong");
            } finally {
                setLoading(false);
            }
        };
        if (id) loadData();
    }, [id]);

    const handleDelete = () => {
        if (window.confirm("Are you sure Want to delete this trip?")) {
            setLoading(true);
            navigate('/');

            deleteTripApi(id)
                .then(() => {
                    dispatch(removeTrip(id));
                })
                .catch((error) => {
                    console.error("Delete failed!", error);
                });
        }
    };

    const openModal = (index) => {
        setSelectedImgIndex(index);
        setIsModalOpen(true);
    };

    if (loading) return <div className="flex justify-center mt-20"><div className="animate-spin rounded-full h-10 w-10 border-b-2 border-slate-900"></div></div>;
    if (error) return <div className="text-center mt-20 text-red-500 font-bold">{error}</div>;

    const data = tripResponse?.trip || tripResponse;
    const isOwner = currentUser && data?.user && currentUser.username === data.user.username;
    const displayTags = data?.tags?.length > 0 ? data.tags : ["trip", "nature", "memories"];

    return (
        <div className="relative bg-slate-50 min-h-screen">

            {isModalOpen && data?.images && (
                <ImageModal
                    images={data.images}
                    currentIndex={selectedImgIndex}
                    setCurrentIndex={setSelectedImgIndex}
                    onClose={() => setIsModalOpen(false)}
                />
            )}

            <div className="max-w-4xl mx-auto md:px-8 py-8">

                {/* Minimalist Header for Trip */}
                <div className="flex justify-between items-start mb-6 px-4 md:px-0 relative">
                    <div>
                        <div className="flex items-center gap-3 mb-3">
                            <span className="bg-indigo-100 text-indigo-700 px-3 py-1 text-[10px] uppercase font-black tracking-widest rounded-full">TRIP RECAP</span>
                            <span className="text-xs text-slate-400 font-bold uppercase tracking-wider">{new Date(data?.createdAt || Date.now()).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</span>
                        </div>
                        <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-900 mb-2 leading-tight">{data?.title}</h1>
                    </div>

                    {isOwner && (
                        <div className="relative z-10" ref={menuRef}>
                            <button onClick={() => setShowMenu(!showMenu)} className="p-2 hover:bg-slate-200 rounded-full transition bg-white shadow-sm border border-slate-200">
                                <svg className="w-6 h-6 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"></path></svg>
                            </button>

                            {showMenu && (
                                <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-slate-100 overflow-hidden">
                                    <button onClick={() => navigate(`/edit-trip/${id}`)} className="w-full text-left px-4 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50 border-b">
                                        Edit Trip
                                    </button>
                                    <button onClick={handleDelete} className="w-full text-left px-4 py-3 text-sm font-semibold text-rose-600 hover:bg-rose-50">
                                        Delete Trip
                                    </button>
                                </div>
                            )}
                        </div>
                    )}
                </div>

                {/* 2. Image Gallery - Journal Style */}
                <div className="md:rounded-[2rem] overflow-hidden mb-8 border border-slate-200 shadow-sm bg-white">
                    {data?.images?.length > 0 ? (
                        <div className={`grid ${data.images.length === 1 ? 'grid-cols-1 h-[400px]' : data.images.length === 2 ? 'grid-cols-2 h-[400px]' : 'grid-cols-1 md:grid-cols-2 h-[500px]'} gap-1 bg-slate-100`}>
                            {/* Main large image */}
                            <div className="h-full cursor-pointer group relative" onClick={() => openModal(0)}>
                                <img src={data.images[0].url} className="w-full h-full object-cover group-hover:scale-105 transition duration-700" alt="Main" />
                            </div>

                            {/* Additional images if any */}
                            {data.images.length > 1 && (
                                <div className={`hidden md:grid gap-1 h-full ${data.images.length >= 3 ? 'grid-rows-2' : ''}`}>
                                    <div className="cursor-pointer overflow-hidden group relative" onClick={() => openModal(1)}>
                                        <img src={data.images[1].url} className="w-full h-full object-cover group-hover:scale-105 transition duration-700" alt="Secondary 1" />
                                    </div>
                                    {data.images.length >= 3 && (
                                        <div className="cursor-pointer overflow-hidden group relative" onClick={() => openModal(2)}>
                                            <img src={data.images[2].url} className="w-full h-full object-cover group-hover:scale-105 transition duration-700" alt="Secondary 2" />
                                            {data.images.length > 3 && (
                                                <div className="absolute inset-0 bg-slate-900/50 flex items-center justify-center font-bold text-white text-2xl backdrop-blur-sm">
                                                    +{data.images.length - 3}
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className="h-[300px] flex justify-center items-center bg-slate-100">
                            <div className="flex flex-col items-center justify-center h-full text-slate-400">
                                <svg className="w-16 h-16 mb-2 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                                <span className="font-bold">No Memories Available</span>
                            </div>
                        </div>
                    )}

                    {/* Location Tag */}
                    <div className="bg-white p-4 border-t border-slate-100 flex items-center justify-center text-slate-600 font-semibold gap-2">
                        <svg className="w-5 h-5 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
                        {data?.location || "Unknown Location"}
                    </div>
                </div>

                {/* 3. Main Content Wrapper */}
                <div className="bg-white md:rounded-3xl shadow-sm border border-slate-200 p-8 md:p-12 space-y-12">

                    {/* Author Block */}
                    <div className="flex items-center gap-4 pb-8 border-b border-slate-100">
                        <div className="w-16 h-16 rounded-[40%] bg-gradient-to-tr from-indigo-500 to-purple-500 text-white flex items-center justify-center text-2xl font-black shadow-lg shadow-indigo-200">
                            {data?.user?.username?.charAt(0).toUpperCase() || "E"}
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-slate-800">Shared by {data?.user?.username || "Explorer"}</h2>
                            <p className="text-slate-500 text-sm">Fellow Traveler</p>
                        </div>
                    </div>

                    {/* Story / Description */}
                    <div className="space-y-4">
                        <p className="text-slate-700 leading-relaxed text-lg whitespace-pre-line font-serif">{data?.description}</p>
                    </div>

                    {/* Tags */}
                    <div className="flex gap-3 flex-wrap pt-4">
                        {displayTags.map(tag => (
                            <span key={tag} className="px-5 py-2.5 bg-slate-50 border border-slate-200 rounded-full text-sm font-semibold text-slate-600 shadow-sm">
                                #{tag}
                            </span>
                        ))}
                    </div>

                    {/* Reviews */}
                    <div className="border-t border-slate-100 pt-10">
                        <ReviewSection reviews={data?.reviews} entityType="trips" entityId={id} />
                    </div>
                </div>

            </div>
        </div>
    );
};

export default SingleTrip;
