import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Events.css';

// Sample static data for community events
const INITIAL_EVENTS = [
  {
    id: 1,
    title: 'Neighborhood Park Clean-up',
    category: 'Cleanliness',
    date: '2026-08-12',
    time: '09:00 AM - 12:00 PM',
    location: 'Central City Park',
    description: 'Join us to pick up litter, trim overgrown bushes, and make our central park pristine and safe for everyone.',
    maxVolunteers: 25,
  },
  {
    id: 2,
    title: 'Free Youth Coding Workshop',
    category: 'Education',
    date: '2026-08-15',
    time: '02:00 PM - 05:00 PM',
    location: 'Community Library Lab',
    description: 'A beginner-friendly workshop introducing middle school kids to HTML, CSS, and web development fundamentals.',
    maxVolunteers: 10,
  },
  {
    id: 3,
    title: 'Annual Blood Donation Drive',
    category: 'Health',
    date: '2026-08-20',
    time: '08:00 AM - 03:00 PM',
    location: 'St. Jude Community Hall',
    description: 'Partnering with the Red Cross to host a blood drive. Medical professionals will be on site all day.',
    maxVolunteers: 15,
  },
  {
    id: 4,
    title: 'City Tree Planting Initiative',
    category: 'Plantation',
    date: '2026-08-22',
    time: '07:30 AM - 11:30 AM',
    location: 'East River Greenbelt',
    description: 'Help us plant 100 native saplings along the riverbank to restore local greenery and combat erosion.',
    maxVolunteers: 40,
  },
  {
    id: 5,
    title: 'Senior Health Checkup Camp',
    category: 'Health',
    date: '2026-08-28',
    time: '10:00 AM - 02:00 PM',
    location: 'Sunrise Retirement Center',
    description: 'Volunteers needed to assist nurses with check-ins, blood pressure monitoring, and general event logistics.',
    maxVolunteers: 12,
  },
  {
    id: 6,
    title: 'School Supply Drive & Prep',
    category: 'Education',
    date: '2026-09-02',
    time: '01:00 PM - 04:00 PM',
    location: 'Civic Center Gym',
    description: 'Help organize and pack donated backpacks and school supplies for underprivileged students before term starts.',
    maxVolunteers: 30,
  },
];

export default function Events() {
  const navigate = useNavigate();

  // State for search filter and category selection
  const [searchText, setSearchText] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  // Filter events based on title/description search AND selected category
  const filteredEvents = INITIAL_EVENTS.filter((event) => {
    const matchesSearch =
      event.title.toLowerCase().includes(searchText.toLowerCase()) ||
      event.description.toLowerCase().includes(searchText.toLowerCase());

    const matchesCategory =
      selectedCategory === 'All' || event.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  return (
    <div className="events-container">
      {/* Header Section */}
      <header className="events-header">
        <h1>Community Events</h1>
        <p>Discover local initiatives and make a difference in your neighborhood.</p>
      </header>

      {/* Toolbar Section */}
      <div className="events-toolbar">
        <div className="filter-group">
          <input
            type="text"
            className="search-input"
            placeholder="Search events..."
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
          />

          <select
            className="category-select"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            <option value="All">All Categories</option>
            <option value="Cleanliness">Cleanliness</option>
            <option value="Education">Education</option>
            <option value="Health">Health</option>
            <option value="Plantation">Plantation</option>
          </select>
        </div>

        <button
          className="btn-create"
          onClick={() => navigate('/create-event')}
        >
          + Create Event
        </button>
      </div>

      {/* Events Grid Section */}
      {filteredEvents.length > 0 ? (
        <div className="events-grid">
          {filteredEvents.map((event) => (
            <div className="event-card" key={event.id}>
              <div className="card-top">
                <span className={`badge badge-${event.category.toLowerCase()}`}>
                  {event.category}
                </span>
                <span className="volunteer-count">
                  Max: <strong>{event.maxVolunteers}</strong> volunteers
                </span>
              </div>

              <h2 className="event-title">{event.title}</h2>

              <div className="event-details">
                <p className="detail-item">
                  <span className="detail-label">Date:</span> {event.date}
                </p>
                <p className="detail-item">
                  <span className="detail-label">Time:</span> {event.time}
                </p>
                <p className="detail-item">
                  <span className="detail-label">Location:</span> {event.location}
                </p>
              </div>

              <p className="event-description">{event.description}</p>

              <button
                className="btn-details"
                onClick={() => navigate(`/events/${event.id}`)}
              >
                View Details
              </button>
            </div>
          ))}
        </div>
      ) : (
        <div className="no-events">
          <h3>No events found</h3>
          <p>Try adjusting your search criteria or changing the category filter.</p>
        </div>
      )}
    </div>
  );
}