export const signUpValidationSchema = {
    fullName: (value) => {
      if (!value.trim()) return "Full name is required";
      if (value.trim().length > 35) return "Full name must not exceed 35 characters";
      if (!/^[a-zA-Zก-๙\s]+$/.test(value.trim())) return "Full name can only contain letters and spaces";
      return null;
    },
    
    username: (value) => {
      if (!value.trim()) return "Username is required";
      if (value.trim().length < 3) return "Username must be at least 3 characters";
      if (!/^[a-zA-Z0-9_]+$/.test(value.trim())) return "Username can only contain letters, numbers, and underscores";
      return null;
    },
    
    email: (value) => {
      if (!value.trim()) return "Email is required";
      if (!value.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) return "Please enter a valid email address";
      return null;
    },
    
    password: (value) => {
      if (!value) return "Password is required";
      if (value.length < 6) return "Password must be at least 6 characters";
      if (!/(?=.*[a-z])(?=.*\d)/.test(value)) return "Password must contain at least one lowercase letter, and one number";
      return null;
    }
  };
  
  export const loginValidationSchema = {
    email: (value) => {
      if (!value.trim()) return "Email is required";
      if (!value.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) return "Please enter a valid email address";
      return null;
    },
    
    password: (value) => {
      if (!value) return "Password is required";
      return null;
    }
  };