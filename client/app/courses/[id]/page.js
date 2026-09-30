'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import axios from 'axios';
import { useAuth } from '../../../context/AuthContext';
import Link from 'next/link';

export default function CourseDetailPage() {
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [completedLessons, setCompletedLessons] = useState([]);
  const params = useParams();
  const { user } = useAuth();

  useEffect(() => {
    fetchCourseDetails();
    if (user) {
      fetchProgress();
    }
  }, [params.id]);

  const fetchCourseDetails = async () => {
    try {
      const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/courses/${params.id}`);
      setCourse(res.data);
    } catch (err) {
      console.error('Failed to fetch course:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchProgress = async () => {
    try {
      const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/progress/${params.id}`);
      setCompletedLessons(res.data.completedLessons || []);
    } catch (err) {
      console.error('Failed to fetch progress:', err);
    }
  };

  const markLessonComplete = async (lessonId) => {
    try {
      await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/progress/complete`, {
        courseId: params.id,
        lessonId
      });
      fetchProgress();
    } catch (err) {
      console.error('Failed to mark complete:', err);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-xl">Loading course...</div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold">Course not found</h1>
        <Link href="/courses" className="text-blue-500 hover:underline mt-4 inline-block">
          ← Back to Courses
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Link href="/courses" className="text-blue-500 hover:underline mb-4 inline-block">
        ← Back to Courses
      </Link>

      {/* Course Info Card */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h1 className="text-3xl font-bold mb-4">{course.title}</h1>
        <p className="text-gray-600 mb-4">{course.description}</p>
        <p className="text-sm text-gray-500">
          Instructor: {course.teacherId?.name || 'Unknown'}
        </p>
      </div>

      {/* ✅ Meeting Link Section (newly added) */}
      {course.meetingLink && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
          <div className="flex items-center gap-3 mb-4">
            <svg className="w-8 h-8 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
            <h2 className="text-2xl font-semibold text-blue-700">Live Meeting Room</h2>
          </div>
          <p className="text-gray-700 mb-4 text-lg">
            Join <strong>{course.teacherId?.name}</strong>'s live class session:
          </p>
          <div className="flex flex-wrap gap-4 items-center">
            <a
              href={course.meetingLink}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-green-500 text-white px-8 py-3 rounded-lg hover:bg-green-600 font-semibold transition shadow-md"
            >
              🎥 Join Meeting Now
            </a>
            <span className="text-sm text-gray-500 break-all bg-white px-3 py-2 rounded border">
               {course.meetingLink}
            </span>
          </div>
        </div>
      )}

      {/* Lessons Section */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold mb-6">Course Lessons</h2>
        
        {course.lessons && course.lessons.length > 0 ? (
          <div className="space-y-4">
            {course.lessons.map((lesson, index) => {
              const isCompleted = completedLessons.some(
                (cl) => cl._id === lesson._id || cl === lesson._id
              );

              return (
                <div
                  key={index}
                  className={`border rounded-lg p-4 ${
                    isCompleted ? 'bg-green-50 border-green-200' : 'bg-gray-50'
                  }`}
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="text-lg font-semibold">
                        {index + 1}. {lesson.title}
                      </h3>
                      {lesson.textContent && (
                        <p className="text-gray-600 mt-2">{lesson.textContent}</p>
                      )}
                    </div>
                    
                    {user && user.role === 'student' && (
                      <button
                        onClick={() => markLessonComplete(lesson._id)}
                        className={`px-4 py-2 rounded ${
                          isCompleted
                            ? 'bg-green-500 text-white'
                            : 'bg-blue-500 text-white hover:bg-blue-600'
                        }`}
                      >
                        {isCompleted ? '✓ Completed' : 'Mark Complete'}
                      </button>
                    )}
                  </div>

                  {lesson.videoUrl && (
                    <div className="mt-4">
                      <video
                        controls
                        className="w-full max-w-2xl rounded"
                        src={lesson.videoUrl}
                      >
                        Your browser does not support the video tag.
                      </video>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        ) : (
          <p className="text-gray-500">No lessons available yet.</p>
        )}
      </div>
    </div>
  );
}