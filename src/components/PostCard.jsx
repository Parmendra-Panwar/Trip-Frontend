const PostCard = ({ title, label }) => {
    return (
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden hover:shadow-lg transition duration-300">
            {/* Dummy Image Placeholder */}
            <div className="h-40 bg-slate-200 w-full object-cover flex items-center justify-center text-slate-400">
                Image
            </div>
            <div className="p-4">
                <span className="text-xs font-bold text-blue-600 uppercase tracking-wider mb-1 block">
                    {label}
                </span>
                <h4 className="font-semibold text-slate-800 truncate">{title}</h4>
            </div>
        </div>
    );
};

export default PostCard;