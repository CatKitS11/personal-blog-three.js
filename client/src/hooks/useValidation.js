import { useState, useCallback } from 'react';
import { signUpValidationSchema, loginValidationSchema } from '../lib/validationSchemas';

export const useValidation = (schema) => {
  const [errors, setErrors] = useState({});

  const validateField = useCallback((fieldName, value, formData = {}) => {
    if (!schema[fieldName]) return null;
    
    const error = schema[fieldName](value, formData);
    setErrors(prev => ({
      ...prev,
      [fieldName]: error
    }));
    return error;
  }, [schema]);

  const validateForm = useCallback((formData) => {
    const newErrors = {};
    let isValid = true;

    Object.keys(schema).forEach(fieldName => {
      const error = schema[fieldName](formData[fieldName], formData);
      if (error) {
        newErrors[fieldName] = error;
        isValid = false;
      }
    });

    setErrors(newErrors);
    return isValid;
  }, [schema]);

  const clearError = useCallback((fieldName) => {
    setErrors(prev => ({
      ...prev,
      [fieldName]: null
    }));
  }, []);

  const clearAllErrors = useCallback(() => {
    setErrors({});
  }, []);

  return {
    errors,
    validateField,
    validateForm,
    clearError,
    clearAllErrors
  };
};

export const useSignUpValidation = () => useValidation(signUpValidationSchema);
export const useLoginValidation = () => useValidation(loginValidationSchema);