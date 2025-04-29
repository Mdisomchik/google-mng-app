import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom'; // Import Link

function Emails() {
  const [emails, setEmails] = useState([]);
  const accessToken = localStorage.getItem('accessToken');

  // ... (rest of your fetchEmailDetails and fetchInitialEmails functions remain the same)

  useEffect(() => {
    // ... (your fetchInitialEmails logic)
  }, [accessToken]);

  return (
    <div>
      <h1>Your Inbox</h1>
      <Link to="/compose">Compose Email</Link> {/* Link to the compose page */}
      {emails.length > 0 ? (
        <ul>
          {emails.map((email) => (
            <li key={email.id}>
              <strong>From:</strong>{' '}
              {email.payload?.headers?.find((header) => header.name === 'From')?.value || 'N/A'}
              <br />
              <strong>Subject:</strong>{' '}
              {email.payload?.headers?.find((header) => header.name === 'Subject')?.value || 'No Subject'}
              <br />
              Snippet: {email.snippet || 'No snippet available'}
            </li>
          ))}
        </ul>
      ) : (
        <p>No emails found.</p>
      )}
    </div>
  );
}

export default Emails;