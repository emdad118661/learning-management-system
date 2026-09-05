'use client';

import Link from 'next/link';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { user, logout } = useAuth();

  return (
    <nav className="bg-gray-800 text-white p-4">
      <div className="container mx-auto flex justify-between items-center">
        <Link href="/" className="text-xl font-bold">
          LMS Platform
        </Link>

        <div className="flex gap-4 items-center">
          <Link href="/" className="hover:text-gray-300">Home</Link>
          <Link href="/courses" className="hover:text-gray-300">Courses</Link>
          <Link href="/calendar" className="hover:text-gray-300">Calendar</Link>
          {user ? (
            <>
              <span className="text-sm text-gray-400">Hi, {user.name}</span>
              {user.role === 'teacher' && (
                <Link href="/teacher/dashboard" className="hover:text-gray-300">Dashboard</Link>
              )}
              {user?.role === 'student' && (
                <Link href="/student/dashboard" className="hover:text-gray-300">My Progress</Link>
              )}
              <button
                onClick={logout}
                className="bg-red-500 px-3 py-1 rounded text-sm hover:bg-red-600"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link href="/login" className="hover:text-gray-300">Login</Link>
              <Link href="/register" className="bg-blue-500 px-3 py-1 rounded text-sm hover:bg-blue-600">
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}