import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { saveTripApi } from '../services/itineraryService';
import ItineraryListingCard from '../components/ItineraryListingCard';
import ItineraryActivityCard from '../components/ItineraryActivityCard';
import ItineraryModal from '../components/ItineraryModal';
import ItinerarySideCalculation from '../components/ItinerarySideCalculation';
import { useToast } from '../hooks/useToast';

export default function ItineraryBuilder() {
    const navigate = useNavigate();
    const toast = useToast();
    const [tripData, setTripData] = useState(null);
    const [selections, setSelections] = useState({});
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    // Modal State
    const [detailItem, setDetailItem] = useState(null);
    const [detailType, setDetailType] = useState(''); // 'listing' or 'activity'
    const [currentImgIndex, setCurrentImgIndex] = useState(0);

    useEffect(() => {
        const stored = localStorage.getItem('pendingItinerary');
        if (stored) {
            try {
                const parsed = JSON.parse(stored);
                setTripData(parsed);
                const initialSelections = {};
                if (parsed.days) {
                    parsed.days.forEach(day => {
                        initialSelections[day.dayIndex] = {
                            stay: day.stays?.length > 0 ? day.stays[0] : null,
                            activities: []
                        };
                    });
                }
                setSelections(initialSelections);
            } catch {
                console.error('Failed to parse itinerary data');
            }
        }
    }, []);

    const handleStaySelect = (dayIndex, stay) => {
        setSelections(prev => ({
            ...prev,
            [dayIndex]: { ...prev[dayIndex], stay }
        }));
    };

    const handleActivityToggle = (dayIndex, activity) => {
        setSelections(prev => {
            const dayData = prev[dayIndex] || { activities: [] };
            const isSelected = dayData.activities?.find(a => a._id === activity._id);
            const newActivities = isSelected
                ? dayData.activities.filter(a => a._id !== activity._id)
                : [...(dayData.activities || []), activity];
            return { ...prev, [dayIndex]: { ...dayData, activities: newActivities } };
        });
    };

    const handleSaveTrip = async () => {
        setLoading(true);
        setError('');

        for (const day of (tripData?.days || [])) {
            if (day.dayIndex !== 1 && day.stays?.length > 0 && !selections[day.dayIndex]?.stay) {
                setError(`Please select a stay for Day ${day.dayIndex}`);
                setLoading(false);
                return;
            }
        }

        try {
            const finalPayload = {
                totalDistance: tripData.totalDistance,
                message: tripData.message,
                source: tripData.source,
                destination: tripData.destination,
                budget: tripData.budget,
                maxKmPerDay: tripData.maxKmPerDay,
                travelMode: tripData.travelMode,
                days: tripData?.days?.map(d => ({
                    dayIndex: d.dayIndex,
                    startLocation: d.startLocation,
                    endLocation: d.endLocation,
                    stopoverGridId: d.stopoverGridId,
                    distanceCovered: d.distanceCovered,
                    selectedStay: selections[d.dayIndex]?.stay?._id || null,
                    selectedActivities: (selections[d.dayIndex]?.activities || [])?.map(a => a._id)
                }))
            };

            await saveTripApi(finalPayload);
            localStorage.removeItem('pendingItinerary');
            toast.success('Trip booked successfully!');
            navigate('/');
        } catch (err) {
            console.error(err);
            toast.error('Failed to book trip. Please try again.');
            setError('Failed to book trip. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const openDetails = (e, item, type) => {
        e.stopPropagation();
        setDetailItem(item);
        setDetailType(type);
        setCurrentImgIndex(0);
    };

    const closeDetails = () => {
        setDetailItem(null);
        setDetailType('');
    };

    if (!tripData) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] px-6">
                <div className="bg-white p-10 rounded-2xl shadow-sm border border-gray-100 text-center w-full max-w-lg">
                    <h2 className="text-2xl font-semibold text-gray-900 mb-3">No Pending Itinerary</h2>
                    <p className="text-gray-500 mb-8 text-sm leading-relaxed">You haven't planned a trip yet. Start building your custom itinerary to see it here.</p>
                    <button
                        onClick={() => navigate('/plan-itinerary')}
                        className="bg-[#FF385C] text-white px-8 py-3.5 rounded-xl font-medium shadow-md hover:bg-[#e03150] transition-colors w-full"
                    >
                        Create Your First Plan
                    </button>
                </div>
            </div>
        );
    }

    const { totalBudget = 45000, days = [], message } = tripData;
    const budget = tripData.userBudget || totalBudget;

    const totalSpent = Object.values(selections).reduce((acc, day) => {
        const stayCost = day?.stay?.price || 0;
        const activitiesCost = day?.activities?.reduce((sum, act) => sum + act.price, 0) || 0;
        return acc + stayCost + activitiesCost;
    }, 0);

    const remainingBudget = budget - totalSpent;

    return (
        <div className="max-w-[1305px] mx-auto px-6 md:px-10 pt-8 pb-16 relative">

            <ItineraryModal
                detailItem={detailItem}
                detailType={detailType}
                currentImgIndex={currentImgIndex}
                setCurrentImgIndex={setCurrentImgIndex}
                closeDetails={closeDetails}
            />

            <div className="flex flex-col lg:flex-row gap-10 xl:gap-14 w-full">
                {/* LEFT: Day by Day Planner */}
                <div className="flex-1 w-full space-y-8">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900 tracking-tight mb-2">Select Stays & Activities</h1>
                        <p className="text-gray-500 text-sm">Customize your journey for the best experience.</p>

                        {error && (
                            <div className="mt-4 bg-red-50 text-red-600 px-4 py-3 rounded-lg border border-red-100 flex items-center gap-3 text-sm">
                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                <span className="font-medium">{error}</span>
                            </div>
                        )}

                        {message && (
                            <div className="mt-4 bg-slate-50 text-slate-700 p-4 rounded-lg border border-slate-200 flex gap-3 text-sm">
                                <svg className="w-5 h-5 text-slate-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                <p>{message}</p>
                            </div>
                        )}
                    </div>

                    <div className="relative space-y-10 w-full">
                        {days?.map((day) => (
                            <div key={day.dayIndex} className="relative bg-white p-6 md:p-8 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow w-full">
                                <div className="flex flex-col md:flex-row justify-between md:items-end mb-8 gap-4 border-b border-gray-100 pb-5">
                                    <div>
                                        <span className="inline-block text-xs font-bold text-[#FF385C] tracking-wider uppercase mb-2">Day {day.dayIndex}</span>
                                        <h2 className="text-xl font-semibold text-gray-900">{day.startLocation} <span className="text-gray-400 font-normal mx-2">→</span> {day.endLocation}</h2>
                                    </div>
                                    <div className="text-sm text-gray-500 font-medium">
                                        {day.distanceCovered} km
                                    </div>
                                </div>

                                {/* Stays */}
                                {day.stays && day.stays.length > 0 && (
                                    <div className="mb-8 w-full">
                                        <div className="flex items-center justify-between mb-4">
                                            <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                                                <svg className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m3-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>
                                                Suggested Stays
                                            </h3>
                                            <span className="text-xs text-gray-500 font-medium bg-gray-100 px-2 py-1 rounded-md">
                                                {day.dayIndex === 1 ? 'Optional' : 'Pick 1'}
                                            </span>
                                        </div>
                                        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                                            {day?.stays?.map(stay => (
                                                <ItineraryListingCard
                                                    key={stay._id}
                                                    stay={stay}
                                                    dayIndex={day.dayIndex}
                                                    isSelected={selections[day.dayIndex]?.stay?._id === stay._id}
                                                    onSelect={handleStaySelect}
                                                    onOpenDetails={openDetails}
                                                />
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Activities */}
                                {day.activities && day.activities.length > 0 && (
                                    <div className="w-full">
                                        <div className="flex items-center justify-between mb-4">
                                            <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                                                <svg className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                                                Nearby Activities
                                            </h3>
                                            <span className="text-xs text-gray-500 font-medium bg-gray-100 px-2 py-1 rounded-md">Optional</span>
                                        </div>
                                        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
                                            {day?.activities?.map(act => (
                                                <ItineraryActivityCard
                                                    key={act._id}
                                                    act={act}
                                                    dayIndex={day.dayIndex}
                                                    isSelected={!!selections[day.dayIndex]?.activities?.find(a => a._id === act._id)}
                                                    onToggle={handleActivityToggle}
                                                    onOpenDetails={openDetails}
                                                />
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>

                <ItinerarySideCalculation
                    totalDistance={tripData.totalDistance}
                    budget={budget}
                    totalSpent={totalSpent}
                    remainingBudget={remainingBudget}
                    loading={loading}
                    onSave={handleSaveTrip}
                />

            </div>
        </div>
    );
}