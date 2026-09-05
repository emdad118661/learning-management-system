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
    // fetch again after progress update.
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

      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h1 className="text-3xl font-bold mb-4">{course.title}</h1>
        <p className="text-gray-600 mb-4">{course.description}</p>
        <p className="text-sm text-gray-500">
          Instructor: {course.teacherId?.name || 'Unknown'}
        </p>
      </div>

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