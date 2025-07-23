// Simple validation utilities for form data
export interface ValidationRule {
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  min?: number;
  max?: number;
  pattern?: RegExp;
  message?: string;
}

export interface ValidationErrors {
  [key: string]: string[];
}

export class SimpleValidator {
  private errors: ValidationErrors = {};

  validate(
    data: Record<string, any>,
    rules: Record<string, ValidationRule>,
  ): boolean {
    this.errors = {};

    for (const [field, rule] of Object.entries(rules)) {
      const value = data[field];
      const fieldErrors: string[] = [];

      // Required validation
      if (
        rule.required &&
        (!value || (typeof value === 'string' && value.trim() === ''))
      ) {
        fieldErrors.push(rule.message || `${field} is required`);
        continue;
      }

      // Skip other validations if field is empty and not required
      if (!value && !rule.required) continue;

      // String validations
      if (typeof value === 'string') {
        if (rule.minLength && value.length < rule.minLength) {
          fieldErrors.push(
            rule.message ||
              `${field} must be at least ${rule.minLength} characters`,
          );
        }
        if (rule.maxLength && value.length > rule.maxLength) {
          fieldErrors.push(
            rule.message ||
              `${field} must be no more than ${rule.maxLength} characters`,
          );
        }
        if (rule.pattern && !rule.pattern.test(value)) {
          fieldErrors.push(rule.message || `${field} format is invalid`);
        }
      }

      // Number validations
      if (typeof value === 'number') {
        if (rule.min !== undefined && value < rule.min) {
          fieldErrors.push(
            rule.message || `${field} must be at least ${rule.min}`,
          );
        }
        if (rule.max !== undefined && value > rule.max) {
          fieldErrors.push(
            rule.message || `${field} must be no more than ${rule.max}`,
          );
        }
      }

      if (fieldErrors.length > 0) {
        this.errors[field] = fieldErrors;
      }
    }

    return Object.keys(this.errors).length === 0;
  }

  getErrors(): ValidationErrors {
    return this.errors;
  }

  getFieldErrors(field: string): string[] {
    return this.errors[field] || [];
  }

  hasErrors(): boolean {
    return Object.keys(this.errors).length > 0;
  }

  getFirstError(field: string): string | null {
    const fieldErrors = this.getFieldErrors(field);
    return fieldErrors.length > 0 ? fieldErrors[0] : null;
  }
}

// Common validation rules
export const validationRules = {
  email: {
    pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    message: 'Please enter a valid email address',
  },
  phone: {
    pattern: /^[+]?[\d\s\-\(\)]{10,}$/,
    message: 'Please enter a valid phone number',
  },
  url: {
    pattern: /^https?:\/\/.+/,
    message: 'Please enter a valid URL starting with http:// or https://',
  },
  strongPassword: {
    pattern:
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
    message:
      'Password must be at least 8 characters with uppercase, lowercase, number and special character',
  },
  price: {
    min: 0,
    message: 'Price must be a positive number',
  },
  percentage: {
    min: 0,
    max: 100,
    message: 'Percentage must be between 0 and 100',
  },
};

// Course validation schema
export const courseValidationSchema = {
  title: {
    required: true,
    minLength: 3,
    maxLength: 100,
    message: 'Course title must be between 3 and 100 characters',
  },
  description: {
    required: true,
    minLength: 20,
    maxLength: 1000,
    message: 'Course description must be between 20 and 1000 characters',
  },
  price: {
    required: true,
    min: 0,
    message: 'Price must be a positive number',
  },
  category: {
    required: true,
    message: 'Please select a category',
  },
  level: {
    required: true,
    message: 'Please select a difficulty level',
  },
};

// User validation schema
export const userValidationSchema = {
  name: {
    required: true,
    minLength: 2,
    maxLength: 50,
    message: 'Name must be between 2 and 50 characters',
  },
  email: {
    required: true,
    ...validationRules.email,
  },
  phone: {
    required: false,
    ...validationRules.phone,
  },
  role: {
    required: true,
    message: 'Please select a role',
  },
};

// Module validation schema
export const moduleValidationSchema = {
  title: {
    required: true,
    minLength: 3,
    maxLength: 100,
    message: 'Module title must be between 3 and 100 characters',
  },
  description: {
    required: true,
    minLength: 10,
    maxLength: 500,
    message: 'Module description must be between 10 and 500 characters',
  },
  orderIndex: {
    required: true,
    min: 0,
    message: 'Order index must be a positive number',
  },
};

// Lecture validation schema
export const lectureValidationSchema = {
  title: {
    required: true,
    minLength: 3,
    maxLength: 100,
    message: 'Lecture title must be between 3 and 100 characters',
  },
  description: {
    required: true,
    minLength: 10,
    maxLength: 500,
    message: 'Lecture description must be between 10 and 500 characters',
  },
  videoUrl: {
    required: true,
    ...validationRules.url,
    message: 'Please enter a valid video URL',
  },
  duration: {
    required: true,
    min: 1,
    message: 'Duration must be at least 1 minute',
  },
};
