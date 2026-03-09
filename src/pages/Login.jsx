import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { loginUser, clearError } from '../store/slices/authSlice';
import { useNavigate } from 'react-router-dom';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { loading, error } = useSelector((state) => state.auth);

    // On Component unmount or page change clear errors 
    useEffect(() => {
        return () => { if (error) dispatch(clearError()); };
    }, [dispatch, error]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const result = await dispatch(loginUser({ email, password }));
            if (loginUser.fulfilled.match(result)) {
                navigate('/'); // On Success Redirect to Home 
            }
        } catch (err) {
            console.log("Login failed locally:", err);
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-[80vh]">
            <form onSubmit={handleSubmit} className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md border border-slate-100">
                <h2 className="text-3xl font-bold mb-6 text-slate-800">Welcome Back</h2>

                <input
                    type="email" placeholder="Email"
                    className="w-full p-3 mb-4 rounded-lg border focus:ring-2 focus:ring-blue-500 outline-none"
                    onChange={(e) => setEmail(e.target.value)}
                />

                <input
                    type="password" placeholder="Password"
                    className="w-full p-3 mb-6 rounded-lg border focus:ring-2 focus:ring-blue-500 outline-none"
                    onChange={(e) => setPassword(e.target.value)}
                />

                <button
                    disabled={loading}
                    className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-all disabled:opacity-50"
                >
                    {loading ? "Verifying..." : "Login"}
                </button>

                {error && <p className="text-red-500 mt-4 text-center text-sm">{error}</p>}
            </form>
        </div>
    );
};

export default Login;