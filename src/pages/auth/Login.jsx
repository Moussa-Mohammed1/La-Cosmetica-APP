import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import useAuthStore from "../../stores/auth";
import { getApiErrorMessage, loginService } from "../../services/authService";
export default function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const auth = useAuthStore();
    async function handleSubmit(e) {
        e.preventDefault();
        setLoading(true);
        setMessage("");
        try {
            const { token, user } = await loginService({
                email,
                password,
            });
            auth.login(user, token);
            switch (user?.role) {
                case "admin":
                    navigate('/dashboard');
                    break;
                case "client":
                    navigate('/');
                    break;
                default:
                    navigate('/')
                    break;
            }
        } catch (err) {
            setMessage(getApiErrorMessage(err, "login failed, try again later"));
        } finally {
            setLoading(false)
        }
    }

    return (

        <div className="min-h-screen bg-black flex items-center justify-center p-6">
            <div className="relative w-full max-w-sm  bg-white px-7 py-10 shadow-xl">

                <h1 className="text-center text-5xl font-extrabold text-black mb-10">Login</h1>
                {message && (
                    <div
                        className="text-center p-3 text-sm bg-red-300 text-red-700 border-red-600 border-r rounded-lg"
                    >
                        <p>{message}</p>
                    </div>
                )}
                <form className="space-y-6" onSubmit={handleSubmit}>

                    <div>
                        <label htmlFor="email" className="mb-3 block text-sm text-gray-500">Email</label>
                        <input
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            id="email"
                            type="email"
                            className="h-12 w-full rounded-xl bg-gray-100 px-4 outline-none border border-transparent focus:border-blue-500"
                        />
                    </div>

                    <div>
                        <label htmlFor="password" className="mb-3 block text-sm text-gray-500">Password</label>
                        <input
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            id="password"
                            type="password"
                            className="h-12 w-full rounded-xl bg-gray-100 px-4 outline-none border border-transparent focus:border-blue-500"
                        />
                    </div>
                    <button
                        type="submit"
                        className={`mt-3 h-12 w-full rounded-xl text-xl font-bold text-white transition 
  ${loading ? "bg-blue-300 cursor-not-allowed" : "bg-blue-500 hover:bg-blue-600 cursor-pointer"}`}>
                        {loading ? 'loading ...' : 'LOGIN'}
                    </button>

                    <div className="pt-2 text-center text-sm text-gray-500 space-y-1">
                        <p>
                            Don't have an account?
                            <Link to="/register" className=" pl-2  text-blue-400 hover:underline">Sign up</Link>
                        </p>
                    </div>
                </form>
            </div>

        </div>
    )
}