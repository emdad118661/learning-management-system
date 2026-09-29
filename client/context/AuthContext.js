'use client';

import { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = Cookies.get('token');
    const userData = Cookies.get('user');
    
    if (token && userData) {
      setUser(JSON.parse(userData));
      axios.defaults.headers.common['x-auth-token'] = token;
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    const res = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/auth/login`, {
      email,
      password
    });
    
    Cookies.set('token', res.data.token, { 
      expires: 7,
      path: '/'
    });
    Cookies.set('user', JSON.stringify(res.data.user), { 
      expires: 7,
      path: '/'
    });
    axios.defaults.headers.common['x-auth-token'] = res.data.token;
    setUser(res.data.user);
    
    return res.data;
  };

  const register = async (name, email, password, role) => {
    const res = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/auth/register`, {
      name,
      email,
      password,
      role
    });
    return res.data;
  };

  // ✅ Simplified logout - no router needed
  const logout = () => {
    console.log(' Logging out...');
    console.log('Token before remove:', Cookies.get('token'));
    
    // ✅ Cookie remove করার সময় একই options দিতে হবে
    Cookies.remove('token', { path: '/' });
    Cookies.remove('user', { path: '/' });
    
    delete axios.defaults.headers.common['x-auth-token'];
    setUser(null);
    
    console.log('Token after remove:', Cookies.get('token'));
    console.log('Redirecting to login...');
    
    // ✅ window.location.href ব্যবহার করো - এটি সবসময় কাজ করে
    window.location.href = '/login';
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};