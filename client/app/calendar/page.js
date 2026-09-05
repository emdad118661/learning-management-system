'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';

export default function CalendarPage() {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
    const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
    const [selectedDay, setSelectedDay] = useState(null);
    const [showAddForm, setShowAddForm] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });
    const { user } = useAuth();

    // Event Form State
    const [eventData, setEventData] = useState({
        title: '',
        description: '',
        eventDate: ''
    });

    useEffect(() => {
        fetchEvents();
    }, [selectedMonth, selectedYear]);

    const fetchEvents = async () => {
        try {
            const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/calendar`);
            setEvents(res.data);
        } catch (err) {
            console.error('Failed to fetch events:', err);
        } finally {
            setLoading(false);
        }
    };

    const getDaysInMonth = (month, year) => {
        return new Date(year, month + 1, 0).getDate();
    };

    const getFirstDayOfMonth = (month, year) => {
        return new Date(year, month, 1).getDay();
    };

    const getEventsForDay = (day) => {
        const calendarDate = new Date(selectedYear, selectedMonth, day);

        return events.filter(event => {
            const eventDate = new Date(event.eventDate);
            return (
                eventDate.getDate() === calendarDate.getDate() &&
                eventDate.getMonth() === calendarDate.getMonth() &&
                eventDate.getFullYear() === calendarDate.getFullYear()
            );
        });
    };

    const months = [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
    ];

    const daysInMonth = getDaysInMonth(selectedMonth, selectedYear);
    const firstDay = getFirstDayOfMonth(selectedMonth, selectedYear);

    const prevMonth = () => {
        if (selectedMonth === 0) {
            setSelectedMonth(11);
            setSelectedYear(selectedYear - 1);
        } else {
            setSelectedMonth(selectedMonth - 1);
        }
    };

    const nextMonth = () => {
        if (selectedMonth === 11) {
            setSelectedMonth(0);
            setSelectedYear(selectedYear + 1);
        } else {
            setSelectedMonth(selectedMonth + 1);
        }
    };

    const handleDayClick = (day) => {
        if (user && user.role === 'teacher') {
            setSelectedDay(day);
            const date = `${selectedYear}-${String(selectedMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
            setEventData({ ...eventData, eventDate: date });
            setShowAddForm(true);
        }
    };

    const handleCreateEvent = async (e) => {
        e.preventDefault();
        setMessage({ type: '', text: '' });

        try {
            await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/calendar`, eventData);
            setMessage({ type: 'success', text: 'Event created successfully!' });
            setEventData({ title: '', description: '', eventDate: eventData.eventDate });
            setShowAddForm(false);
            setSelectedDay(null);
            fetchEvents();
        } catch (err) {
            setMessage({ type: 'error', text: err.response?.data?.message || 'Failed to create event' });
        }
    };

    const handleDeleteEvent = async (eventId) => {
        if (!confirm('Are you sure you want to delete this event?')) return;

        try {
            await axios.delete(`${process.env.NEXT_PUBLIC_API_URL}/calendar/${eventId}`);
            setMessage({ type: 'success', text: 'Event deleted successfully!' });
            fetchEvents();
        } catch (err) {
            setMessage({ type: 'error', text: 'Failed to delete event' });
        }
    };

    const closeAddForm = () => {
        setShowAddForm(false);
        setSelectedDay(null);
        setEventData({ title: '', description: '', eventDate: '' });
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="text-xl">Loading calendar...</div>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-8 text-center">Class Schedule Calendar</h1>

            {message.text && (
                <div className={`p-4 rounded mb-6 ${message.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                    }`}>
                    {message.text}
                </div>
            )}

            {/* Add Event Form (Teacher Only) */}
            {showAddForm && user?.role === 'teacher' && (
                <div className="bg-white rounded-lg shadow-md p-6 mb-8 max-w-md mx-auto">
                    <h2 className="text-2xl font-bold mb-4">Add Event for {selectedDay} {months[selectedMonth]}</h2>
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
                            <label className="block text-gray-700 mb-2">Date</label>
                            <input
                                type="date"
                                value={eventData.eventDate}
                                onChange={(e) => setEventData({ ...eventData, eventDate: e.target.value })}
                                className="w-full px-3 py-2 border rounded focus:outline-none focus:border-blue-500"
                                required
                                readOnly
                            />
                        </div>

                        <div className="flex gap-4">
                            <button
                                type="submit"
                                className="bg-green-500 text-white px-6 py-2 rounded hover:bg-green-600 flex-1"
                            >
                                Create Event
                            </button>
                            <button
                                type="button"
                                onClick={closeAddForm}
                                className="bg-gray-500 text-white px-6 py-2 rounded hover:bg-gray-600 flex-1"
                            >
                                Cancel
                            </button>
                        </div>
                    </form>
                </div>
            )}

            <div className="bg-white rounded-lg shadow-md p-6">
                {/* Calendar Header */}
                <div className="flex justify-between items-center mb-6">
                    <button
                        onClick={prevMonth}
                        className="bg-gray-200 px-4 py-2 rounded hover:bg-gray-300"
                    >
                        ← Previous
                    </button>
                    <h2 className="text-xl font-semibold">
                        {months[selectedMonth]} {selectedYear}
                    </h2>
                    <button
                        onClick={nextMonth}
                        className="bg-gray-200 px-4 py-2 rounded hover:bg-gray-300"
                    >
                        Next →
                    </button>
                </div>

                {/* Calendar Grid */}
                <div className="grid grid-cols-7 gap-2">
                    {/* Day Headers */}
                    {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                        <div key={day} className="text-center font-bold py-2 bg-gray-100 rounded">
                            {day}
                        </div>
                    ))}

                    {/* Empty cells for days before first day of month */}
                    {Array.from({ length: firstDay }).map((_, index) => (
                        <div key={`empty-${index}`} className="p-2"></div>
                    ))}

                    {/* Days of the month */}
                    {Array.from({ length: daysInMonth }).map((_, index) => {
                        const day = index + 1;
                        const dayEvents = getEventsForDay(day);
                        const isToday =
                            day === new Date().getDate() &&
                            selectedMonth === new Date().getMonth() &&
                            selectedYear === new Date().getFullYear();
                        const isTeacher = user?.role === 'teacher';

                        return (
                            <div
                                key={day}
                                onClick={() => isTeacher ? handleDayClick(day) : null}
                                className={`p-2 border rounded min-h-[100px] cursor-${isTeacher ? 'pointer' : 'default'} ${isToday ? 'bg-blue-50 border-blue-300' : 'bg-white'
                                    } ${isTeacher ? 'hover:bg-gray-50' : ''}`}
                            >
                                <div className={`text-right font-semibold ${isToday ? 'text-blue-600' : ''}`}>
                                    {day}
                                </div>
                                <div className="mt-1 space-y-1">
                                    {dayEvents.map(event => (
                                        <div
                                            key={event._id}
                                            className="text-xs bg-green-100 text-green-800 p-1 rounded relative group"
                                        >
                                            <div className="font-semibold">{event.title}</div>
                                            {event.description && (
                                                <div className="truncate">{event.description}</div>
                                            )}
                                            <div className="text-gray-500">
                                                By: {event.teacherId?.name || 'Teacher'}
                                            </div>

                                            {/* Delete Button (Teacher Only - Own Events) */}
                                            {isTeacher && event.teacherId?._id === user?.id && (
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleDeleteEvent(event._id);
                                                    }}
                                                    className="absolute top-1 right-1 text-red-500 hover:text-red-700 opacity-0 group-hover:opacity-100 transition"
                                                    title="Delete Event"
                                                >
                                                    ✕
                                                </button>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Note for Students */}
                {user?.role === 'student' && (
                    <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded">
                        <p className="text-yellow-800">
                            <strong>Note:</strong> This calendar is read-only. Contact your teacher for any schedule changes.
                        </p>
                    </div>
                )}

                {/* Note for Teachers */}
                {user?.role === 'teacher' && (
                    <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded">
                        <p className="text-blue-800">
                            <strong>Teacher Tip:</strong> Click on any date to add a new event. Hover over events to see delete option.
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}