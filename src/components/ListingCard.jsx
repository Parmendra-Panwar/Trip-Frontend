import { Link } from 'react-router-dom';

const ListingCard = ({ data }) => {
    return (
        <Link to={`/listing/${data.id}`} className="group cursor-pointer">
            <div className="flex flex-col gap-3">
                {/* Image Container */}
                <div className="relative aspect-square overflow-hidden rounded-2xl bg-slate-100">
                    <img
                        src={data.image}
                        alt={data.title}
                        className="h-full w-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute top-3 right-3 bg-white/80 backdrop-blur-md p-2 rounded-full shadow-sm hover:bg-white">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-red-500">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
                        </svg>
                    </div>
                </div>

                {/* Content */}
                <div className="flex flex-col">
                    <div className="flex justify-between items-center">
                        <h3 className="font-bold text-slate-800 truncate">{data.title}</h3>
                        <div className="flex items-center gap-1 text-sm">
                            <span className="font-semibold text-slate-900">★ 4.8</span>
                        </div>
                    </div>
                    <p className="text-slate-500 text-sm">{data.location}</p>
                    <div className="mt-2 flex items-center gap-1">
                        <span className="font-bold text-slate-900">₹{data.price}</span>
                        <span className="text-slate-500 text-sm">/ night</span>
                    </div>
                </div>
            </div>
        </Link>
    );
};

export default ListingCard;