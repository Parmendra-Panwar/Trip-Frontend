import { Link } from 'react-router-dom';

const ListingCard = ({ data }) => {
    const id = data._id || data.id;

    // Logic: Agar images array hai toh uska 1st element lo, 
    // nahi toh purana data.image.url dekho, ya fir direct data.image (dummy ke liye)
    const primaryImage = (data.images && data.images.length > 0 && data.images[0])
        ? data.images[0].url
        : (data.image?.url || data.image || "https://via.placeholder.com/400");

    return (
        <Link to={`/listing/${id}`} className="group cursor-pointer">
            <div className="flex flex-col gap-3">
                <div className="relative aspect-square overflow-hidden rounded-2xl bg-slate-100 shadow-md">
                    <img
                        src={primaryImage}
                        alt={data.title}
                        className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                </div>

                <div className="flex flex-col">
                    <div className="flex justify-between items-start">
                        <h3 className="font-bold text-slate-800 text-base line-clamp-1">{data.title}</h3>
                        <div className="flex items-center gap-1 text-sm shrink-0">
                            <span className="text-yellow-500">★</span>
                            <span className="font-semibold text-slate-700">4.8</span>
                        </div>
                    </div>
                    <p className="text-slate-500 text-sm">{data.location}, {data.country || 'India'}</p>
                    <div className="mt-1 flex items-center gap-1">
                        <span className="font-bold text-slate-900 text-lg">₹{data.price.toLocaleString('en-IN')}</span>
                        <span className="text-slate-500 text-sm">/ night</span>
                    </div>
                </div>
            </div>
        </Link>
    );
};

export default ListingCard;