import React, { useState } from 'react';
import { useToast } from '../hooks/useToast';
import { SimpleValidator, ValidationErrors } from '../utils/validation';
import EnhancedButton from './EnhancedButton';

interface FormFieldProps {
  label: string;
  type?: 'text' | 'email' | 'number' | 'textarea' | 'select' | 'url';
  name: string;
  value: any;
  onChange: (value: any) => void;
  options?: { label: string; value: string }[];
  placeholder?: string;
  errors?: string[];
  required?: boolean;
  className?: string;
}

const FormField: React.FC<FormFieldProps> = ({
  label,
  type = 'text',
  name,
  value,
  onChange,
  options = [],
  placeholder,
  errors = [],
  required = false,
  className = '',
}) => {
  const hasErrors = errors.length > 0;

  const renderInput = () => {
    const baseInputClasses = `
      w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 transition-colors
      ${
        hasErrors
          ? 'border-red-500 focus:ring-red-200 focus:border-red-500'
          : 'border-gray-300 focus:ring-primary/20 focus:border-primary dark:border-gray-600'
      }
      dark:bg-gray-700 dark:text-white
    `;

    switch (type) {
      case 'textarea':
        return (
          <textarea
            name={name}
            value={value || ''}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            rows={4}
            className={baseInputClasses}
          />
        );

      case 'select':
        return (
          <select
            name={name}
            value={value || ''}
            onChange={(e) => onChange(e.target.value)}
            className={baseInputClasses}
          >
            <option value="">Select {label}</option>
            {options.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        );

      case 'number':
        return (
          <input
            type="number"
            name={name}
            value={value || ''}
            onChange={(e) => onChange(Number(e.target.value))}
            placeholder={placeholder}
            className={baseInputClasses}
          />
        );

      default:
        return (
          <input
            type={type}
            name={name}
            value={value || ''}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            className={baseInputClasses}
          />
        );
    }
  };

  return (
    <div className={`space-y-1 ${className}`}>
      <label
        htmlFor={name}
        className="block text-sm font-medium text-gray-700 dark:text-gray-300"
      >
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      {renderInput()}
      {hasErrors && (
        <div className="text-red-500 text-sm space-y-1">
          {errors.map((error, index) => (
            <p key={index}>{error}</p>
          ))}
        </div>
      )}
    </div>
  );
};

interface EnhancedFormProps {
  title: string;
  onSubmit: (data: Record<string, any>) => Promise<void> | void;
  validationSchema?: Record<string, any>;
  initialData?: Record<string, any>;
  fields: Omit<FormFieldProps, 'value' | 'onChange' | 'errors'>[];
  submitText?: string;
  cancelText?: string;
  onCancel?: () => void;
  className?: string;
}

const EnhancedForm: React.FC<EnhancedFormProps> = ({
  title,
  onSubmit,
  validationSchema = {},
  initialData = {},
  fields,
  submitText = 'Submit',
  cancelText = 'Cancel',
  onCancel,
  className = '',
}) => {
  const [formData, setFormData] = useState(initialData);
  const [validationErrors, setValidationErrors] = useState<ValidationErrors>(
    {},
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { showSuccess, showError } = useToast();

  const updateField = (name: string, value: any) => {
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Clear validation error for this field when user starts typing
    if (validationErrors[name]) {
      setValidationErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate form data
    if (Object.keys(validationSchema).length > 0) {
      const validator = new SimpleValidator();
      const isValid = validator.validate(formData, validationSchema);

      if (!isValid) {
        setValidationErrors(validator.getErrors());
        showError('Please fix the validation errors and try again');
        return;
      }
    }

    setIsSubmitting(true);

    try {
      await onSubmit(formData);
      showSuccess(`${title} saved successfully!`);

      // Reset form if no initial data (new item)
      if (Object.keys(initialData).length === 0) {
        setFormData({});
      }
    } catch (error) {
      console.error('Form submission error:', error);
      showError(`Failed to save ${title.toLowerCase()}. Please try again.`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      className={`bg-white dark:bg-boxdark rounded-lg shadow-lg p-6 ${className}`}
    >
      <h2 className="text-xl font-semibold text-black dark:text-white mb-6">
        {title}
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        {fields.map((field) => (
          <FormField
            key={field.name}
            {...field}
            value={formData[field.name]}
            onChange={(value) => updateField(field.name, value)}
            errors={validationErrors[field.name]}
          />
        ))}

        <div className="flex space-x-3 pt-4">
          <EnhancedButton
            type="submit"
            variant="primary"
            loading={isSubmitting}
            loadingText="Saving..."
            className="flex-1"
          >
            {submitText}
          </EnhancedButton>

          {onCancel && (
            <EnhancedButton
              type="button"
              variant="outline"
              onClick={onCancel}
              disabled={isSubmitting}
              className="flex-1"
            >
              {cancelText}
            </EnhancedButton>
          )}
        </div>
      </form>
    </div>
  );
};

export default EnhancedForm;
