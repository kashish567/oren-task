"use client"
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { login } from "@/redux/slice/authSlice";
import axiosInstance from "@/utils/axiosInstance";
import { isAxiosError } from "axios"; // Import isAxiosError directly
import Link from "next/link";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const dispatch = useDispatch();

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!emailRegex.test(email)) {
      setError("Please enter a valid email address.");
      return;
    }

    try {
      const res = await axiosInstance.post("/api/signin", { email, password });

      if (res.data.success) {
        const { accessToken, email } = res.data;
        localStorage.setItem("accessToken", accessToken);

        const user = { email };
        dispatch(login(user));

        router.push("/dashboard");
      } else {
        setError("Invalid credentials");
      }
    } catch (error) {
      if (isAxiosError(error)) {
        if (error.response && error.response.status === 400) {
          setError("Invalid credentials");
        } else {
          setError(error.response?.data.message || "An error occurred. Please try again.");
        }
      } else {
        setError("An unexpected error occurred. Please try again.");
      }
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-50">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md p-6 bg-white rounded shadow-md"
      >
        <h2 className="text-2xl font-semibold text-center text-orenBlue">
          Login
        </h2>
        {error && <p className="text-red-500 text-sm text-center">{error}</p>}
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          className="w-full p-2 mt-4 border rounded-md"
          required
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          className="w-full p-2 mt-4 border rounded-md"
          required
        />
        <button
          type="submit"
          className="w-full px-4 py-2 mt-4 font-semibold text-white bg-orenBlue rounded-md"
        >
          Login
        </button>

        <p className="mt-4 text-center">
          Don&apos;t have an account?{" "}
          <Link href="/signup" className="text-orenBlue hover:underline">
            Sign up
          </Link>
        </p>
      </form>
    </div>
  );
};

export default LoginPage;
