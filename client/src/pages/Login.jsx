import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      await login();
      navigate("/");
    } catch (error) {
      console.error("Failed to login", error);
      alert(error.message);
    }
  };

  return (
    <main className="min-h-screen pt-30 flex flex-col items-center justify-center bg-linear-to-br from-blue-400 via-purple-300 to-pink-200 px-2 overflow-hidden">
      <section className="bg-[#181c24] shadow-2xl rounded-4xl p-12 w-full max-w-md md:max-w-2xl text-center">
        <h1 className="text-4xl font-extrabold text-white mb-2">Welcome</h1>
        <p className="mb-12 text-gray-300 text-base sm:text-lg">
          Sign in to access your account
        </p>
        <button
          onClick={handleLogin}
          className="flex items-center justify-center bg-[#23272f] hover:bg-blue-700 text-white font-bold py-2 sm:py-3 md:py-4 px-4 sm:px-8 md:px-12 rounded-full shadow mx-auto w-auto transition border-3 border-green-700 hover:border-red-600 cursor-pointer"
        >
          <span className="flex items-center justify-center gap-2 sm:gap-4 md:gap-6 w-full">
            <img src="/google.png" alt="Google" className="w-6 h-6" />
            <span className="text-base sm:text-lg md:text-xl">
              Continue with Google
            </span>
            <span className="text-xl md:text-2xl">→</span>
          </span>
        </button>
        <div className="mt-12 mb-12 text-white text-sm sm:text-base font-semibold">
          Note : Only IIUC G-Suite mails (
          <span className="font-mono">@ugrad.iiuc.ac.bd</span>) are allowed for
          sign in. Please use your university email!
        </div>
        <div className="mt-8 border-t border-gray-800 pt-4 text-sm sm:text-base text-gray-400">
          By continuing, you agree to our
          <span className="text-green-400 mx-1">
            Terms of Service
          </span>
          and
          <span className="text-green-400 mx-1">
            Privacy Policy
          </span>
          .
        </div>
      </section>
    </main>
  );
}
