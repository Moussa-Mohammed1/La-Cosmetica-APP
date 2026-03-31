import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getApiErrorMessage, registerService } from "../../services/authService";

export default function Register() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [passwordConfirmation, setPasswordConfirmation] = useState("");
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);
    const [isError, setIsError] = useState(false);
    const navigate = useNavigate();

    async function handleSubmit(e) {
        e.preventDefault();
        setMessage("");

        if (!name || !email || !password || !passwordConfirmation) {
            setIsError(true);
            setMessage("All fields are required");
            return;
        }

        if (password !== passwordConfirmation) {
            setIsError(true);
            setMessage("Passwords do not match");
            return;
        }

        try {
            setLoading(true);
            await registerService({
                name,
                email,
                password,
                password_confirmation: passwordConfirmation,
            });
            setIsError(false);
            setMessage("Registration successful, redirecting to login...");
            setTimeout(() => {
                navigate("/login");
            }, 900);
        } catch (err) {
            setIsError(true);
            setMessage(getApiErrorMessage(err, "Register failed, try again later"));
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="h-screen overflow-hidden bg-black flex items-center justify-center p-4 sm:p-6">
            <div className="relative w-full max-w-sm  bg-white px-6 py-6 shadow-xl sm:px-7 sm:py-7">
                <h1 className="text-center text-2xl font-extrabold text-black">Register</h1>

                {message && (
                    <div
                        className={`mt-3 rounded-lg p-2 text-center text-sm ${
                            isError
                                ? "border border-red-300 bg-red-100 text-red-700"
                                : "border border-green-300 bg-green-100 text-green-700"
                        }`}
                    >
                        {message}
                    </div>
                )}

                <form className="mt-4 space-y-3" onSubmit={handleSubmit}>
                    <div>
                        <label htmlFor="name" className="mb-1 block text-sm text-gray-500">
                            Name
                        </label>
                        <input
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            id="name"
                            type="text"
                            placeholder=""
                            autoComplete="name"
                            className="h-10 w-full rounded-xl border border-transparent bg-gray-100 px-4 outline-none focus:border-blue-500"
                        />
                    </div>
                    <div>
                        <label htmlFor="email" className="mb-1 block text-sm text-gray-500">
                            Email
                        </label>
                        <input
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            id="email"
                            type="email"
                            placeholder=""
                            autoComplete="email"
                            className="h-10 w-full rounded-xl border border-transparent bg-gray-100 px-4 outline-none focus:border-blue-500"
                        />
                    </div>

                    <div>
                        <label htmlFor="password" className="mb-1 block text-sm text-gray-500">
                            Password
                        </label>
                        <input
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            id="password"
                            type="password"
                            placeholder=""
                            autoComplete="new-password"
                            className="h-10 w-full rounded-xl border border-transparent bg-gray-100 px-4 outline-none focus:border-blue-500"
                        />
                    </div>

                    <div>
                        <label htmlFor="password_confirmation" className="mb-1 block text-sm text-gray-500">
                            Confirm Password
                        </label>
                        <input
                            value={passwordConfirmation}
                            onChange={(e) => setPasswordConfirmation(e.target.value)}
                            id="password_confirmation"
                            type="password"
                            placeholder=""
                            autoComplete="new-password"
                            className="h-10 w-full rounded-xl border border-transparent bg-gray-100 px-4 outline-none focus:border-blue-500"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className={`mt-1 h-10 w-full rounded-xl text-base font-bold text-white transition ${
                            loading
                                ? "cursor-not-allowed bg-blue-300"
                                : "cursor-pointer bg-blue-500 hover:bg-blue-600"
                        }`}
                    >
                        {loading ? "SIGNING UP..." : "SIGN UP"}
                    </button>

                    <div className="pt-1 text-center text-sm text-gray-500">
                        <p>
                            Already have an account
                            <Link to="/login" className=" pl-2 text-blue-400 hover:underline">
                                Sign in
                            </Link>
                        </p>
                    </div>
                </form>
            </div>
        </div>
    )

}