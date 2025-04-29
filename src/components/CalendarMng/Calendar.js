import React, { useState, useEffect } from 'react';
import { gapi } from 'gapi-script';

const CALENDAR_ID = 'primary';
const SCOPES = 'https://www.googleapis.com/auth/calendar.readonly';

function Calendar() {
  const [events, setEvents] = useState([]);
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [authClient, setAuthClient] = useState(null);
  const accessToken = localStorage.getItem('accessToken');

  const initClient = async () => {
    try {
      await gapi.client.init({
        clientId: process.env.REACT_APP_GOOGLE_CLIENT_ID,
        scope: SCOPES,
        accessToken: accessToken, // Try initializing with existing token
      });

      const authInstance = gapi.auth2.getAuthInstance();
      const currentIsSignedIn = authInstance ? authInstance.isSignedIn.get() : false;
      setIsSignedIn(currentIsSignedIn);
      setAuthClient(authInstance);

      if (authInstance) {
        authInstance.isSignedIn.listen((isSignedIn) => {
          setIsSignedIn(isSignedIn);
          if (isSignedIn) {
            fetchCalendarEvents(authClient);
          } else {
            setEvents([]);
          }
        });

        if (currentIsSignedIn) {
          fetchCalendarEvents(authClient);
        }
      } else if (accessToken) {
        // If client init failed but we have a token, try fetching directly
        const tempClient = gapi.client;
        if (tempClient && tempClient.calendar && accessToken) {
          fetchCalendarEventsWithToken(accessToken);
        }
      }
    } catch (error) {
      console.error('Error initializing Google API client:', error);
      // Handle initialization failure
    }
  };

  useEffect(() => {
    const handleClientLoad = async () => {
      gapi.load('client:auth2', initClient);
    };

    handleClientLoad();
  }, [accessToken]); // Re-run effect if accessToken changes

  const fetchCalendarEvents = async (authClient) => {
    try {
      const response = await authClient.client.calendar.events.list({
        calendarId: CALENDAR_ID,
        timeMin: new Date().toISOString(),
        maxResults: 10,
        singleEvents: true,
        orderBy: 'startTime',
      });
      setEvents(response.result.items || []);
    } catch (error) {
      console.error('Error fetching calendar events:', error);
      // Handle fetch error (e.g., token expired)
    }
  };

  const fetchCalendarEventsWithToken = async (token) => {
    try {
      const response = await gapi.client.request({
        path: `/calendar/v3/calendars/${CALENDAR_ID}/events`,
        params: {
          timeMin: new Date().toISOString(),
          maxResults: 10,
          singleEvents: true,
          orderBy: 'startTime',
        },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setEvents(response.result.items || []);
      // Optionally, try to re-initialize client if this works
      if (!authClient) {
        initClient(); // Now initClient is in scope
      }
    } catch (error) {
      console.error('Error fetching calendar events with token:', error);
      setIsSignedIn(false); // Token might be invalid, force sign-in UI
    }
  };

  const handleSignIn = () => {
    if (authClient) {
      authClient.signIn();
    }
  };

  const handleSignOut = () => {
    if (authClient) {
      authClient.signOut();
      setEvents([]);
      setIsSignedIn(false);
    }
  };

  if (!isSignedIn) {
    return (
      <div>
        <h2>Google Calendar</h2>
        <p>To view your calendar, please sign in with Google.</p>
        <button onClick={handleSignIn}>Sign in with Google</button>
      </div>
    );
  }

  return (
    <div>
      <h2>Google Calendar Events</h2>
      <button onClick={handleSignOut}>Sign Out of Google</button>
      {events.length > 0 ? (
        <ul>
          {events.map((event) => (
            <li key={event.id}>
              <strong>{event.summary || 'No Title'}</strong>
              <p>
                {event.start?.dateTime
                  ? new Date(event.start.dateTime).toLocaleString()
                  : (event.start?.date ? new Date(event.start.date).toLocaleDateString() : 'No Start Time')}
                {' - '}
                {event.end?.dateTime
                  ? new Date(event.end.dateTime).toLocaleString()
                  : (event.end?.date ? new Date(event.end.date).toLocaleDateString() : 'No End Time')}
              </p>
              {event.location && <p>Location: {event.location}</p>}
            </li>
          ))}
        </ul>
      ) : (
        <p>No upcoming events found.</p>
      )}
    </div>
  );
}

export default Calendar;