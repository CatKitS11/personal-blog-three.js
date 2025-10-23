import { useState, useCallback, useRef } from 'react';
import { useAuth } from '../contexts/authentication';

export const useAvailabilityCheck = () => {
  const { checkAvailability, state } = useAuth();
  const [availabilityStatus, setAvailabilityStatus] = useState({
    username: { status: 'idle', message: '', available: null },
    email: { status: 'idle', message: '', available: null }
  });
  
  const timeoutRefs = useRef({ username: null, email: null });

  // Helper function to validate email format
  const isValidEmailFormat = (email) => {
    return email.includes('@') && email.includes('.') && email.indexOf('@') < email.lastIndexOf('.');
  };

  // Helper function to check if username meets minimum requirements
  const shouldCheckUsername = (username) => {
    return username.trim().length > 6;
  };

  // Helper function to check if email meets minimum requirements
  const shouldCheckEmail = (email) => {
    return isValidEmailFormat(email.trim());
  };

  const checkFieldAvailability = useCallback(async (field, value) => {
    // Clear previous timeout
    if (timeoutRefs.current[field]) {
      clearTimeout(timeoutRefs.current[field]);
    }

    // Check if field meets minimum requirements before starting validation
    let shouldCheck = false;
    let idleMessage = '';

    if (field === 'username') {
      shouldCheck = shouldCheckUsername(value);
      idleMessage = shouldCheck ? '' : 'Username must be more than 6 characters';
    } else if (field === 'email') {
      shouldCheck = shouldCheckEmail(value);
      idleMessage = shouldCheck ? '' : 'Email must contain @ and .';
    }

    // If doesn't meet requirements, show idle message
    if (!shouldCheck) {
      setAvailabilityStatus(prev => ({
        ...prev,
        [field]: { 
          status: 'idle', 
          message: idleMessage, 
          available: null 
        }
      }));
      return;
    }

    // Set loading status
    setAvailabilityStatus(prev => ({
      ...prev,
      [field]: { status: 'checking', message: 'Checking availability...', available: null }
    }));

    // Debounce the API call with 3 seconds timeout
    timeoutRefs.current[field] = setTimeout(async () => {
      if (!value.trim()) {
        setAvailabilityStatus(prev => ({
          ...prev,
          [field]: { status: 'idle', message: '', available: null }
        }));
        return;
      }

      try {
        const result = await checkAvailability(field, value);
        
        if (result.available) {
          setAvailabilityStatus(prev => ({
            ...prev,
            [field]: { 
              status: 'success', 
              message: `${field === 'username' ? 'Username' : 'Email'} is available`, 
              available: true 
            }
          }));
        } else {
          setAvailabilityStatus(prev => ({
            ...prev,
            [field]: { 
              status: 'error', 
              message: `${field === 'username' ? 'Username' : 'Email'} is already taken`, 
              available: false 
            }
          }));
        }
      } catch (error) {
        setAvailabilityStatus(prev => ({
          ...prev,
          [field]: { 
            status: 'error', 
            message: 'Unable to check availability', 
            available: false 
          }
        }));
      }
    }, 3000); // EDIT: เปลี่ยนจาก 500ms เป็น 3000ms (3 วินาที)
  }, [checkAvailability]);

  const clearAvailabilityStatus = useCallback((field) => {
    setAvailabilityStatus(prev => ({
      ...prev,
      [field]: { status: 'idle', message: '', available: null }
    }));
  }, []);

  return {
    availabilityStatus,
    checkFieldAvailability,
    clearAvailabilityStatus,
    isCheckingAvailability: state.checkingAvailability
  };
};
