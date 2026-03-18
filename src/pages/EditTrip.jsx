import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { fetchTripById, updateTripApi } from '../services/tripService';
import { updateTripLocally } from '../store/slices/tripSlice';
import Toaster from '../components/Toaster';

const EditTrip = () => {
    const { id } = useParams();
    const { user } = useSelector(state => state.auth);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);

    const [formData, setFormData] = useState({
        title: '',
        description: '',
        location: '',
        tags: ''
    });
    
    const [images, setImages] = useState([]);
    const [previews, setPreviews] = useState([]);

    useEffect(() => {
        if (!user) {
            navigate('/login');
            return;
        }

        const fetchTrip = async () => {
            try {
                const response = await fetchTripById(id);
                const trip = response.data.trip || response.data;
                
                // Only owner can edit
                if (trip.user?._id !== user?._id && trip.user?.username !== user?.username && trip.user !== user?._id) {
                    navigate('/');
                }

                setFormData({
                    title: trip.title || '',
                    description: trip.description || '',
                    location: trip.location || '',
                    tags: trip.tags ? trip.tags.join(', ') : ''
                });

                if (trip.images && trip.images.length > 0) {
                    setPreviews(trip.images.map(img => img.url));
                }
            } catch (err) {
                setError(err.message || "Failed to load trip");
            } finally {
                setLoading(false);
            }
        };

        fetchTrip();
    }, [id, user, navigate]);

    useEffect(() => {
        return () => {
            previews.forEach(url => {
                if (url.startsWith('blob:')) URL.revokeObjectURL(url);
            });
        };
    }, [previews]);

    const handleImageChange = (e) => {
        const files = Array.from(e.target.files).slice(0, 7);
        setImages(files);
        const filePreviews = files.map(file => URL.createObjectURL(file));
        setPreviews(filePreviews);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setUploading(true);
        setError(null);
        
        const tagsArray = formData.tags
            ? formData.tags.split(',').map(tag => tag.trim().toLowerCase())
            : ["trip", "fun", "friends"];

        const data = new FormData();
        Object.keys(formData).forEach(key => {
            if (key !== 'tags') {
                data.append(`trip[${key}]`, formData[key]);
            }
        });

        tagsArray.forEach(tag => data.append('trip[tags][]', tag));
        images.forEach(img => {
            data.append('images', img);
        });

        navigate(`/`);

        updateTripApi(id, data)
            .then(res => {
                const updatedTrip = res.data?.trip || res.data;
                if (updatedTrip) {
                    dispatch(updateTripLocally(updatedTrip));
                }
            })
            .catch(err => {
                console.error(err);
            });
    };

    if (loading) {
        return <div className="flex justify-center mt-20"><div className="animate-spin rounded-full h-10 w-10 border-b-2 border-slate-900"></div></div>;
    }

    return (
        <div className="max-w-7xl mx-auto px-4 py-10 grid grid-cols-1 lg:grid-cols-2 gap-12">
            {uploading && <Toaster message="Updating your journey... 🚀" />}
            <div className="space-y-8">
                <div>
                    <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight mb-2">Edit your trip</h1>
                    <p className="text-slate-500">Update the details below to complete your story.</p>
                </div>

                {error && <div className="bg-red-50 text-red-600 p-4 rounded-xl border border-red-100">{error}</div>}

                <form onSubmit={handleSubmit} className="space-y-6 bg-white p-8 rounded-[2rem] border shadow-sm">
                    {/* Title */}
                    <input
                        type="text"
                        placeholder="Trip Title (e.g. Goa Roadtrip with friends)"
                        required
                        value={formData.title}
                        className="w-full p-4 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none transition"
                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    />

                    {/* Description */}
                    <textarea
                        placeholder="Share your experience..."
                        rows="6"
                        required
                        value={formData.description}
                        className="w-full p-4 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none transition"
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    ></textarea>

                    {/* Location */}
                    <input
                        type="text"
                        placeholder="Location (e.g. Manali, India)"
                        required
                        value={formData.location}
                        className="w-full p-4 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none transition"
                        onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    />

                    {/* Tags Input */}
                    <div>
                        <input
                            type="text"
                            placeholder="Tags (e.g. mountains, friends, bhopal - separated by commas)"
                            value={formData.tags}
                            className="w-full p-4 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none transition"
                            onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                        />
                        <p className="text-[10px] text-slate-400 mt-1 ml-1 uppercase tracking-wider font-bold">Separate tags with commas</p>
                    </div>

                    {/* Image Upload Area */}
                    <div className="border-2 border-dashed border-slate-200 p-8 rounded-2xl flex flex-col items-center justify-center cursor-pointer hover:bg-slate-50 hover:border-indigo-300 transition group relative">
                        <input type="file" multiple accept="image/*" onChange={handleImageChange} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
                        <svg className="w-10 h-10 text-slate-400 group-hover:text-indigo-500 transition mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"></path></svg>
                        <p className="font-medium text-slate-700 group-hover:text-indigo-600 transition">Drag & drop or click to replace images</p>
                        <p className="text-xs text-slate-400 mt-1">Leave empty to keep existing images</p>
                    </div>

                    <button type="submit" className="w-full py-4 bg-slate-900 text-white rounded-xl font-bold hover:bg-indigo-600 hover:shadow-lg transition-all duration-300 disabled:opacity-50">
                        {uploading ? 'Processing...' : 'Save Edits (Background)'}
                    </button>
                </form>
            </div>

            {/* Right Side: Live Preview */}
            <div className="hidden lg:block sticky top-24 h-fit">
                <p className="text-xs font-bold text-slate-400 mb-4 uppercase tracking-widest flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                    Live Preview
                </p>
                <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-slate-100 group transition-all duration-300 hover:-translate-y-1">
                    <div className="h-80 bg-slate-100 relative">
                        {previews[0] ? (
                            <img src={previews[0]} className="w-full h-full object-cover transition duration-500 group-hover:scale-105" alt="Preview" />
                        ) : (
                            <div className="flex flex-col items-center justify-center h-full text-slate-400">
                                <svg className="w-12 h-12 mb-2 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                                <span>No Image Available</span>
                            </div>
                        )}
                        <span className="absolute top-4 left-4 bg-white/95 px-3 py-1.5 rounded-full text-xs font-bold shadow-sm backdrop-blur-sm tracking-wider uppercase text-indigo-700">
                            Trip
                        </span>
                    </div>
                    <div className="p-6">
                        <h3 className="text-xl font-bold text-slate-800 line-clamp-1 mb-2">{formData.title || "Untitled Trip"}</h3>
                        <p className="text-slate-500 text-sm line-clamp-2 mb-3">{formData.description || "Share your amazing story..."}</p>

                        <p className="text-xs text-slate-400 font-medium mb-3">
                            📍 {formData.location ? formData.location : 'Location missing'}
                        </p>

                        <div className="flex flex-wrap gap-2">
                            {formData.tags.split(',').map((tag, i) => tag.trim() && (
                                <span key={i} className="text-[10px] bg-slate-100 px-2 py-1 rounded-md text-slate-500 font-bold uppercase">
                                    #{tag.trim()}
                                </span>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EditTrip;
