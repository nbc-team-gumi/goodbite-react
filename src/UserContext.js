// src/UserContext.js

import React, { createContext, useState, useContext, useEffect } from 'react';
import { fetchData } from './util/api'; // fetchData import

const UserContext = createContext();

export const useUser = () => useContext(UserContext);

export const UserProvider = ({ children }) => {
  const [role, setRole] = useState(() => {
    const storedRole = localStorage.getItem('userRole');
    return storedRole && storedRole !== 'null' ? storedRole : null;
  });

  const [eventSource, setEventSource] = useState(null);

  useEffect(() => {
    localStorage.setItem('userRole', role);
  }, [role]);

  const logout = async () => {
    try {
      await fetchData('/users/logout', {
        method: 'POST',
      });

      setRole(null);
      alert('로그아웃되었습니다.')
      localStorage.removeItem('userRole');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('accessToken');

      if (eventSource) {
        eventSource.close();
        setEventSource(null); // EventSource 상태 초기화
        console.log('SSE 연결이 종료되었습니다.');
      }
    } catch (error) {
      console.error('로그아웃 오류:', error);
    }
  };

  return (
      <UserContext.Provider value={{ role, setRole, eventSource, setEventSource, logout }}>
        {children}
      </UserContext.Provider>
  );
};
