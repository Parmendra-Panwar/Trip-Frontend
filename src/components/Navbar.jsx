import { useSelector } from 'react-redux';
import { Link, useLocation } from 'react-router-dom';

const Navbar = () => {
    const { user } = useSelector((state) => state.auth);
    const location = useLocation();

    const isBusiness = user?.roles?.includes('BUSINESS');
    const isNormal = user?.roles?.includes('NORMAL');

    // Helper to style active links
    const linkStyle = (path) =>
        `text-sm font-semibold transition-all duration-200 ${location.pathname === path ? 'text-blue-600' : 'text-slate-600 hover:text-blue-600'
        }`;

    return (
        <nav className="bg-white/80 backdrop-blur-md border-b border-slate-100 px-4 sm:px-8 py-3 flex justify-between items-center sticky top-0 z-50">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2 group">
                <span className="text-xl font-black text-slate-900 tracking-tight">
                    TRIPLINKER<span className="text-blue-600">.</span>
                </span>
            </Link>

            <div className="flex items-center gap-3 sm:gap-8">
                {user ? (
                    <div className="flex items-center gap-6">
                        {/* Dynamic Actions based on Role */}
                        <div className="hidden md:flex items-center gap-6 border-r border-slate-200 pr-6">
                            {isBusiness && (
                                <>
                                    <Link to="/createlisting" className={linkStyle('/createlisting')}>
                                        List Property
                                    </Link>
                                    <Link to="/createactivity" className={linkStyle('/createactivity')}>
                                        Add Activity
                                    </Link>
                                </>
                            )}
                            {isNormal && (
                                <Link to="/post-trip" className={linkStyle('/post-trip')}>
                                    Post a Trip
                                </Link>
                            )}
                        </div>

                        {/* Profile Section */}
                        <Link
                            to={`/profile/${user.username}`}
                            className="flex items-center gap-3 pl-2 group"
                        >
                            <div className="text-right hidden sm:block">
                                <p className="text-xs font-bold text-slate-900 leading-none">
                                    {user.username}
                                </p>
                                <p className="text-[10px] text-slate-400 font-medium uppercase tracking-wider">
                                    {isBusiness ? 'Business' : 'Traveler'}
                                </p>
                            </div>
                            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-400 p-[2px] group-hover:shadow-lg group-hover:shadow-blue-200 transition-all">
                                <div className="w-full h-full rounded-full bg-white flex items-center justify-center overflow-hidden">
                                    {/* Fallback to Initial if no image */}
                                    <span className="text-blue-600 font-bold text-sm">
                                        {user.username.charAt(0).toUpperCase()}
                                    </span>
                                </div>
                            </div>
                        </Link>
                    </div>
                ) : (
                    <div className="flex items-center gap-2">
                        <Link
                            to="/login"
                            className="px-4 py-2 text-sm font-bold text-slate-600 hover:text-blue-600 transition-colors"
                        >
                            Log in
                        </Link>
                        <Link
                            to="/signup"
                            className="bg-slate-900 text-white px-5 py-2.5 rounded-xl text-sm font-bold hover:bg-blue-600 hover:shadow-xl hover:shadow-blue-200 transition-all active:scale-95"
                        >
                            Get Started
                        </Link>
                    </div>
                )}
            </div>
        </nav>
    );
};

export default Navbar;