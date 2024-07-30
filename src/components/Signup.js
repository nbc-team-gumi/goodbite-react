import React, { useState } from 'react';
import { fetchData } from '../util/api';

function Signup() {
  const [email, setEmail] = useState('');
  const [nickname, setNickname] = useState('');
  const [password, setPassword] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [message, setMessage] = useState('');

  const handleSignup = async (e) => {
    e.preventDefault();
    console.log('API Base URL:', process.env.REACT_APP_API_BASE_URL);
    try {
      const data = await fetchData('/customers/signup', {
        method: 'POST',
        body: JSON.stringify({
          email,
          nickname,
          password,
          phoneNumber
        }),
      });
      setMessage(`Signup successful: ${JSON.stringify(data)}`);
    } catch (error) {
      setMessage(`Signup failed: ${error.message}`);
    }
  };

  return (
      <div>
        <h1>Signup</h1>
        <form onSubmit={handleSignup}>
          <div>
            <label>Email:</label>
            <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div>
            <label>Nickname:</label>
            <input
                type="text"
                value={nickname}
                onChange={(e) => setNickname(e.target.value)}
            />
          </div>
          <div>
            <label>Password:</label>
            <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <div>
            <label>Phone Number:</label>
            <input
                type="text"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
            />
          </div>
          <button type="submit">Signup</button>
        </form>
        {message && <p>{message}</p>}
      </div>
  );
}

export default Signup;