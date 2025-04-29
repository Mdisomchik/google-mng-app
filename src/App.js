import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './components/Auth/Login';
import Emails from './components/Mails/Emails';
import ComposeEmail from './components/MailWork/ComposeEmail';
import Calendar from './components/CalendarMng/Calendar'; // Import Calendar

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/emails" element={<Emails />} />
        <Route path="/compose" element={<ComposeEmail />} />
        <Route path="/calendar" element={<Calendar />} /> {/* Add the calendar route */}
      </Routes>
    </Router>
  );
}

export default App;