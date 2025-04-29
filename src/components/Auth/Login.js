import React, { useState } from 'react';
import { useGoogleLogin } from '@react-oauth/google';
import { useNavigate } from 'react-router-dom';
import './Login.css'; // Import component-specific CSS

function Login() {
  const navigate = useNavigate();
  const [loginMessage, setLoginMessage] = useState(null);

  const login = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      console.log(tokenResponse);
      localStorage.setItem('accessToken', tokenResponse.access_token);
      setLoginMessage('Login Successful!');
      setTimeout(() => {
        navigate('/emails');
      }, 1500);
    },
    onError: (error) => {
      console.error('Google Login Failed:', error);
      setLoginMessage('Login Failed');
    },
    scope: 'https://www.googleapis.com/auth/gmail.readonly https://www.googleapis.com/auth/gmail.send https://www.googleapis.com/auth/calendar.readonly',// Request all relevant scopes here
  });

  return (
    <div className="login-container">
      <h1>My Mail & Calendar App</h1>
      <p>Sign in with your Google account to access your emails and calendar.</p>
      {loginMessage && <p className={loginMessage === 'Login Successful!' ? 'success' : 'error'}>{loginMessage}</p>}
      <button onClick={() => login()}>
        <img src="/google-logo.png" alt="Google Logo" className="google-logo" />
        Sign in with Google
      </button>
    </div>
  );
}

export default Login;