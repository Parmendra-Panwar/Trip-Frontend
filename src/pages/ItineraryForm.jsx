import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import FallbackImage from '../components/FallbackImage';
import CityAutocomplete from '../components/CityAutocomplete';
import { planTripApi } from '../services/itineraryService';
import { useToast } from '../hooks/useToast';
import { fullCitiesData } from '../../utils/cities';

export default function ItineraryPage() {
    const navigate = useNavigate();
    const toast = useToast();
    const [hasPending, setHasPending] = useState(false);
    const [loading, setLoading] = useState(false);

    // Dynamic routing states
    const [needReturn, setNeedReturn] = useState(false);
    const [differentReturn, setDifferentReturn] = useState(false);
    const [onwardStops, setOnwardStops] = useState([]);
    const [returnStops, setReturnStops] = useState([]);

    const formData = useRef({
        source: { name: '', lat: null, lon: null },
        destination: { name: '', lat: null, lon: null },
        budget: '',
        days: '',
        maxKmPerDay: 500,
        travelMode: 'car'
    });

    useEffect(() => {
        if (localStorage.getItem('pendingItinerary')) setHasPending(true);
    }, []);

    const handleChange = (e) => {
        formData.current[e.target.name] = e.target.value;
    };

    const handleCityChange = (field, cityData) => {
        formData.current[field] = cityData;
    };

    const handleStopChange = (type, index, val) => {
        const updater = type === 'onward' ? setOnwardStops : setReturnStops;
        const currentStops = type === 'onward' ? [...onwardStops] : [...returnStops];
        currentStops[index] = val;
        updater(currentStops);
    };

    const addStop = (type) => {
        const updater = type === 'onward' ? setOnwardStops : setReturnStops;
        const currentStops = type === 'onward' ? onwardStops : returnStops;
        updater([...currentStops, { name: '', lat: null, lon: null }]);
    };

    const removeStop = (type, index) => {
        const updater = type === 'onward' ? setOnwardStops : setReturnStops;
        const currentStops = type === 'onward' ? onwardStops : returnStops;
        updater(currentStops.filter((_, i) => i !== index));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        const data = formData.current;

        try {
            const response = await planTripApi({
                ...data,
                source: data.source.name,
                sourceLat: data.source.lat,
                sourceLon: data.source.lon,
                destination: data.destination.name,
                destLat: data.destination.lat,
                destLon: data.destination.lon,
                budget: Number(data.budget),
                maxKmPerDay: Number(data.maxKmPerDay),
                isRoundTrip: needReturn,
                onwardWaypoints: onwardStops,
                returnWaypoints: needReturn && differentReturn ? returnStops : [],
                daysAtDestination: Number(data.daysAtDestination),
            });

            if (response?.data) {
                localStorage.setItem('pendingItinerary', JSON.stringify({
                    ...response.data,
                    userBudget: Number(data.budget)
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

    const renderStops = (type) => {
        const stops = type === 'onward' ? onwardStops : returnStops;
        return (
            <div className="space-y-3 mt-3">
                {stops.map((stop, index) => (
                    <div key={index} className="flex items-center gap-3 animate-fade-in">
                        <div className="flex-1">
                            <CityAutocomplete
                                placeholder={`Waypoint ${index + 1}`}
                                cities={fullCitiesData}
                                value={stop}
                                onChange={(val) => handleStopChange(type, index, val)}
                            />
                        </div>
                        <button
                            type="button"
                            onClick={() => removeStop(type, index)}
                            className="flex items-center justify-center w-12 h-12 bg-red-50 text-red-500 rounded-xl hover:bg-red-100 hover:text-red-600 transition-colors shrink-0 mb-2"
                            title="Remove stop"
                        >
                            ✕
                        </button>
                    </div>
                ))}
                <button
                    type="button"
                    onClick={() => addStop(type)}
                    className="inline-flex items-center gap-2 px-4 py-2 mt-1 text-sm font-semibold text-[#FF385C] bg-[#FF385C]/10 rounded-lg hover:bg-[#FF385C]/20 transition-colors"
                >
                    <span className="text-lg leading-none">+</span> Add Specific Stop
                </button>
            </div>
        );
    };
    const [closeHasPending, setCloseHasPending] = useState(false);

    return (
        <div className="overflow-hidden flex items-center justify-center relative bg-gray-50/50">
            {hasPending && !closeHasPending && (
                <div className="absolute top-4 right-4 z-50 bg-white shadow-2xl rounded-2xl p-4 border-l-4 border-yellow-400 max-w-sm flex flex-col gap-3 animate-fade-in-down">
                    <div className="flex items-start gap-3">
                        <div className="bg-yellow-100 p-2 rounded-full text-yellow-600">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                            </svg>
                        </div>
                        <div>
                            <div className="flex justify-between items-center">
                                <h4 className="font-bold text-gray-800">Pending Plan Exists</h4>
                                <button
                                    onClick={() => setCloseHasPending(true)}
                                    className="cursor-pointer bg-red-50 text-red-500 hover:bg-red-100 hover:text-red-600 transition-colors shrink-0 mb-2 p-2 rounded-xl"
                                >
                                    ✕
                                </button>
                            </div>
                            <p className="text-sm text-gray-600 mt-1">
                                You have an existing plan pending. If you create a new one, you will lose the old data.
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={() => {
                            navigate('/itinerary-builder');
                            setCloseHasPending(true);
                        }}
                        className="cursor-pointer w-full mt-2 bg-yellow-50 text-yellow-700 hover:bg-yellow-100 font-semibold py-2 rounded-xl transition-colors text-sm border border-yellow-200"
                    >
                        Plan older itinerary →
                    </button>
                </div>
            )}
            <div className="my-5 w-full max-w-[1400px] h-[80vh] overflow-hidden grid md:grid-cols-2">

                {/* Left Graphics */}
                <div className="relative hidden md:flex items-center justify-center bg-gray-50 overflow-hidden">
                    <FallbackImage src="https://images.unsplash.com/photo-1493558103817-58b2924bce98" alt="Decoration" className="w-[85%] rounded-[30px] rotate-6 shadow-2xl object-cover h-[60%]" />
                    <FallbackImage src="https://images.unsplash.com/photo-1526778548025-fa2f459cd5c1" alt="Decoration" className="absolute top-16 left-8 w-48 rounded-[30px] -rotate-12 shadow-2xl border-4 border-white" />
                    <div className="absolute bottom-12 right-8 bg-white/20 backdrop-blur-md text-gray-900 p-6 rounded-3xl shadow-xl max-w-sm border border-white/40">
                        <p className="text-sm font-medium leading-relaxed">
                            Smart itinerary planning using optimized routing & intelligent budget control. Built to maximize your experience, not just distance.
                        </p>
                    </div>
                </div>

                {/* Right Form */}
                <div className="flex items-start justify-center px-6 md:px-12 w-full overflow-y-auto py-10 scrollbar-hide">
                    <form onSubmit={handleSubmit} className="w-full max-w-lg space-y-4">

                        <div className="space-y-1.5">
                            <h2 className="text-4xl font-extrabold text-gray-900 tracking-tight">Design Your Trip</h2>
                            <p className="text-gray-500 text-base">Plan efficiently with smart route optimization.</p>
                        </div>

                        {/* Core Route */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-gray-700">Starting Point</label>
                                <CityAutocomplete placeholder="e.g. Mumbai" cities={fullCitiesData} value={formData.current.source} onChange={(val) => handleCityChange('source', val)} />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-gray-700">Destination</label>
                                <CityAutocomplete placeholder="e.g. Goa" cities={fullCitiesData} value={formData.current.destination} onChange={(val) => handleCityChange('destination', val)} />
                            </div>
                        </div>

                        {/* Onward Stops */}
                        <div className="bg-gray-50 p-5 rounded-2xl border border-gray-200 shadow-sm transition-all">
                            <label className="text-sm font-bold text-gray-800 flex items-center gap-2">
                                Onward Journey Waypoints <span className="text-xs font-medium text-gray-400 bg-gray-200 px-2 py-0.5 rounded-full">Optional</span>
                            </label>
                            {renderStops('onward')}
                        </div>

                        {/* Logistics */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-gray-700">Total Budget (₹)</label>
                                <input required name="budget" placeholder="e.g. 15000" type="number" onChange={handleChange} className="w-full p-3.5 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-[#FF385C]/30 focus:border-[#FF385C] outline-none transition-all shadow-sm" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-gray-700">Pace (Max Km/Day)</label>
                                <input name="maxKmPerDay" placeholder="e.g. 500" type="number" defaultValue={500} onChange={handleChange} className="w-full p-3.5 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-[#FF385C]/30 focus:border-[#FF385C] outline-none transition-all shadow-sm" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-gray-700">Total Duration (Days)</label>
                                <input required name="days" placeholder="e.g. 8" type="number" onChange={handleChange} className="w-full p-3.5 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-[#FF385C]/30 focus:border-[#FF385C] outline-none transition-all shadow-sm" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-gray-700">Number of Days at Destination</label>
                                <input required name="daysAtDestination" placeholder="e.g. 2" type="number" onChange={handleChange} className="w-full p-3.5 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-[#FF385C]/30 focus:border-[#FF385C] outline-none transition-all shadow-sm" />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-gray-700">Travel Mode</label>
                                <select name="travelMode" onChange={handleChange} className="cursor-pointer w-full p-3.5 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-[#FF385C]/30 focus:border-[#FF385C] outline-none transition-all shadow-sm appearance-none">
                                    <option value="car">Car</option>
                                    <option value="bike">Bike</option>
                                    <option value="train">Train</option>
                                    <option value="bus">Bus</option>
                                    <option value="flight">Flight</option>
                                </select>
                            </div>
                        </div>

                        {/* Return Trip Section */}
                        <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm space-y-5">
                            <label className="flex items-center gap-3 cursor-pointer group">
                                <input
                                    type="checkbox"
                                    checked={needReturn}
                                    onChange={(e) => {
                                        setNeedReturn(e.target.checked);
                                        if (!e.target.checked) setDifferentReturn(false);
                                    }}
                                    className="w-5 h-5 text-[#FF385C] rounded border-gray-300 focus:ring-[#FF385C] cursor-pointer accent-[#FF385C] transition-all"
                                />
                                <span className="font-bold text-gray-800 group-hover:text-[#FF385C] transition-colors">Plan Return Trip</span>
                            </label>

                            {needReturn && (
                                <div className="pl-8 space-y-5 border-l-2 border-[#FF385C]/20 ml-2 animate-fade-in">
                                    <label className="flex items-center gap-3 cursor-pointer group">
                                        <input
                                            type="checkbox"
                                            checked={differentReturn}
                                            onChange={(e) => setDifferentReturn(e.target.checked)}
                                            className="w-5 h-5 text-[#FF385C] rounded border-gray-300 focus:ring-[#FF385C] cursor-pointer accent-[#FF385C] transition-all"
                                        />
                                        <span className="font-semibold text-gray-700 group-hover:text-[#FF385C] transition-colors">Take a different route back</span>
                                    </label>

                                    {differentReturn && (
                                        <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
                                            <label className="text-sm font-bold text-gray-800">Return Journey Waypoints</label>
                                            {renderStops('return')}
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>

                        <div className="pt-2 pb-8">
                            <button
                                type="submit"
                                disabled={loading}
                                className="cursor-pointer w-full bg-[#FF385C] text-white py-4 rounded-xl font-bold text-lg tracking-wide shadow-lg shadow-[#FF385C]/25 hover:shadow-xl hover:shadow-[#FF385C]/40 hover:-translate-y-1 active:translate-y-0 transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed disabled:transform-none flex justify-center items-center gap-2"
                            >
                                {loading ? (
                                    <>
                                        <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Calculating Best Route...
                                    </>
                                ) : 'Generate Itinerary'}
                            </button>
                        </div>

                    </form>
                </div>
            </div>
        </div>
    );
}