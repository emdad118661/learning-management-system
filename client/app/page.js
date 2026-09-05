'use client';
import { useAuth } from '../context/AuthContext';
import Link from 'next/link';

export default function Home() {
  const { user, logout } = useAuth();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2">
      <main className="flex flex-col items-center justify-center w-full flex-1 px-20 text-center">
        <h1 className="text-6xl font-bold mb-6">
          Welcome to <span className="text-blue-600">LMS Platform</span>
        </h1>
        <p className="text-xl mb-8">
          Learn new skills from expert teachers.
        </p>

        {user ? (
          <div className="flex gap-4">
            <p className="text-lg">Hello, {user.name} ({user.role})</p>
            <button 
              onClick={logout}
              className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
            >
              Logout
            </button>
          </div>
        ) : (
          <div className="flex gap-4">
            <Link href="/login" className="bg-blue-500 text-white px-6 py-3 rounded hover:bg-blue-600">
              Login
            </Link>
            <Link href="/register" className="bg-green-500 text-white px-6 py-3 rounded hover:bg-green-600">
              Register
            </Link>
          </div>
        )}
      </main>
    </div>
  );
}