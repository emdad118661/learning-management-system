'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import axios from 'axios';
import Link from 'next/link';

export default function MeetPage() {
  const params = useParams();
  const [teacher, setTeacher] = useState(null);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchMeetData();
  }, [params.teacherSlug]);

  const fetchMeetData = async () => {
    try {
      const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/meet/${params.teacherSlug}`);
      setTeacher(res.data.teacher);
      setCourses(res.data.courses);
    } catch (err) {
      setError('Teacher not found');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-xl">Loading meeting room...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <h1 className="text-3xl font-bold text-red-500 mb-4">😕 {error}</h1>
        <Link href="/courses" className="text-blue-500 hover:underline">
          ← Back to Courses
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="bg-white rounded-lg shadow-md p-8 mb-8">
        <div className="text-center mb-8">
          <div className="w-24 h-24 bg-blue-500 rounded-full mx-auto mb-4 flex items-center justify-center text-white text-3xl font-bold">
            {teacher?.name?.charAt(0) || 'T'}
          </div>
          <h1 className="text-3xl font-bold mb-2"> {teacher?.name}'s Meeting Room</h1>
          <p className="text-gray-600">Join live classes and meetings</p>
        </div>

        {courses.length > 0 ? (
          <div className="space-y-4">
            <h2 className="text-2xl font-semibold mb-4">Available Courses</h2>
            {courses.map((course) => (
              <div key={course._id} className="border rounded-lg p-4 hover:shadow-md transition">
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="text-xl font-semibold">{course.title}</h3>
                    {course.meetingLink && (
                      <p className="text-gray-600 mt-1">
                        🔗 <span className="text-blue-500">{course.meetingLink}</span>
                      </p>
                    )}
                  </div>
                  {course.meetingLink && (
                    <a
                      href={course.meetingLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-green-500 text-white px-6 py-2 rounded hover:bg-green-600"
                    >
                      Join Meeting
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center text-gray-500 py-10">
            <p>No active courses with meeting links.</p>
          </div>
        )}

        <div className="mt-8 text-center">
          <Link href="/courses" className="text-blue-500 hover:underline">
            ← Browse All Courses
          </Link>
        </div>
      </div>
    </div>
  );
}