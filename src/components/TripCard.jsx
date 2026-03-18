import { Link } from 'react-router-dom';

const TripCard = ({ data }) => {
    const id = data._id || data.id;

    const primaryImage = (data.images && data.images.length > 0 && data.images[0])
        ? data.images[0].url
        : (data.image?.url || data.image || "https://images.unsplash.com/photo-1522083165195-3424ed129620?auto=format&fit=crop&w=400&q=60");

    return (
        <Link to={`/trip/${id}`} className="group cursor-pointer">
            <div className="flex flex-col gap-3">
                <div className="relative aspect-square overflow-hidden rounded-2xl bg-slate-100 shadow-md">
                    <img
                        src={primaryImage}
                        alt={data.title}
                        className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <span className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm px-2.5 py-1 rounded-full text-[10px] font-bold shadow-sm uppercase tracking-wider text-indigo-700">
                        Trip
                    </span>
                </div>

                <div className="flex flex-col">
                    <div className="flex justify-between items-start">
                        <h3 className="font-bold text-slate-800 text-base line-clamp-1">{data.title}</h3>
                        <div className="flex items-center gap-1 text-sm shrink-0">
                            <span className="text-yellow-500">★</span>
                            <span className="font-semibold text-slate-700">Explore</span>
                        </div>
                    </div>
                    <p className="text-slate-500 text-sm">{data.location || "Unknown Location"}</p>
                    {data.tags && data.tags.length > 0 && (
                        <div className="mt-1.5 flex gap-1.5 flex-wrap">
                            {data.tags.slice(0, 3).map(tag => (
                                <span key={tag} className="text-[10px] px-1.5 py-0.5 bg-slate-100 text-slate-500 rounded uppercase font-bold">
                                    #{tag}
                                </span>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </Link>
    );
};

export default TripCard;
