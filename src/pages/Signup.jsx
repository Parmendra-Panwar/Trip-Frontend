import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { signupUser, clearError } from '../store/slices/authSlicee'; // signupUser thunk add kar lena
import { useNavigate, Link } from 'react-router-dom';

const Signup = () => {
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        accountType: 'NORMAL'
    });
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { loading, error } = useSelector((state) => state.auth);

    useEffect(() => {
        return () => dispatch(clearError());
    }, [dispatch]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const result = await dispatch(signupUser(formData));
        if (signupUser.fulfilled.match(result)) navigate('/');
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-[80vh]">
            <form onSubmit={handleSubmit} className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md border border-slate-100">
                <h2 className="text-3xl font-bold mb-6 text-slate-800">Create Account</h2>
                <select className="w-full p-3 mb-4 rounded-lg border"
                    onChange={(e) => setFormData({ ...formData, accountType: e.target.value })}
                >
                    <option value="NORMAL">Normal User (Traveler)</option>
                    <option value="BUSINESS">Business (Provider)</option>
                    <option value="MIXED">Mixed (Both)</option>
                </select>
                <input
                    type="text" placeholder="Username" required
                    className="w-full p-3 mb-4 rounded-lg border focus:ring-2 focus:ring-blue-500 outline-none"
                    onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                />
                <input
                    type="email" placeholder="Email" required
                    className="w-full p-3 mb-4 rounded-lg border focus:ring-2 focus:ring-blue-500 outline-none"
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
                <input
                    type="password" placeholder="Password" required
                    className="w-full p-3 mb-6 rounded-lg border focus:ring-2 focus:ring-blue-500 outline-none"
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                />

                <button disabled={loading} className="w-full bg-[#FF385C] text-white py-3 rounded-lg font-semibold hover:bg-[#D90B38] transition-all disabled:opacity-50">
                    {loading ? "Creating..." : "Sign Up"}
                </button>

                {error && <p className="text-red-500 mt-4 text-center text-sm">{error}</p>}

                <p className="mt-4 text-center text-slate-600 text-sm">
                    Already have an account? <Link title="Login" to="/login" className="text-[#FF385C] font-bold">Login</Link>
                </p>
            </form>
        </div>
    );
};

export default Signup;