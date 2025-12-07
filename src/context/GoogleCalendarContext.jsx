import React, { createContext, useState, useCallback, useEffect } from "react";

export const GoogleCalendarContext = createContext();

export function GoogleCalendarProvider({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [googleUser, setGoogleUser] = useState(null);
  const [calendarEvents, setCalendarEvents] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Initialize Google API
  useEffect(() => {
    const initializeGoogle = () => {
      if (window.gapi) {
        window.gapi.load("calendar", () => {
          window.gapi.client.init({
            apiKey: import.meta.env.VITE_GOOGLE_API_KEY,
            clientId: import.meta.env.VITE_GOOGLE_CLIENT_ID,
            scope: "https://www.googleapis.com/auth/calendar",
            discoveryDocs: [
              "https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest",
            ],
          });
        });
      }
    };

    // Load gapi script
    const script = document.createElement("script");
    script.src = "https://apis.google.com/js/api.js";
    script.async = true;
    script.defer = true;
    script.onload = initializeGoogle;
    document.body.appendChild(script);

    return () => {
      if (document.body.contains(script)) {
        document.body.removeChild(script);
      }
    };
  }, []);

  // Handle successful login
  const handleLoginSuccess = useCallback((credentialResponse) => {
    try {
      console.log("Login successful:", credentialResponse);

      // JWT token'ı decode et (header.payload.signature)
      const token = credentialResponse.credential;
      const base64Url = token.split(".")[1];
      const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split("")
          .map((c) => {
            return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
          })
          .join("")
      );

      const decoded = JSON.parse(jsonPayload);
      console.log("Decoded JWT:", decoded);

      // User bilgilerini ayarla
      setGoogleUser({
        name: decoded.name,
        email: decoded.email,
        picture: decoded.picture,
        credential: token,
      });

      setIsAuthenticated(true);
      setError(null);
      localStorage.setItem("googleCalendarToken", token);
    } catch (err) {
      setError("Failed to authenticate with Google");
      console.error("Login error:", err);
    }
  }, []);

  // Handle login failure
  const handleLoginFailure = useCallback(() => {
    setError("Failed to authenticate with Google");
    setIsAuthenticated(false);
  }, []);

  // Fetch events from Google Calendar
  const fetchCalendarEvents = useCallback(
    async (timeMin, timeMax) => {
      if (!isAuthenticated) {
        setError("Not authenticated with Google Calendar");
        return;
      }

      setIsLoading(true);
      try {
        const response = await window.gapi.client.calendar.events.list({
          calendarId: "primary",
          timeMin: timeMin || new Date().toISOString(),
          timeMax:
            timeMax ||
            new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
          showDeleted: false,
          singleEvents: true,
          orderBy: "startTime",
        });

        const events = response.result.items || [];
        setCalendarEvents(events);
        setError(null);
        return events;
      } catch (err) {
        setError(`Failed to fetch calendar events: ${err.message}`);
        console.error("Fetch events error:", err);
        return [];
      } finally {
        setIsLoading(false);
      }
    },
    [isAuthenticated]
  );

  // Create event on Google Calendar
  const createCalendarEvent = useCallback(
    async (event) => {
      if (!isAuthenticated) {
        setError("Not authenticated with Google Calendar");
        return null;
      }

      setIsLoading(true);
      try {
        const response = await window.gapi.client.calendar.events.insert({
          calendarId: "primary",
          resource: {
            summary: event.title,
            description: event.description || "",
            start: {
              dateTime: event.startTime || new Date().toISOString(),
              timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
            },
            end: {
              dateTime:
                event.endTime ||
                new Date(Date.now() + 60 * 60 * 1000).toISOString(),
              timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
            },
            location: event.location || "",
            extendedProperties: {
              private: {
                missionId: event.missionId || "",
                taskId: event.taskId || "",
                context: event.context || "",
              },
            },
          },
        });

        setError(null);
        // Refresh events after creating
        await fetchCalendarEvents();
        return response.result;
      } catch (err) {
        setError(`Failed to create calendar event: ${err.message}`);
        console.error("Create event error:", err);
        return null;
      } finally {
        setIsLoading(false);
      }
    },
    [isAuthenticated, fetchCalendarEvents]
  );

  // Update event on Google Calendar
  const updateCalendarEvent = useCallback(
    async (eventId, event) => {
      if (!isAuthenticated) {
        setError("Not authenticated with Google Calendar");
        return null;
      }

      setIsLoading(true);
      try {
        const response = await window.gapi.client.calendar.events.update({
          calendarId: "primary",
          eventId: eventId,
          resource: {
            summary: event.title,
            description: event.description || "",
            start: {
              dateTime: event.startTime,
              timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
            },
            end: {
              dateTime: event.endTime,
              timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
            },
            location: event.location || "",
          },
        });

        setError(null);
        await fetchCalendarEvents();
        return response.result;
      } catch (err) {
        setError(`Failed to update calendar event: ${err.message}`);
        console.error("Update event error:", err);
        return null;
      } finally {
        setIsLoading(false);
      }
    },
    [isAuthenticated, fetchCalendarEvents]
  );

  // Delete event from Google Calendar
  const deleteCalendarEvent = useCallback(
    async (eventId) => {
      if (!isAuthenticated) {
        setError("Not authenticated with Google Calendar");
        return false;
      }

      setIsLoading(true);
      try {
        await window.gapi.client.calendar.events.delete({
          calendarId: "primary",
          eventId: eventId,
        });

        setError(null);
        await fetchCalendarEvents();
        return true;
      } catch (err) {
        setError(`Failed to delete calendar event: ${err.message}`);
        console.error("Delete event error:", err);
        return false;
      } finally {
        setIsLoading(false);
      }
    },
    [isAuthenticated, fetchCalendarEvents]
  );

  // Logout from Google
  const logout = useCallback(() => {
    if (window.gapi?.auth2) {
      const auth2 = window.gapi.auth2.getAuthInstance();
      if (auth2) {
        auth2.signOut();
      }
    }
    setIsAuthenticated(false);
    setGoogleUser(null);
    setCalendarEvents([]);
    localStorage.removeItem("googleCalendarToken");
  }, []);

  const value = {
    isAuthenticated,
    googleUser,
    calendarEvents,
    isLoading,
    error,
    handleLoginSuccess,
    handleLoginFailure,
    fetchCalendarEvents,
    createCalendarEvent,
    updateCalendarEvent,
    deleteCalendarEvent,
    logout,
  };

  return (
    <GoogleCalendarContext.Provider value={value}>
      {children}
    </GoogleCalendarContext.Provider>
  );
}
