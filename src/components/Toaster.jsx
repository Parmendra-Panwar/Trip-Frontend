const Toaster = ({ message }) => {
    return (
        <div className="fixed top-20 right-5 z-50 animate-bounce">
            <div className="bg-white border-l-4 border-blue-600 shadow-xl rounded-lg p-4 flex items-center gap-3">
                <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                <p className="text-sm font-bold text-slate-700">{message}</p>
            </div>
        </div>
    );
};
export default Toaster;