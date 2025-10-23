// Validation utility functions
export const validateName = (name) => {
    if (!name.trim()) {
      return "Full name is required";
    }
    if (name.trim().length > 35) {
      return "Full name must not exceed 35 characters";
    }
    if (!/^[a-zA-Zก-๙\s]+$/.test(name.trim())) {
      return "Full name can only contain letters and spaces";
    }
    return null;
  };
  
  export const validateUsername = (username) => {
    if (!username.trim()) {
      return "Username is required";
    }
    if (username.trim().length < 3) {
      return "Username must be at least 3 characters";
    }
    if (!/^[a-zA-Z0-9_]+$/.test(username.trim())) {
      return "Username can only contain letters, numbers, and underscores";
    }
    return null;
  };
  
  export const validateEmail = (email) => {
    if (!email.trim()) {
      return "Email is required";
    }
    if (!email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
      return "Please enter a valid email address";
    }
    return null;
  };
  
  export const validatePassword = (password) => {
    if (!password) {
      return "Password is required";
    }
    if (password.length < 6) {
      return "Password must be at least 6 characters";
    }
    if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(password)) {
      return "Password must contain at least one uppercase letter, one lowercase letter, and one number";
    }
    return null;
  };
  
  export const validateConfirmPassword = (password, confirmPassword) => {
    if (!confirmPassword) {
      return "Please confirm your password";
    }
    if (password !== confirmPassword) {
      return "Passwords do not match";
    }
    return null;
  };