import { ListingImage } from './FallbackImage';

export default function ItineraryListingCard({ stay, dayIndex, isSelected, onSelect, onOpenDetails }) {
    const imageUrl = stay.images?.[0]?.url || "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=400&q=80";

    return (
        <div
            onClick={() => onSelect(dayIndex, isSelected && dayIndex === 1 ? null : stay)}
            className={`relative overflow-hidden rounded-xl border-2 cursor-pointer transition-all group ${isSelected ? 'border-[#FF385C] shadow-md' : 'border-gray-100 hover:border-gray-300 hover:shadow-sm'}`}
        >
            <div className="h-44 w-full overflow-hidden relative">
                <ListingImage src={imageUrl} alt={stay.title} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <button
                        onClick={(e) => onOpenDetails(e, stay, 'listing')}
                        className="bg-white text-gray-900 text-xs font-bold px-4 py-2 rounded-full shadow-lg transform translate-y-4 group-hover:translate-y-0 transition-transform"
                    >
                        View Details
                    </button>
                </div>
            </div>
            <div className="p-4 bg-white">
                <div className="flex justify-between items-start gap-2 mb-1">
                    <h4 className="font-medium text-gray-900 text-sm truncate">{stay.title}</h4>
                </div>
                {stay.category && <p className="text-xs text-gray-500 mb-2 truncate">{stay.category}</p>}
                <p className="text-gray-900 font-semibold text-sm">₹{stay.price}</p>
            </div>
            {isSelected && (
                <div className="absolute top-3 right-3 bg-[#FF385C] text-white p-1 rounded-full shadow-sm z-10">
                    <svg className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
                </div>
            )}
        </div>
    );
}