import React, { useEffect, useState } from 'react';

const NotificationSubscriber = ({ restaurantId }) => {
  const [messages, setMessages] = useState([]);
  const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

  useEffect(() => {
    const eventSource = new EventSource(`${API_BASE_URL}/server-events/subscribe/${restaurantId}`);

    eventSource.onopen = (event) => {
      console.log('Connection opened', event);
    };

    eventSource.onmessage = (event) => {
      console.log('New message', event);
      setMessages((prevMessages) => [...prevMessages, event.data]);
    };

    eventSource.onerror = (event) => {
      console.error('EventSource failed:', event);
      eventSource.close();
    };

    return () => {
      eventSource.close();
    };
  }, [restaurantId]);

  return (
      <div>
        <h1>Notifications for Restaurant {restaurantId}</h1>
        <ul>
          {messages.map((message, index) => (
              <li key={index}>{message}</li>
          ))}
        </ul>
      </div>
  );
};

export default NotificationSubscriber;
