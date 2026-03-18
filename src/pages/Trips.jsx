import AllTrip from '../components/AllTrip';

const Trips = () => {
    return (
        <div className="pb-32 min-h-screen bg-white">
            {/* Massive Brand Statement Hero */}
            <div className="max-w-[1440px] mx-auto px-6 md:px-10 pt-8 pb-16">
                <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
                    <div className="flex-1 w-full relative z-10 pt-10">
                        <span className="text-[#FF385C] font-extrabold tracking-widest text-[11px] mb-4 block uppercase flex items-center gap-2">
                            <span className="w-6 h-[2px] bg-[#FF385C] rounded-full"></span> The triplinker standard
                        </span>
                        <h1 className="text-[54px] lg:text-[72px] font-[800] leading-[1.05] tracking-tighter text-[#222222] mb-6">
                            Belong <br className="hidden lg:block" /> anywhere.
                        </h1>
                        <p className="text-[#717171] text-[18px] lg:text-[22px] leading-relaxed max-w-lg mb-8 font-light">
                            Discover stays, trips, and experiences designed for the modern explorer. Authenticity included.
                        </p>

                        {/* Premium Search Element */}
                        <div className="bg-white border border-[#EBEBEB] p-2 pl-6 rounded-full shadow-[0_6px_16px_rgba(0,0,0,0.06)] flex items-center max-w-xl w-full hover:shadow-[0_6px_20px_rgba(0,0,0,0.12)] transition-shadow duration-300">
                            <div className="flex-1">
                                <p className="text-[12px] font-[800] text-[#222222] uppercase tracking-wide">Where</p>
                                <input
                                    type="text"
                                    placeholder="Search destinations"
                                    className="w-full text-[15px] font-[500] text-[#222222] outline-none placeholder-[#717171] bg-transparent mt-0.5"
                                />
                            </div>
                            <button className="w-[50px] h-[50px] bg-[#FF385C] rounded-full flex items-center justify-center text-white ml-2 transition-transform hover:scale-105">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
                            </button>
                        </div>
                    </div>

                    <div className="flex-1 w-full relative">
                        <div className="relative aspect-[4/3] rounded-[2rem] overflow-hidden shadow-2xl z-10">
                            <img
                                src="https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=1600&q=80"
                                className="w-full h-full object-cover"
                                alt="Paris Architecture"
                            />
                        </div>
                        {/* Abstract Decorators */}
                        <div className="absolute -bottom-10 -left-10 w-64 h-64 bg-[#FF385C]/10 rounded-full blur-3xl -z-10"></div>
                        <div className="absolute -top-10 -right-10 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl -z-10"></div>
                    </div>
                </div>
            </div>

            {/* Feeds Section */}
            <div className="border-t border-[#EBEBEB] bg-[#FAFAFA] pt-4">
                <div className="max-w-[1440px] mx-auto px-6 md:px-10 space-y-12">
                    <AllTrip />
                </div>
            </div>
        </div>
    );
};

export default Trips;