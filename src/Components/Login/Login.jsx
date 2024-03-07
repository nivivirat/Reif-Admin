import { useState, useEffect } from "react";
import { auth } from "../../../firebase"; // Update the path based on your project structure
import { signInWithEmailAndPassword } from "firebase/auth";
import { useNavigate } from "react-router-dom";

export default function Login() {

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState(null);

    const [isLoading, setIsLoading] = useState(false);

    const navigate = useNavigate();

    const handleLogin = async () => {
        try {
            setIsLoading(true);
            await signInWithEmailAndPassword(auth, email, password);
            navigate('/');
        } catch (error) {
            switch (error.code) {
                case "auth/user-not-found":
                    setError("User not found. Please check your email.");
                    break;
                case "auth/wrong-password":
                    setError("Incorrect password. Please try again.");
                    break;
                case "auth/invalid-email":
                    setError("Invalid email address. Please enter a valid email.");
                    break;
                case "auth/invalid-credential":
                    setError("Invalid credentials. Please check your email and password.");
                    break;
                default:
                    setError(error.message);
            }
        } finally {
            setIsLoading(false);
        }
    };    

    return (
        <div className="-mt-[80px] w-[90vw] -pr-10 h-screen">
            {isLoading ? <div>
                .
            </div>
                :
                <div className="lg:h-screen w-screen -ml-10">
                    <div className={`overflow-hidden lg:flex lg:flex-row flex-col-reverse h-full w-full flex items-center justify-center rounded-[20px]`}>

                        <div className="lg:w-2/5 w-full ml-10 mr-10 rounded-[20px]">
                            <section className="">
                                <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto h-full lg:py-0">
                                    <a href="#" className="flex flex-col items-center mb-6 text-2xl font-semibold text-primary">
                                        <img className="w-20 h-20 mr-2" src="https://res.cloudinary.com/dzhdarh4q/image/upload/v1699014385/Reifenhauser/ReifenhauserLogo_hhc7wi.svg" alt="logo" />
                                        Reifenhauser Admin Panel
                                    </a>
                                    <div className="w-full bg-base rounded-lg drop-shadow-2xl shadow-lg lg:mt-0 sm:max-w-md xl:p-0">
                                        <div className="p-6 space-y-4 lg:space-y-6 sm:p-8">
                                            {/* <h1 className="text-[25px] text-primary">{currentRole}</h1> */}
                                            <h1 className="text-xl font-bold leading-tight tracking-tight text-primary lg:text-2xl">
                                                Admin Login
                                            </h1>
                                            <form className="space-y-4 lg:space-y-6" onSubmit={(e) => {
                                                e.preventDefault(); // Prevent the default form submission behavior
                                                handleLogin(); // Call your login function
                                            }}>
                                                <div>
                                                    <label htmlFor="email" className="block mb-2 text-sm font-medium text-primary">Your email</label>
                                                    <input
                                                        type="email"
                                                        name="email"
                                                        id="email"
                                                        className="border border-gray-300 text-white sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 bg-gray-700 placeholder-gray-400 focus:ring-blue-500 focus:border-blue-500"
                                                        placeholder="name@company.com"
                                                        required=""
                                                        onChange={(e) => setEmail(e.target.value)}
                                                    />
                                                </div>
                                                <div>
                                                    <label htmlFor="password" className="block mb-2 text-sm font-medium text-primary">Password</label>
                                                    <input
                                                        type="password"
                                                        name="password"
                                                        id="password"
                                                        placeholder="••••••••"
                                                        className="border border-gray-300 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 bg-gray-700 placeholder-gray-400 text-white focus:ring-blue-500 focus:border-blue-500"
                                                        required=""
                                                        onChange={(e) => setPassword(e.target.value)}
                                                    />
                                                </div>
                                                <div className="flex items-center justify-between">
                                                    <div className="flex items-start">
                                                        {/* <div className="flex items-center h-5">
                                                            <input
                                                                id="remember"
                                                                aria-describedby="remember"
                                                                type="checkbox"
                                                                className="w-4 h-4 border border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-primary-300"
                                                                required=""
                                                            />
                                                        </div> */}
                                                        {/* <div className="ml-3 text-sm">
                                                            <label htmlFor="remember" className="text-gray-500">Remember me</label>
                                                        </div> */}
                                                    </div>
                                                    {/* <a href="#" className="text-sm font-medium text-primary-600 hover:underline">Forgot password?</a> */}
                                                </div>
                                                <button
                                                    type="submit"
                                                    className="w-full text-white bg-primary hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center bg-primary-600 hover:bg-primary-700 focus:ring-primary-800"
                                                >
                                                    Login
                                                </button>
                                                {error && <p style={{ color: "red" }}>{error}</p>}
                                                {/* <p className="text-sm font-light text-gray-500">
                                                    Don’t have an account yet? <a href="/signup" className="font-medium text-primary-600 hover:underline">Sign up</a>
                                                </p> */}
                                            </form>
                                        </div>
                                    </div>
                                </div>
                            </section>
                        </div>
                    </div>
                </div>
            }
        </div>
    );
}
