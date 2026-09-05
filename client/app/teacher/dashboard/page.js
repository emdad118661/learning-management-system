'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../../context/AuthContext';
import axios from 'axios';
import Link from 'next/link';


export default function TeacherDashboard() {
    const { user, loading } = useAuth();
    const router = useRouter();
    const [courses, setCourses] = useState([]);
    const [showCreateForm, setShowCreateForm] = useState(false);
    const [showCalendarForm, setShowCalendarForm] = useState(false);
    const [dashboardLoading, setDashboardLoading] = useState(true);
    const [events, setEvents] = useState([]);

    // Create Course Form State
    const [courseData, setCourseData] = useState({
        title: '',
        description: '',
        thumbnail: '',
        lessons: []
    });

    // Calendar Event Form State
    const [eventData, setEventData] = useState({
        title: '',
        description: '',
        eventDate: '',
        courseId: ''
    });

    const [message, setMessage] = useState({ type: '', text: '' });

    // Check if user is teacher
    useEffect(() => {
        if (!loading && (!user || user.role !== 'teacher')) {
            router.push('/');
        }
    }, [user, loading, router]);

    // Fetch teacher's courses
    useEffect(() => {
        if (user && user.role === 'teacher') {
            fetchCourses();
        }
    }, [user]);

    const fetchEvents = async () => {
        try {
            const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/calendar`);
            // Just filter your events.
            const teacherEvents = res.data.filter(event => event.teacherId?._id === user.id);
            setEvents(teacherEvents);
        } catch (err) {
            console.error('Failed to fetch events:', err);
        }
    };
    useEffect(() => {
        if (user && user.role === 'teacher') {
            fetchEvents();
        }
    }, [user])

    const fetchCourses = async () => {
        try {
            const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/courses`);
            // Filter only teacher's courses
            const teacherCourses = res.data.filter(course => course.teacherId?._id === user.id);
            setCourses(teacherCourses);
        } catch (err) {
            console.error('Failed to fetch courses:', err);
        } finally {
            setDashboardLoading(false);
        }
    };


    const handleCreateCourse = async (e) => {
        e.preventDefault();
        setMessage({ type: '', text: '' });

        try {
            await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/courses`, courseData);
            setMessage({ type: 'success', text: 'Course created successfully!' });
            setCourseData({ title: '', description: '', thumbnail: '', lessons: [] });
            setShowCreateForm(false);
            fetchCourses();
        } catch (err) {
            setMessage({ type: 'error', text: err.response?.data?.message || 'Failed to create course' });
        }
    };

    const handleCreateEvent = async (e) => {
        e.preventDefault();
        setMessage({ type: '', text: '' });

        try {
            await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/calendar`, eventData);
            setMessage({ type: 'success', text: 'Calendar event created successfully!' });
            setEventData({ title: '', description: '', eventDate: '', courseId: '' });
            setShowCalendarForm(false);
        } catch (err) {
            setMessage({ type: 'error', text: err.response?.data?.message || 'Failed to create event' });
        }
    };

    const handleDeleteEvent = async (eventId) => {
        if (!confirm('Are you sure you want to delete this event?')) return;

        try {
            await axios.delete(`${process.env.NEXT_PUBLIC_API_URL}/calendar/${eventId}`);
            setMessage({ type: 'success', text: 'Event deleted successfully!' });
            fetchEvents(); // update list
        } catch (err) {
            setMessage({ type: 'error', text: 'Failed to delete event' });
        }
    };

    const handleDeleteCourse = async (courseId) => {
        if (!confirm('Are you sure you want to delete this course?')) return;

        try {
            await axios.delete(`${process.env.NEXT_PUBLIC_API_URL}/courses/${courseId}`);
            setMessage({ type: 'success', text: 'Course deleted successfully!' });
            fetchCourses();
        } catch (err) {
            setMessage({ type: 'error', text: 'Failed to delete course' });
        }
    };

    const handleFileUpload = async (e, field) => {
        const file = e.target.files[0];
        if (!file) return;

        const formData = new FormData();
        formData.append('file', file);

        try {
            const res = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/upload`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });

            if (field === 'thumbnail') {
                setCourseData({ ...courseData, thumbnail: res.data.url });
            }
            // For lesson videos, you can handle similarly
            setMessage({ type: 'success', text: 'File uploaded successfully!' });
        } catch (err) {
            setMessage({ type: 'error', text: 'File upload failed' });
        }
    };

    const addLesson = () => {
        setCourseData({
            ...courseData,
            lessons: [...courseData.lessons, { title: '', videoUrl: '', textContent: '' }]
        });
    };

    const updateLesson = (index, field, value) => {
        const updatedLessons = [...courseData.lessons];
        updatedLessons[index][field] = value;
        setCourseData({ ...courseData, lessons: updatedLessons });
    };

    const removeLesson = (index) => {
        const updatedLessons = courseData.lessons.filter((_, i) => i !== index);
        setCourseData({ ...courseData, lessons: updatedLessons });
    };

    if (loading || dashboardLoading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="text-xl">Loading dashboard...</div>
            </div>
        );
    }

    if (!user || user.role !== 'teacher') {
        return null;
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold">Teacher Dashboard</h1>
                <div className="flex gap-4">
                    <button
                        onClick={() => setShowCreateForm(!showCreateForm)}
                        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                    >
                        {showCreateForm ? 'Cancel' : '+ Create Course'}
                    </button>
                    <button
                        onClick={() => setShowCalendarForm(!showCalendarForm)}
                        className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                    >
                        {showCalendarForm ? 'Cancel' : '+ Add Calendar Event'}
                    </button>
                </div>
            </div>

            {message.text && (
                <div className={`p-4 rounded mb-6 ${message.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                    }`}>
                    {message.text}
                </div>
            )}

            {/* Create Course Form */}
            {showCreateForm && (
                <div className="bg-white rounded-lg shadow-md p-6 mb-8">
                    <h2 className="text-2xl font-bold mb-4">Create New Course</h2>
                    <form onSubmit={handleCreateCourse}>
                        <div className="mb-4">
                            <label className="block text-gray-700 mb-2">Course Title</label>
                            <input
                                type="text"
                                value={courseData.title}
                                onChange={(e) => setCourseData({ ...courseData, title: e.target.value })}
                                className="w-full px-3 py-2 border rounded focus:outline-none focus:border-blue-500"
                                required
                            />
                        </div>

                        <div className="mb-4">
                            <label className="block text-gray-700 mb-2">Description</label>
                            <textarea
                                value={courseData.description}
                                onChange={(e) => setCourseData({ ...courseData, description: e.target.value })}
                                className="w-full px-3 py-2 border rounded focus:outline-none focus:border-blue-500"
                                rows="4"
                                required
                            />
                        </div>

                        <div className="mb-4">
                            <label className="block text-gray-700 mb-2">Thumbnail Image</label>
                            <input
                                type="file"
                                onChange={(e) => handleFileUpload(e, 'thumbnail')}
                                className="w-full px-3 py-2 border rounded"
                                accept="image/*"
                            />
                            {courseData.thumbnail && (
                                <p className="text-green-600 mt-2">✓ Thumbnail uploaded</p>
                            )}
                        </div>

                        <div className="mb-4">
                            <div className="flex justify-between items-center mb-2">
                                <label className="block text-gray-700">Lessons</label>
                                <button
                                    type="button"
                                    onClick={addLesson}
                                    className="text-blue-500 hover:underline"
                                >
                                    + Add Lesson
                                </button>
                            </div>

                            {courseData.lessons.map((lesson, index) => (
                                <div key={index} className="border p-4 rounded mb-4 bg-gray-50">
                                    <div className="flex justify-between mb-2">
                                        <span className="font-semibold">Lesson {index + 1}</span>
                                        <button
                                            type="button"
                                            onClick={() => removeLesson(index)}
                                            className="text-red-500 hover:underline"
                                        >
                                            Remove
                                        </button>
                                    </div>
                                    <input
                                        type="text"
                                        placeholder="Lesson Title"
                                        value={lesson.title}
                                        onChange={(e) => updateLesson(index, 'title', e.target.value)}
                                        className="w-full px-3 py-2 border rounded mb-2"
                                        required
                                    />
                                    <textarea
                                        placeholder="Lesson Content (Text)"
                                        value={lesson.textContent}
                                        onChange={(e) => updateLesson(index, 'textContent', e.target.value)}
                                        className="w-full px-3 py-2 border rounded mb-2"
                                        rows="2"
                                    />
                                    <div className="mb-2">
                                        <label className="block text-sm text-gray-600 mb-1">Video URL (Cloudinary)</label>
                                        <input
                                            type="text"
                                            placeholder="Paste video URL from Cloudinary"
                                            value={lesson.videoUrl}
                                            onChange={(e) => updateLesson(index, 'videoUrl', e.target.value)}
                                            className="w-full px-3 py-2 border rounded"
                                        />
                                        <p className="text-xs text-gray-500 mt-1">
                                            Upload video via Postman to /api/upload first, then paste the URL here
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <button
                            type="submit"
                            className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600"
                        >
                            Create Course
                        </button>
                    </form>
                </div>
            )}

            {/* Calendar Event Form */}
            {showCalendarForm && (
                <div className="bg-white rounded-lg shadow-md p-6 mb-8">
                    <h2 className="text-2xl font-bold mb-4">Add Calendar Event</h2>
                    <form onSubmit={handleCreateEvent}>
                        <div className="mb-4">
                            <label className="block text-gray-700 mb-2">Event Title</label>
                            <input
                                type="text"
                                value={eventData.title}
                                onChange={(e) => setEventData({ ...eventData, title: e.target.value })}
                                className="w-full px-3 py-2 border rounded focus:outline-none focus:border-blue-500"
                                required
                            />
                        </div>

                        <div className="mb-4">
                            <label className="block text-gray-700 mb-2">Description</label>
                            <textarea
                                value={eventData.description}
                                onChange={(e) => setEventData({ ...eventData, description: e.target.value })}
                                className="w-full px-3 py-2 border rounded focus:outline-none focus:border-blue-500"
                                rows="3"
                            />
                        </div>

                        <div className="mb-4">
                            <label className="block text-gray-700 mb-2">Event Date</label>
                            <input
                                type="date"
                                value={eventData.eventDate}
                                onChange={(e) => setEventData({ ...eventData, eventDate: e.target.value })}
                                className="w-full px-3 py-2 border rounded focus:outline-none focus:border-blue-500"
                                required
                            />
                        </div>

                        <button
                            type="submit"
                            className="bg-green-500 text-white px-6 py-2 rounded hover:bg-green-600"
                        >
                            Create Event
                        </button>
                    </form>
                </div>
            )}
            {/* Upcoming Events List new part */}
            <div className="bg-white rounded-lg shadow-md p-6 mb-8">
                <h2 className="text-2xl font-bold mb-4">My Upcoming Events</h2>

                {events.length === 0 ? (
                    <p className="text-gray-500">No upcoming events scheduled.</p>
                ) : (
                    <div className="space-y-3">
                        {events.map((event) => (
                            <div key={event._id} className="flex justify-between items-center border p-3 rounded hover:bg-gray-50">
                                <div>
                                    <h3 className="font-semibold">{event.title}</h3>
                                    <p className="text-sm text-gray-600">
                                        📅 {new Date(event.eventDate).toLocaleDateString()}
                                        {event.description && ` - ${event.description}`}
                                    </p>
                                </div>
                                <button
                                    onClick={() => handleDeleteEvent(event._id)}
                                    className="text-red-500 hover:text-red-700 text-sm font-semibold"
                                >
                                    Delete
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Courses List */}
            <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-2xl font-bold mb-4">My Courses</h2>

                {courses.length === 0 ? (
                    <p className="text-gray-500">You haven't created any courses yet.</p>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {courses.map((course) => (
                            <div key={course._id} className="border rounded-lg p-4 hover:shadow-md transition">
                                <h3 className="text-xl font-semibold mb-2">{course.title}</h3>
                                <p className="text-gray-600 mb-4 line-clamp-2">{course.description}</p>
                                <div className="flex justify-between items-center">
                                    <span className="text-sm text-gray-500">
                                        {course.lessons?.length || 0} Lessons
                                    </span>
                                    <div className="flex gap-2">
                                        <Link
                                            href={`/courses/${course._id}`}
                                            className="text-blue-500 hover:underline"
                                        >
                                            View
                                        </Link>
                                        <button
                                            onClick={() => handleDeleteCourse(course._id)}
                                            className="text-red-500 hover:underline"
                                        >
                                            Delete
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}