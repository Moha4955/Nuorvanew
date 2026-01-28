import React from 'react';
import { AlertCircle, CheckCircle, Eye, EyeOff } from 'lucide-react';

interface FormFieldProps {
  label: string;
  name: string;
  type?: 'text' | 'email' | 'password' | 'tel' | 'date' | 'textarea' | 'select' | 'checkbox' | 'radio';
  value: any;
  onChange: (value: any) => void;
  error?: string;
  required?: boolean;
  placeholder?: string;
  disabled?: boolean;
  options?: Array<{ value: string; label: string }>;
  rows?: number;
  pattern?: string;
  min?: string | number;
  max?: string | number;
  step?: string | number;
  helpText?: string;
  className?: string;
  showPasswordToggle?: boolean;
}

const FormField: React.FC<FormFieldProps> = ({
  label,
  name,
  type = 'text',
  value,
  onChange,
  error,
  required = false,
  placeholder,
  disabled = false,
  options = [],
  rows = 3,
  pattern,
  min,
  max,
  step,
  helpText,
  className = '',
  showPasswordToggle = false
}) => {
  const [showPassword, setShowPassword] = React.useState(false);
  const [isFocused, setIsFocused] = React.useState(false);

  const inputId = `field-${name}`;
  const hasError = !!error;
  const hasValue = value !== undefined && value !== null && value !== '';

  const getInputClasses = () => {
    let classes = 'form-input transition-all duration-200';
    
    if (hasError) {
      classes += ' border-red-500 focus:border-red-500 focus:ring-red-200';
    } else if (hasValue && !hasError) {
      classes += ' border-green-500 focus:border-green-500 focus:ring-green-200';
    } else {
      classes += ' border-gray-300 focus:border-blue-500 focus:ring-blue-200';
    }
    
    if (disabled) {
      classes += ' bg-gray-50 cursor-not-allowed';
    }
    
    if (showPasswordToggle && type === 'password') {
      classes += ' pr-12';
    }
    
    return classes;
  };

  const renderInput = () => {
    const commonProps = {
      id: inputId,
      name,
      value: value || '',
      onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        if (type === 'checkbox') {
          onChange((e.target as HTMLInputElement).checked);
        } else {
          onChange(e.target.value);
        }
      },
      onFocus: () => setIsFocused(true),
      onBlur: () => setIsFocused(false),
      disabled,
      placeholder,
      className: getInputClasses(),
      ...(pattern && { pattern }),
      ...(min && { min }),
      ...(max && { max }),
      ...(step && { step })
    };

    switch (type) {
      case 'textarea':
        return (
          <textarea
            {...commonProps}
            rows={rows}
          />
        );
      
      case 'select':
        return (
          <select {...commonProps}>
            <option value="">{placeholder || `Select ${label.toLowerCase()}`}</option>
            {options.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        );
      
      case 'checkbox':
        return (
          <div className="flex items-center">
            <input
              type="checkbox"
              id={inputId}
              name={name}
              checked={!!value}
              onChange={(e) => onChange(e.target.checked)}
              disabled={disabled}
              className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
            />
            <label htmlFor={inputId} className="ml-2 text-sm text-gray-700">
              {label}
            </label>
          </div>
        );
      
      case 'radio':
        return (
          <div className="space-y-2">
            {options.map((option) => (
              <div key={option.value} className="flex items-center">
                <input
                  type="radio"
                  id={`${inputId}-${option.value}`}
                  name={name}
                  value={option.value}
                  checked={value === option.value}
                  onChange={(e) => onChange(e.target.value)}
                  disabled={disabled}
                  className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 focus:ring-2"
                />
                <label htmlFor={`${inputId}-${option.value}`} className="ml-2 text-sm text-gray-700">
                  {option.label}
                </label>
              </div>
            ))}
          </div>
        );
      
      case 'password':
        return (
          <div className="relative">
            <input
              {...commonProps}
              type={showPasswordToggle && showPassword ? 'text' : 'password'}
            />
            {showPasswordToggle && (
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
              >
                {showPassword ? (
                  <EyeOff size={20} className="text-gray-400 hover:text-gray-600" />
                ) : (
                  <Eye size={20} className="text-gray-400 hover:text-gray-600" />
                )}
              </button>
            )}
          </div>
        );
      
      default:
        return <input {...commonProps} type={type} />;
    }
  };

  if (type === 'checkbox') {
    return (
      <div className={`form-field ${className}`}>
        {renderInput()}
        {error && (
          <div className="form-error-message">
            <AlertCircle size={16} className="mr-1" />
            {error}
          </div>
        )}
        {helpText && !error && (
          <p className="text-sm text-gray-500 mt-1">{helpText}</p>
        )}
      </div>
    );
  }

  return (
    <div className={`form-field ${className}`}>
      <label htmlFor={inputId} className={`form-label ${required ? 'required' : ''}`}>
        {label}
      </label>
      
      <div className="relative">
        {renderInput()}
        
        {/* Status indicator */}
        {hasValue && !hasError && !isFocused && (
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
            <CheckCircle size={16} className="text-green-500" />
          </div>
        )}
      </div>
      
      {error && (
        <div className="form-error-message">
          <AlertCircle size={16} className="mr-1" />
          {error}
        </div>
      )}
      
      {helpText && !error && (
        <p className="text-sm text-gray-500 mt-1">{helpText}</p>
      )}
    </div>
  );
};

export default FormField;