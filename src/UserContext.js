// src/UserContext.js

import React, { createContext, useState, useContext, useEffect } from 'react';

const UserContext = createContext();

export const useUser = () => useContext(UserContext);

export const UserProvider = ({ children }) => {
  const [role, setRole] = useState(localStorage.getItem('userRole'));

  useEffect(() => {
    localStorage.setItem('userRole', role);
  }, [role]);

  return (
      <UserContext.Provider value={{ role, setRole }}>
        {children}
      </UserContext.Provider>
  );
};
