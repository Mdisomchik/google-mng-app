import React, { useState } from 'react';
import axios from 'axios';

function ComposeEmail() {
  const [to, setTo] = useState('');
  const [subject, setSubject] = useState('');
  const [body, setBody] = useState('');
  const [sending, setSending] = useState(false);
  const [sendResult, setSendResult] = useState(null);
  const accessToken = localStorage.getItem('accessToken');

  const handleSend = async () => {
    if (!accessToken) {
      setSendResult({ success: false, message: 'Not authenticated.' });
      return;
    }

    setSending(true);
    setSendResult(null);

    const rawMessage = `To: ${to}\r\nSubject: ${subject}\r\n\r\n${body}`;
    const base64EncodedMessage = btoa(unescape(encodeURIComponent(rawMessage))).replace(/\+/g, '-').replace(/\//g, '_');

    try {
      const response = await axios.post(
        'https://gmail.googleapis.com/gmail/v1/users/me/messages/send',
        { raw: base64EncodedMessage },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
        }
      );
      setSendResult({ success: true, message: 'Email sent successfully!' });
      setTo('');
      setSubject('');
      setBody('');
    } catch (error) {
      console.error('Error sending email:', error);
      setSendResult({ success: false, message: `Failed to send email: ${error.message}` });
    } finally {
      setSending(false);
      setTimeout(() => setSendResult(null), 5000); // Clear message after 5 seconds
    }
  };

  return (
    <div>
      <h2>Compose New Email</h2>
      <div>
        <label>To:</label>
        <input type="email" value={to} onChange={(e) => setTo(e.target.value)} />
      </div>
      <div>
        <label>Subject:</label>
        <input type="text" value={subject} onChange={(e) => setSubject(e.target.value)} />
      </div>
      <div>
        <label>Body:</label>
        <textarea value={body} onChange={(e) => setBody(e.target.value)} />
      </div>
      <button onClick={handleSend} disabled={sending}>
        {sending ? 'Sending...' : 'Send'}
      </button>
      {sendResult && (
        <p style={{ color: sendResult.success ? 'green' : 'red' }}>{sendResult.message}</p>
      )}
    </div>
  );
}

export default ComposeEmail;