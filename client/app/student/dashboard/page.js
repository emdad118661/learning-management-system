'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../../context/AuthContext';
import axios from 'axios';
import Link from 'next/link';

export default function StudentDashboard() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [progressData, setProgressData] = useState([]);
  const [dashboardLoading, setDashboardLoading] = useState(true);

  useEffect(() => {
    if (!loading && (!user || user.role !== 'student')) {
      router.push('/');
    }
  }, [user, loading, router]);

  useEffect(() => {
    if (user && user.role === 'student') {
      fetchProgress();
    }
  }, [user]);

  const fetchProgress = async () => {
    try {
      const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/progress/all`);
      setProgressData(res.data);
    } catch (err) {
      console.error('Failed to fetch progress:', err);
    } finally {
      setDashboardLoading(false);
    }
  };

  if (loading || dashboardLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-xl">Loading dashboard...</div>
      </div>
    );
  }

  if (!user || user.role !== 'student') {
    return null;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">My Learning Dashboard</h1>

      {/* Progress Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-blue-500 text-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold">Total Courses</h3>
          <p className="text-4xl font-bold mt-2">{progressData.length}</p>
        </div>
        <div className="bg-green-500 text-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold">Completed Lessons</h3>
          <p className="text-4xl font-bold mt-2">
            {progressData.reduce((sum, item) => sum + item.completedCount, 0)}
          </p>
        </div>
        <div className="bg-purple-500 text-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold">Average Progress</h3>
          <p className="text-4xl font-bold mt-2">
            {progressData.length > 0
              ? Math.round(progressData.reduce((sum, item) => sum + item.percentage, 0) / progressData.length)
              : 0}%
          </p>
        </div>
      </div>

      {/* Course Progress List */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold mb-6">My Courses Progress</h2>

        {progressData.length === 0 ? (
          <div className="text-center py-10">
            <p className="text-gray-500 mb-4">You haven't enrolled in any courses yet.</p>
            <Link
              href="/courses"
              className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600"
            >
              Browse Courses
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {progressData.map((item) => (
              <div key={item.course._id} className="border rounded-lg p-4 hover:shadow-md transition">
                <div className="flex items-center gap-4 mb-4">
                  {item.course.thumbnail && (
                    <img
                      src={item.course.thumbnail}
                      alt={item.course.title}
                      className="w-24 h-16 object-cover rounded"
                    />
                  )}
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold">{item.course.title}</h3>
                    <p className="text-gray-600">
                      {item.completedCount} of {item.totalLessons} lessons completed
                    </p>
                  </div>
                  <div className="text-right">
                    <span className={`text-2xl font-bold ${
                      item.percentage === 100 ? 'text-green-500' : 'text-blue-500'
                    }`}>
                      {item.percentage}%
                    </span>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="w-full bg-gray-200 rounded-full h-4 mb-4">
                  <div
                    className={`h-4 rounded-full transition-all duration-500 ${
                      item.percentage === 100 ? 'bg-green-500' : 'bg-blue-500'
                    }`}
                    style={{ width: `${item.percentage}%` }}
                  ></div>
                </div>

                <div className="flex justify-end">
                  <Link
                    href={`/courses/${item.course._id}`}
                    className="text-blue-500 hover:underline"
                  >
                    {item.percentage === 100 ? 'Review Course →' : 'Continue Learning →'}
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}