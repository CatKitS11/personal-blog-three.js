import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const AuthContext = React.createContext();

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

function AuthProvider(props) {
  const [state, setState] = useState({
    loading: null,
    getUserLoading: null,
    error: null,
    user: null,
    checkingAvailability: false,
  });

  const navigate = useNavigate();

  // ดึงข้อมูลผู้ใช้โดยใช้ Supabase API
  const fetchUser = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      setState((prevState) => ({
        ...prevState,
        user: null,
        getUserLoading: false,
      }));
      return;
    }

    try {
      setState((prevState) => ({ ...prevState, getUserLoading: true }));
      const response = await axios.get(
        `${API_BASE_URL}/auth/get-user`
      );
      
      // เก็บ role ใน localStorage
      if (response.data?.role) {
        localStorage.setItem('userRole', response.data.role);
      }
      
      setState((prevState) => ({
        ...prevState,
        user: response.data,
        getUserLoading: false,
      }));
    } catch (error) {
      setState((prevState) => ({
        ...prevState,
        error: error.message,
        user: null,
        getUserLoading: false,
      }));
    }
  };

  useEffect(() => {
    fetchUser(); // โหลดข้อมูลผู้ใช้เมื่อแอปเริ่มต้น
  }, []);

  // ล็อกอินผู้ใช้
  const login = async (data) => {
    try {
      setState((prevState) => ({ ...prevState, loading: true, error: null }));
      const response = await axios.post(
        `${API_BASE_URL}/auth/login`,
        data
      );
      const token = response.data.access_token;
      localStorage.setItem("token", token);

      // ดึงข้อมูลผู้ใช้เพื่อเช็ค role
      const userResponse = await axios.get(`${API_BASE_URL}/auth/get-user`);
      const userRole = userResponse.data?.role;
      
      // เก็บ role ใน localStorage
      if (userRole) {
        localStorage.setItem('userRole', userRole);
      }
      
      // อัปเดต state
      setState((prevState) => ({ 
        ...prevState, 
        loading: false, 
        error: null,
        user: userResponse.data
      }));
      
      // เช็ค role และ redirect ตาม role
      if (userRole === 'admin') {
        navigate("/admin");
      } else {
        navigate("/");
      }
      
    } catch (error) {
      setState((prevState) => ({
        ...prevState,
        loading: false,
        error: error.response?.data?.error || "Login failed",
      }));
      return { error: error.response?.data?.error || "Login failed" };
    }
  };

  // ลงทะเบียนผู้ใช้
  const register = async (data) => {
    try {
      setState((prevState) => ({ ...prevState, loading: true, error: null }));
      await axios.post(
        `${API_BASE_URL}/auth/register`,
        data
      );
      setState((prevState) => ({ ...prevState, loading: false, error: null }));
      navigate("/sign-up/success");
    } catch (error) {
      setState((prevState) => ({
        ...prevState,
        loading: false,
        error: error.response?.data?.error || "Registration failed",
      }));
      return { error: error.response?.data?.error || "Registration failed" };
    }
  };

  // ล็อกเอาท์ผู้ใช้
  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userRole");
    setState({ user: null, error: null, loading: null });
    navigate("/");
  };

  const isAuthenticated = Boolean(state.user);

  // เช็คว่า username หรือ email ซ้ำหรือไม่
  const checkAvailability = async (field, value) => {
    if (!value.trim()) return { available: true };
    
    try {
      setState(prev => ({ ...prev, checkingAvailability: true }));
      const response = await axios.post(
        `${API_BASE_URL}/auth/check-availability`,
        { field, value: value.trim() }
      );
      setState(prev => ({ ...prev, checkingAvailability: false }));
      return response.data;
    } catch (error) {
      setState(prev => ({ ...prev, checkingAvailability: false }));
      return { available: false, error: error.response?.data?.error || "Check failed" };
    }
  };

  return (
    <AuthContext.Provider
      value={{
        state,
        login,
        logout,
        register,
        isAuthenticated,
        checkAvailability,
        fetchUser,
      }}
    >
      {props.children}
    </AuthContext.Provider>
  );
}

// Hook สำหรับใช้งาน AuthContext
const useAuth = () => React.useContext(AuthContext);

export { AuthProvider, useAuth };