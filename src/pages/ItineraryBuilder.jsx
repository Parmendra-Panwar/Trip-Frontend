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

    const [detailItem, setDetailItem] = useState(null);
    const [detailType, setDetailType] = useState('');
    const [currentImgIndex, setCurrentImgIndex] = useState(0);

    useEffect(() => {
        const stored = localStorage.getItem('pendingItinerary');
        if (stored) {
            try {
                const parsed = JSON.parse(stored);
                setTripData(parsed);
                const initialSelections = {};
                if (parsed?.days?.length > 0) {
                    parsed.days.forEach(day => {
                        initialSelections[day?.dayIndex] = {
                            stay: day?.stays?.length > 0 ? day.stays[0] : null,
                            activities: [],
                            skipped: false // New field to track skipped days
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
            [dayIndex]: { ...(prev[dayIndex] || {}), stay }
        }));
    };

    const handleActivityToggle = (dayIndex, activity) => {
        setSelections(prev => {
            const dayData = prev[dayIndex] || { activities: [] };
            const isSelected = dayData?.activities?.find(a => a?._id === activity?._id);
            const newActivities = isSelected
                ? dayData.activities.filter(a => a?._id !== activity?._id)
                : [...(dayData.activities || []), activity];
            return { ...prev, [dayIndex]: { ...dayData, activities: newActivities } };
        });
    };

    // Toggle for skipping the whole day
    const handleSkipToggle = (dayIndex) => {
        setSelections(prev => ({
            ...prev,
            [dayIndex]: {
                ...(prev[dayIndex] || {}),
                skipped: !prev[dayIndex]?.skipped
            }
        }));
    };

    const handleSaveTrip = async () => {
        setLoading(true);
        setError('');

        const totalDays = tripData?.days?.length || 0;

        for (const day of (tripData?.days || [])) {
            const isFirstDay = day?.dayIndex === 1;
            const isLastDay = day?.dayIndex === totalDays;
            const isSkipped = selections[day?.dayIndex]?.skipped;

            if (!isFirstDay && (!isLastDay || !tripData?.isRoundTrip) && !isSkipped && day?.stays?.length > 0 && !selections[day?.dayIndex]?.stay) {
                setError(`Please select a stay for Day ${day?.dayIndex} or mark it as skipped.`);
                setLoading(false);
                window.scrollTo({ top: 0, behavior: 'smooth' });
                return;
            }
        }

        try {
            const finalPayload = {
                totalDistance: tripData?.totalDistance,
                message: tripData?.message,
                source: tripData?.source,
                destination: tripData?.destination,
                budget: tripData?.budget,
                maxKmPerDay: tripData?.maxKmPerDay,
                travelMode: tripData?.travelMode,
                isRoundTrip: tripData?.isRoundTrip || false,
                daysAtDestination: tripData?.daysAtDestination || 0,
                days: tripData?.days?.map(d => {
                    const isSkipped = selections[d?.dayIndex]?.skipped;
                    return {
                        dayIndex: d?.dayIndex,
                        startLocation: d?.startLocation,
                        endLocation: d?.endLocation,
                        stopoverGridId: d?.stopoverGridId,
                        distanceCovered: d?.distanceCovered,
                        isSkipped: isSkipped,
                        selectedStay: isSkipped ? null : (selections[d?.dayIndex]?.stay?._id || null),
                        selectedActivities: isSkipped ? [] : ((selections[d?.dayIndex]?.activities || [])?.map(a => a?._id))
                    };
                })
            };

            await saveTripApi(finalPayload);
            localStorage.removeItem('pendingItinerary');
            toast.success('Trip saved successfully!');
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
                    <p className="text-gray-500 mb-8 text-sm">You haven't planned a trip yet. Start building your custom itinerary to see it here.</p>
                    <button onClick={() => navigate('/plan-itinerary')} className="bg-[#FF385C] text-white px-8 py-3.5 rounded-xl font-medium shadow-md w-full">
                        Create Your First Plan
                    </button>
                </div>
            </div>
        );
    }

    const { totalBudget = 45000, days = [], message, source, destination, isRoundTrip, daysAtDestination } = tripData;
    const budget = tripData?.userBudget || totalBudget;

    // Sirf unhi din ka cost jodo jo skip nahi hue hain
    const totalSpent = Object.entries(selections).reduce((acc, [dayIdx, day]) => {
        if (day?.skipped) return acc;
        const stayCost = day?.stay?.price || 0;
        const activitiesCost = day?.activities?.reduce((sum, act) => sum + (act?.price || 0), 0) || 0;
        return acc + stayCost + activitiesCost;
    }, 0);

    const remainingBudget = budget - totalSpent;

    return (
        <div className="max-w-[1305px] mx-auto px-6 md:px-10 pt-8 pb-16 relative">
            <ItineraryModal detailItem={detailItem} detailType={detailType} currentImgIndex={currentImgIndex} setCurrentImgIndex={setCurrentImgIndex} closeDetails={closeDetails} />

            <div className="flex flex-col lg:flex-row gap-10 xl:gap-14 w-full">
                {/* LEFT: Day by Day Planner */}
                <div className="flex-1 w-full space-y-8">
                    <div>
                        <div className="flex items-center gap-3 mb-2">
                            <span className="bg-[#FF385C]/10 text-[#FF385C] px-3 py-1 rounded-md text-xs font-bold uppercase">
                                {isRoundTrip ? 'Round Trip' : 'One Way'}
                            </span>
                            {daysAtDestination > 0 && (
                                <span className="bg-blue-50 text-blue-600 px-3 py-1 rounded-md text-xs font-bold uppercase">
                                    {daysAtDestination} Days at Dest
                                </span>
                            )}
                        </div>
                        <h1 className="text-3xl font-bold text-gray-900 mb-2">
                            {source} {isRoundTrip ? '⇄' : '→'} {destination}
                        </h1>
                        <p className="text-gray-500 text-sm">Select stays & activities. Skip expensive stops to save your budget.</p>

                        {error && (
                            <div className="mt-4 bg-red-50 text-red-600 px-4 py-3 rounded-lg border border-red-100 flex items-center gap-3 text-sm">
                                <span className="font-medium">{error}</span>
                            </div>
                        )}
                        {message && (
                            <div className="mt-4 bg-slate-50 text-slate-700 p-4 rounded-lg border border-slate-200 text-sm">
                                <p>{message}</p>
                            </div>
                        )}
                    </div>

                    <div className="relative space-y-10 w-full">
                        {days?.map((day) => {
                            const isSkipped = selections[day?.dayIndex]?.skipped;
                            return (
                                <div key={day?.dayIndex} className={`relative bg-white p-6 md:p-8 rounded-xl border ${isSkipped ? 'border-orange-300 bg-orange-50/30' : 'border-gray-200'} shadow-sm transition-all w-full`}>

                                    <div className="flex flex-col md:flex-row justify-between md:items-end mb-6 gap-4 border-b border-gray-100 pb-5">
                                        <div>
                                            <span className="inline-block text-xs font-bold text-[#FF385C] tracking-wider uppercase mb-2">Day {day?.dayIndex}</span>
                                            <h2 className="text-xl font-semibold text-gray-900">{day?.startLocation} <span className="text-gray-400 font-normal mx-2">→</span> {day?.endLocation}</h2>
                                        </div>
                                        <div className="flex flex-col items-end gap-3">
                                            <div className="text-sm text-gray-500 font-medium bg-gray-50 px-3 py-1 rounded">
                                                {day?.distanceCovered} km
                                            </div>
                                            {/* Skip Day Checkbox */}
                                            <label className="flex items-center gap-2 cursor-pointer bg-white border border-gray-200 px-3 py-1.5 rounded-lg hover:bg-gray-50 transition">
                                                <input
                                                    type="checkbox"
                                                    checked={isSkipped || false}
                                                    onChange={() => handleSkipToggle(day?.dayIndex)}
                                                    className="w-4 h-4 text-orange-500 rounded border-gray-300 focus:ring-orange-500 cursor-pointer"
                                                />
                                                <span className="text-sm font-semibold text-gray-700">Skip Stop</span>
                                            </label>
                                        </div>
                                    </div>

                                    {/* Dim the content if the day is skipped */}
                                    <div className={`transition-opacity duration-300 ${isSkipped ? 'opacity-40 pointer-events-none grayscale' : 'opacity-100'}`}>
                                        {/* Stays */}
                                        {day?.stays && day?.stays?.length > 0 && (
                                            <div className="mb-8 w-full">
                                                <div className="flex items-center justify-between mb-4">
                                                    <h3 className="font-semibold text-gray-900">Suggested Stays</h3>
                                                    <span className="text-xs text-gray-500 font-medium bg-gray-100 px-2 py-1 rounded-md">
                                                        {(day?.dayIndex === 1 || (isRoundTrip && day?.dayIndex === days?.length)) ? 'Optional' : 'Pick 1'}
                                                    </span>
                                                </div>
                                                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                                                    {day?.stays?.map(stay => (
                                                        <ItineraryListingCard
                                                            key={stay?._id}
                                                            stay={stay}
                                                            dayIndex={day?.dayIndex}
                                                            isSelected={selections[day?.dayIndex]?.stay?._id === stay?._id}
                                                            onSelect={handleStaySelect}
                                                            onOpenDetails={openDetails}
                                                        />
                                                    ))}
                                                </div>
                                            </div>
                                        )}

                                        {/* Activities */}
                                        {day?.activities && day?.activities?.length > 0 && (
                                            <div className="w-full border-t border-gray-50 pt-6">
                                                <div className="flex items-center justify-between mb-4">
                                                    <h3 className="font-semibold text-gray-900">Nearby Activities</h3>
                                                    <span className="text-xs text-gray-500 font-medium bg-gray-100 px-2 py-1 rounded-md">Optional</span>
                                                </div>
                                                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
                                                    {day?.activities?.map(act => (
                                                        <ItineraryActivityCard
                                                            key={act?._id}
                                                            act={act}
                                                            dayIndex={day?.dayIndex}
                                                            isSelected={!!selections[day?.dayIndex]?.activities?.find(a => a?._id === act?._id)}
                                                            onToggle={handleActivityToggle}
                                                            onOpenDetails={openDetails}
                                                        />
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* RIGHT: Side Calculation Panel (Restored to exact position) */}
                <ItinerarySideCalculation
                    totalDistance={tripData?.totalDistance}
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