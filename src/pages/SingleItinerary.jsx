import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getSingleItineraryApi } from '../services/itineraryService';
import ItineraryListingCard from '../components/ItineraryListingCard';
import ItineraryActivityCard from '../components/ItineraryActivityCard';
import ItineraryModal from '../components/ItineraryModal';

// ─── Dummy handlers (read-only view) ──────────────────────────────────────────
const noop = () => { };

// ─── Travel mode labels ───────────────────────────────────────────────────────
const travelModeLabel = (mode) => {
    const map = { car: 'Car', bike: 'Bike', bus: 'Bus', train: 'Train', flight: 'Flight' };
    return map[mode] || mode;
};

// ─── Side Summary Panel ───────────────────────────────────────────────────────
function SideSummary({ itinerary, totalSpent }) {
    const budget = itinerary.budget || 0;
    const remaining = budget - totalSpent;
    const spentPct = Math.min((totalSpent / budget) * 100, 100);

    return (
        <div className="lg:w-[380px] w-full shrink-0 mt-4 md:mt-0">
            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm sticky top-8 md:top-24">
                <h2 className="text-lg uppercase tracking-wider font-semibold text-[#FF385C] mb-5 pb-4 border-b border-gray-100">
                    Itinerary Summary
                </h2>

                <div className="space-y-4 mb-6 text-sm">
                    {/* Source */}
                    <div className="flex justify-between items-center text-gray-600">
                        <span>Origin</span>
                        <span className="font-medium text-gray-900 capitalize">{itinerary.source}</span>
                    </div>
                    <div className="flex justify-between items-center text-gray-600">
                        <span>Destination</span>
                        <span className="font-medium text-gray-900 capitalize">{itinerary.destination}</span>
                    </div>

                    {/* Travel Mode */}
                    <div className="flex justify-between items-center text-gray-600">
                        <span>Travel Mode</span>
                        <span className="font-medium text-gray-900">{travelModeLabel(itinerary.travelMode)}</span>
                    </div>

                    {/* Total Distance */}
                    <div className="flex justify-between items-center text-gray-600">
                        <span>Total Distance</span>
                        <span className="font-medium text-gray-900">{itinerary.totalDistance} km</span>
                    </div>

                    {/* Days */}
                    <div className="flex justify-between items-center text-gray-600">
                        <span>Duration</span>
                        <span className="font-medium text-gray-900">{itinerary.days?.length} day{itinerary.days?.length !== 1 ? 's' : ''}</span>
                    </div>

                    {/* Budget */}
                    <div className="flex justify-between items-center text-gray-600">
                        <span>Total Budget</span>
                        <span className="font-medium text-gray-900">₹{budget.toLocaleString()}</span>
                    </div>

                    {/* Spent bar */}
                    <div className="pt-2">
                        <div className="flex justify-between items-end mb-2">
                            <span className="text-gray-500 text-xs uppercase tracking-wider font-semibold">Spent</span>
                            <span className="font-semibold text-gray-900 text-base">₹{totalSpent.toLocaleString()}</span>
                        </div>
                        <div className="w-full bg-gray-100 rounded-full h-1.5 overflow-hidden">
                            <div
                                className={`h-full transition-all duration-500 ${totalSpent > budget ? 'bg-red-500' : 'bg-[#FF385C]'}`}
                                style={{ width: `${spentPct}%` }}
                            />
                        </div>
                        {totalSpent > budget && (
                            <p className="text-red-500 text-xs mt-2 text-right">
                                Over budget by ₹{(totalSpent - budget).toLocaleString()}
                            </p>
                        )}
                    </div>

                    {/* Remaining */}
                    <div className="flex justify-between items-center pt-4 border-t border-gray-100">
                        <span className="text-gray-900 font-medium">Remaining</span>
                        <span className={`font-semibold text-lg ${remaining < 0 ? 'text-red-600' : 'text-emerald-600'}`}>
                            ₹{remaining.toLocaleString()}
                        </span>
                    </div>
                </div>

                {/* Booked badge */}
                <div className="w-full bg-emerald-50 border border-emerald-200 text-emerald-700 py-3.5 rounded-xl font-medium flex items-center justify-center gap-2 text-sm">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Itinerary Confirmed
                </div>

                <p className="text-center text-xs text-gray-400 mt-4 flex items-center justify-center gap-1">
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                    Secure Booking
                </p>
            </div>
        </div>
    );
}

// ─── Loading skeleton ─────────────────────────────────────────────────────────
function LoadingSkeleton() {
    return (
        <div className="max-w-[1305px] mx-auto px-6 md:px-10 pt-8 pb-16">
            <div className="flex flex-col lg:flex-row gap-10 xl:gap-14 w-full">
                <div className="flex-1 space-y-8">
                    <div className="h-8 w-48 bg-gray-200 rounded-lg animate-pulse" />
                    <div className="h-4 w-72 bg-gray-100 rounded animate-pulse" />
                    {[1, 2].map(i => (
                        <div key={i} className="bg-white p-6 md:p-8 rounded-xl border border-gray-200 shadow-sm space-y-4">
                            <div className="h-6 w-56 bg-gray-200 rounded animate-pulse" />
                            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                                {[1, 2].map(j => (
                                    <div key={j} className="rounded-xl border border-gray-100 overflow-hidden">
                                        <div className="h-44 bg-gray-200 animate-pulse" />
                                        <div className="p-4 space-y-2">
                                            <div className="h-4 bg-gray-200 rounded animate-pulse w-3/4" />
                                            <div className="h-3 bg-gray-100 rounded animate-pulse w-1/2" />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
                <div className="lg:w-[380px] w-full shrink-0 mt-8 md:mt-24">
                    <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm space-y-4">
                        {[1, 2, 3, 4, 5].map(i => (
                            <div key={i} className="h-4 bg-gray-100 rounded animate-pulse" />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function SingleItinerary() {
    const { id } = useParams();
    const [itinerary, setItinerary] = useState(null);
    const [loading, setLoading] = useState(true);

    // Modal state
    const [detailItem, setDetailItem] = useState(null);
    const [detailType, setDetailType] = useState('');
    const [currentImgIndex, setCurrentImgIndex] = useState(0);

    useEffect(() => {
        getSingleItineraryApi(id)
            .then(res => setItinerary(res.data))
            .catch(err => console.error(err))
            .finally(() => setLoading(false));
    }, [id]);

    const openDetails = (e, item, type) => {
        e?.stopPropagation?.();
        setDetailItem(item);
        setDetailType(type);
        setCurrentImgIndex(0);
    };
    const closeDetails = () => {
        setDetailItem(null);
        setDetailType('');
    };

    if (loading) return <LoadingSkeleton />;
    if (!itinerary) return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] px-6">
            <div className="bg-white p-10 rounded-2xl shadow-sm border border-gray-100 text-center w-full max-w-lg">
                <h2 className="text-2xl font-semibold text-gray-900 mb-3">Itinerary Not Found</h2>
                <p className="text-gray-500 mb-8 text-sm leading-relaxed">We couldn't load this itinerary. It may have been removed or the link is invalid.</p>
            </div>
        </div>
    );

    // Compute totals
    console.log(itinerary);
    const totalSpent = itinerary?.data?.days?.reduce((acc, day) => {
        let cost = day.selectedStay?.price || 0;
        cost += (day.selectedActivities || []).reduce((s, a) => s + (a.price || 0), 0);
        return acc + cost;
    }, 0) || 0;

    return (
        <div className="max-w-[1305px] w-full mx-auto px-6 md:px-10 pt-8 pb-16 relative">

            <ItineraryModal
                detailItem={detailItem}
                detailType={detailType}
                currentImgIndex={currentImgIndex}
                setCurrentImgIndex={setCurrentImgIndex}
                closeDetails={closeDetails}
            />

            <div className="flex flex-col lg:flex-row gap-10 xl:gap-14 w-full">

                {/* ── LEFT: Day Planner ── */}
                <div className="flex-1 w-full space-y-8">

                    {/* Header */}
                    <div className='md:hidden'>
                        <span className="inline-block text-xs font-bold text-[#FF385C] tracking-wider uppercase mb-2">
                            Confirmed Itinerary
                        </span>
                        <h1 className="text-3xl font-bold text-gray-900 tracking-tight mb-2 capitalize">
                            {itinerary?.data?.source} → {itinerary?.data?.destination}
                        </h1>
                        <div className="flex flex-wrap items-center gap-3 text-sm text-gray-500">
                            <span className="flex items-center gap-1.5">
                                <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                                {itinerary?.data?.days?.length} Day{itinerary?.data?.days?.length !== 1 ? 's' : ''}
                            </span>
                            <span className="text-gray-300">·</span>
                            <span className="flex items-center gap-1.5">
                                <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                </svg>
                                {itinerary?.data?.totalDistance} km
                            </span>
                            <span className="text-gray-300">·</span>
                            <span className="flex items-center gap-1.5 capitalize">
                                <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8H2a2 2 0 00-2 2v10a2 2 0 002 2h3" />
                                </svg>
                                By {travelModeLabel(itinerary?.data?.travelMode)}
                            </span>
                        </div>
                    </div>

                    {/* Day Cards */}
                    <div className="relative space-y-10 w-full">
                        {itinerary?.data?.days?.map((day) => (
                            <div
                                key={day._id || day.dayIndex}
                                className="relative bg-white p-6 md:p-8 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow w-full"
                            >
                                {/* Day Header */}
                                <div className="flex flex-col md:flex-row justify-between md:items-end mb-8 gap-4 border-b border-gray-100 pb-5">
                                    <div>
                                        <span className="inline-block text-xs font-bold text-[#FF385C] tracking-wider uppercase mb-2">
                                            Day {day.dayIndex}
                                        </span>
                                        <h2 className="text-xl font-semibold text-gray-900 capitalize">
                                            {day.startLocation}
                                            <span className="text-gray-400 font-normal mx-2">→</span>
                                            {day.endLocation}
                                        </h2>
                                    </div>
                                    <div className="text-sm text-gray-500 font-medium">
                                        {day.distanceCovered > 0 ? `${day.distanceCovered} km` : 'Rest Day'}
                                    </div>
                                </div>

                                {/* Content Row: Stay & Activities */}
                                <div className="flex flex-col lg:flex-row gap-8 w-full">

                                    {/* Stay Column */}
                                    <div className="flex-1 w-full">
                                        {day.selectedStay && (
                                            <div className="mb-8 w-full">
                                                <div className="flex items-center justify-between mb-4">
                                                    <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                                                        <svg className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m3-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                                                        </svg>
                                                        Booked Stay
                                                    </h3>
                                                    <span className="text-xs text-emerald-600 font-semibold bg-emerald-50 px-2 py-1 rounded-md border border-emerald-100">
                                                        Confirmed
                                                    </span>
                                                </div>
                                                <div className="grid grid-cols-1 gap-4">
                                                    <ItineraryListingCard
                                                        key={day.selectedStay._id}
                                                        stay={day.selectedStay}
                                                        dayIndex={day.dayIndex}
                                                        isSelected={false}
                                                        onSelect={noop}
                                                        onOpenDetails={openDetails}
                                                    />
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                    {/* Activities Column */}
                                    <div className="flex-1 w-full">
                                        {day.selectedActivities?.length > 0 && (
                                            <div className="w-full">
                                                <div className="flex items-center justify-between mb-4">
                                                    <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                                                        <svg className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                                        </svg>
                                                        Planned Activities
                                                    </h3>
                                                    <span className="text-xs text-gray-500 font-medium bg-gray-100 px-2 py-1 rounded-md">
                                                        {day.selectedActivities.length} Booked
                                                    </span>
                                                </div>
                                                {/* Adjusted grid to prevent squashing when side-by-side */}
                                                <div className="grid grid-cols-1 gap-3">
                                                    {day.selectedActivities.map(act => (
                                                        <ItineraryActivityCard
                                                            key={act._id}
                                                            act={act}
                                                            dayIndex={day.dayIndex}
                                                            isSelected={false}
                                                            onToggle={noop}
                                                            onOpenDetails={openDetails}
                                                        />
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Empty state for rest day */}
                                {!day.selectedStay && !day.selectedActivities?.length && (
                                    <div className="text-center py-8 text-gray-400 text-sm">
                                        <svg className="w-8 h-8 mx-auto mb-2 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                        Free day — no bookings scheduled
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>

                {/* ── RIGHT: Summary Panel ── */}
                <SideSummary itinerary={itinerary?.data} totalSpent={totalSpent} />
            </div>
        </div>
    );
}