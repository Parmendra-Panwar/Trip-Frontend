import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../store/slices/authSlice';
import { Link, useNavigate } from 'react-router-dom';

const Navbar = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { user } = useSelector((state) => state.auth);

    const handleLogout = () => {
        dispatch(logout());
        navigate('/');
    };

    return (
        <nav className="bg-white border-b border-slate-200 px-6 py-4 flex justify-between items-center sticky top-0 z-50">
            <Link to="/" className="text-2xl font-black text-blue-600 tracking-tighter">
                TRIPLINKER <span className="text-slate-400 font-light">.</span>
            </Link>

            <div className="flex items-center gap-6">
                {user ? (
                    <div className="flex items-center gap-4">
                        <span className="text-slate-700 font-medium hidden sm:block">
                            Hi, {user.username}
                        </span>
                        <button
                            onClick={handleLogout}
                            className="bg-slate-100 text-slate-700 px-4 py-2 rounded-full font-bold hover:bg-red-50 hover:text-red-600 transition-colors"
                        >
                            Logout
                        </button>
                    </div>
                ) : (
                    <div className="flex gap-4">
                        <Link to="/login" className="text-slate-600 font-semibold hover:text-blue-600 py-2">Login</Link>
                        <Link to="/signup" className="bg-blue-600 text-white px-5 py-2 rounded-full font-bold hover:bg-blue-700 transition-all shadow-md">
                            Join Now
                        </Link>
                    </div>
                )}
            </div>
        </nav>
    );
};

export default Navbar;