'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  // Regex for validating email format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  useEffect(() => {
    if(localStorage.getItem('user1')) {
      router.push('/dashboard');
    }
    
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null); // Clear any previous errors

    // Validate email format using regex
    if (!emailRegex.test(email)) {
      setError('Please enter a valid email address.');
      return;
    }

    // Simple login logic for demo purposes
    if (email === 'kashishworks7@gmail.com' && password === 'kashish') {
      // Store user identifier in local storage
      localStorage.setItem('user1', 'true');
      // Redirect to dashboard after successful login
      router.push('/dashboard');
    } else {
      setError('Invalid credentials');
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-50">
      <form onSubmit={handleSubmit} className="w-full max-w-md p-6 bg-white rounded shadow-md">
        <h2 className="text-2xl font-semibold text-center text-orenBlue">Login</h2>
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
      </form>
    </div>
  );
};

export default LoginPage;
