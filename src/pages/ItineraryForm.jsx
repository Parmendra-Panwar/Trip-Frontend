import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import FallbackImage from '../components/FallbackImage';
import { planTripApi } from '../services/itineraryService';
import { useToast } from '../hooks/useToast';

export default function ItineraryPage() {
    const navigate = useNavigate();
    const toast = useToast();
    const [hasPending, setHasPending] = useState(false);

    useEffect(() => {
        const pending = localStorage.getItem('pendingItinerary');
        if (pending) {
            setHasPending(true);
        }
    }, []);
    const [formData, setFormData] = useState({
        source: '',
        destination: '',
        budget: '',
        days: '',
        maxKmPerDay: 700,
        travelMode: 'car'
    });
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const response = await planTripApi({
                ...formData,
                budget: Number(formData.budget),
                maxKmPerDay: Number(formData.maxKmPerDay)
            });

            if (response?.data) {
                // Assuming response.data contains the sample object provided
                // The form requires saving the budget and user selections, so we can save formData or just the response
                localStorage.setItem('pendingItinerary', JSON.stringify({
                    ...response.data,
                    userBudget: Number(formData.budget)
                }));
                navigate('/itinerary-builder');
            }
        } catch (error) {
            console.error(error);
            toast.error('Could not generate itinerary. Please check the details and try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="overflow-hidden flex items-center justify-center relative">
            {hasPending && (
                <div className="absolute top-4 right-4 z-50 bg-white shadow-2xl rounded-2xl p-4 border-l-4 border-yellow-400 max-w-sm flex flex-col gap-3 animate-fade-in-down">
                    <div className="flex items-start gap-3">
                        <div className="bg-yellow-100 p-2 rounded-full text-yellow-600">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                            </svg>
                        </div>
                        <div>
                            <h4 className="font-bold text-gray-800">Pending Plan Exists</h4>
                            <p className="text-sm text-gray-600 mt-1">
                                You have an existing plan pending. If you create a new one, you will lose the old data.
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={() => navigate('/itinerary-builder')}
                        className="w-full mt-2 bg-yellow-50 text-yellow-700 hover:bg-yellow-100 font-semibold py-2 rounded-xl transition-colors text-sm border border-yellow-200"
                    >
                        Plan older itinerary →
                    </button>
                </div>
            )}
            <div className="my-5 w-full max-w-[1400px] h-[80vh] overflow-hidden grid md:grid-cols-2">
                <div className="relative hidden md:flex items-center justify-center">
                    <FallbackImage
                        src="https://images.unsplash.com/photo-1493558103817-58b2924bce98"
                        alt="Left Decoration"
                        className="w-[90%] rounded-[40px] rotate-6 shadow-xl"
                    />
                    <FallbackImage
                        src="https://images.unsplash.com/photo-1526778548025-fa2f459cd5c1"
                        alt="Decoration"
                        className="absolute top-20 left-10 w-40 rounded-[30px] -rotate-12 shadow-xl"
                    />
                    <div className="absolute bottom-20 right-10 bg-white/10 backdrop-blur-xl text-white p-6 rounded-3xl shadow-xl max-w-xs border border-white/10">
                        <p className="text-sm leading-relaxed text-gray-900">
                            Smart itinerary planning using optimized routing & intelligent budget control.
                            <br />
                            Built to maximize experience, not just distance.
                        </p>
                    </div>
                </div>
                <div className="bg-white flex items-center justify-center px-6 md:px-12">

                    <form onSubmit={handleSubmit} className="w-full max-w-md space-y-6">
                        <div>
                            <h2 className="text-3xl font-bold text-gray-800">Design Your Trip</h2>
                            <p className="text-gray-500 text-sm mt-1">Plan efficiently with smart optimization</p>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <input name="source" placeholder="From" onChange={handleChange} className="w-full p-3 mb-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-[#FF385C] outline-none transition" />
                            <input name="destination" placeholder="To" onChange={handleChange} className="w-full p-3 mb-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-[#FF385C] outline-none transition" />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <input name="budget" placeholder="Budget ₹" type="number" onChange={handleChange} className="w-full p-3 mb-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-[#FF385C] outline-none transition" />
                            <input name="days" placeholder="Days You are planning" type="number" onChange={handleChange} className="w-full p-3 mb-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-[#FF385C] outline-none transition" />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <input name="maxKmPerDay" placeholder="Max Km/Day" type="number" onChange={handleChange} className="w-full p-3 mb-4 rounded-xl border border-slate-200 focus:ring-2 focus:ring-[#FF385C] outline-none transition" />
                            <select name="travelMode" onChange={handleChange} className="cursor-pointer w-full p-3 mb-4 rounded-xl border border-slate-200 focus:ring-2 focus:ring-[#FF385C] outline-none transition bg-white">
                                <option value="car">Car</option>
                                <option value="bike">Bike</option>
                                <option value="train">Train</option>
                                <option value="bus">Bus</option>
                                <option value="flight">Flight</option>
                            </select>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="cursor-pointer w-full bg-[#FF385C] text-white py-4 rounded-xl font-semibold shadow-md hover:shadow-lg hover:scale-[1.02] active:scale-[0.99] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:scale-100"
                        >
                            {loading ? 'Calculating...' : 'Generate Itinerary'}
                        </button>

                    </form>
                </div>

            </div>
        </div>
    );
}
