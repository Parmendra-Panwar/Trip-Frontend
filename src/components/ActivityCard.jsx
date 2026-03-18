import { Link } from 'react-router-dom';

const ActivityCard = ({ data }) => {
    const id = data._id || data.id;

    const primaryImage = (data.images && data.images.length > 0 && data.images[0])
        ? data.images[0].url
        : (data.image?.url || data.image || "https://via.placeholder.com/400");

    return (
        <Link to={`/activity/${id}`} className="group cursor-pointer">
            <div className="flex flex-col gap-3">
                <div className="relative aspect-square overflow-hidden rounded-2xl bg-slate-100 shadow-md">
                    <img
                        src={primaryImage}
                        alt={data.title}
                        className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    {data.difficulty && (
                        <span className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm px-2.5 py-1 rounded-full text-[10px] font-bold shadow-sm uppercase tracking-wider text-slate-800">
                            {data.difficulty}
                        </span>
                    )}
                </div>

                <div className="flex flex-col">
                    <div className="flex justify-between items-start">
                        <h3 className="font-bold text-slate-800 text-base line-clamp-1">{data.title}</h3>
                        <div className="flex items-center gap-1 text-sm shrink-0">
                            <span className="text-yellow-500">★</span>
                            <span className="font-semibold text-slate-700">Explore</span>
                        </div>
                    </div>
                    <p className="text-slate-500 text-sm">{data.location}, {data.country}</p>
                    <p className="text-slate-400 text-xs mt-0.5">{data.duration}</p>
                    <div className="mt-1 flex items-center gap-1">
                        <span className="font-bold text-slate-900 text-lg">₹{data.price.toLocaleString('en-IN')}</span>
                        <span className="text-slate-500 text-sm">/ person</span>
                    </div>
                </div>
            </div>
        </Link>
    );
};

export default ActivityCard;
