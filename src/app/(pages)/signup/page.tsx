'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import Link from 'next/link';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';

const SignupPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  // Regex for validating email format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const isAuthenticated = useSelector(
    (state: RootState) => state.auth.isAuthenticated
  );

  useEffect(() => {
    if (isAuthenticated) {
      router.push("/dashboard");
    }
  }, [isAuthenticated, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null); // Clear any previous errors

    // Validate email format using regex
    if (!emailRegex.test(email)) {
      setError('Please enter a valid email address.');
      return;
    }

    // Simple login logic for demo purposes
    const res = await axios.post('/api/signup', { email, password });
    if (res.data.success) {
      
      // Redirect to dashboard after successful login
      router.push('/dashboard');
    } else {
      setError('Invalid credentials');
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-50">
      <form onSubmit={handleSubmit} className="w-full max-w-md p-6 bg-white rounded shadow-md">
        <h2 className="text-2xl font-semibold text-center text-orenBlue">Signup</h2>
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
          Signup
        </button>
        <p className="mt-4 text-center">
          Already have an account?{' '}
          <Link href="/login" className="text-orenBlue hover:underline">
            Login
          </Link>
        </p>
      </form>
    </div>
  );
};

export default SignupPage;
