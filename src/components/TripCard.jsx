import { Link } from 'react-router-dom';
import { useFavorites } from '../hooks/useFavorites';
import { TripImage } from './FallbackImage';

const TripCard = ({ data }) => {
    const id = data._id || data.id;
    const { isFavorite, toggleFavorite } = useFavorites('trip');
    const primaryImage = (data.images && data.images.length > 0 && data.images[0])
        ? data.images[0].url
        : (data.image?.url || data.image || "https://images.unsplash.com/photo-1522083165195-3424ed129620?auto=format&fit=crop&w=400&q=60");

    return (
        <Link to={`/trip/${id}`} className="group cursor-pointer block">
            <div className="relative aspect-[20/15] overflow-hidden rounded-xl bg-[#EBEBEB] mb-3">
                <TripImage
                    src={primaryImage}
                    alt={data.title}
                    className="h-full w-full object-cover group-hover:scale-[1.03] transition-transform duration-500 ease-[cubic-bezier(0.2,0.8,0.2,1)]"
                />
                <span className="absolute top-3 left-3 bg-white/95 backdrop-blur-md px-3 py-1.5 rounded-full text-[11px] font-[800] shadow-sm uppercase tracking-wider text-[#222222]">
                    Trip
                </span>
                <button
                    onClick={(e) => toggleFavorite(e, id)}
                    className="absolute top-3 right-3 p-2 group-active:scale-90 transition-transform z-10"
                >
                    <svg className={`w-[28px] h-[28px] drop-shadow-md transition-colors ${isFavorite(id) ? 'text-red-500 fill-red-500' : 'text-white/80 hover:text-white'}`} fill={isFavorite(id) ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path></svg>
                </button>
            </div>

            <div className="flex flex-col">
                <div className="flex justify-between items-start gap-2">
                    <h3 className="font-[600] text-[#222222] text-[15px] leading-[19px] truncate">{data.location || "Unknown Location"}</h3>
                    <div className="flex items-center gap-1 shrink-0 mt-[2px]">
                        <svg className="w-3.5 h-3.5 text-[#222222]" fill="currentColor" viewBox="0 0 24 24"><path d="M12 .587l3.668 7.431 8.2 1.151-6.064 5.828 1.58 8.163L12 18.896l-7.384 3.882 1.58-8.163L.132 9.169l8.2-1.151z" /></svg>
                        <span className="font-[400] text-[14px] text-[#222222]">4.8</span>
                    </div>
                </div>
                <p className="text-[#717171] text-[15px] font-[400] mt-0.5 truncate">{data.title}</p>
                {data.tags && data.tags.length > 0 && (
                    <p className="text-[#717171] text-[15px] font-[400] mt-0.5 truncate">
                        {data.tags.slice(0, 3).map(tag => `#${tag}`).join(' • ')}
                    </p>
                )}
            </div>
        </Link>
    );
};

export default TripCard;
