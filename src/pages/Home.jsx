import AllListing from '../components/AllListing';

const Home = () => {
    return (
        <div className="space-y-8 pb-10">
            {/* Hero Section */}
            <section className="relative h-[400px] rounded-3xl overflow-hidden flex items-center justify-center">
                <img
                    src="https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=1200&q=70"
                    className="absolute inset-0 w-full h-full object-cover brightness-50"
                    alt="Travel"
                />
                <div className="relative text-center text-white px-4">
                    <h1 className="text-4xl md:text-6xl font-black mb-4 tracking-tight">Find Your Next Adventure.</h1>
                    <p className="text-lg md:text-xl opacity-90 mb-8 font-medium">Explore the best stays and trips curated for you.</p>

                    {/* Search Bar */}
                    <div className="bg-white p-2 rounded-full flex items-center max-w-2xl mx-auto shadow-2xl">
                        <input
                            type="text"
                            placeholder="Search destinations..."
                            className="flex-1 px-6 py-2 text-slate-800 outline-none rounded-full"
                        />
                        <button className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-full font-bold transition-all">
                            Search
                        </button>
                    </div>
                </div>
            </section>

            <AllListing />
        </div>
    );
};

export default Home;