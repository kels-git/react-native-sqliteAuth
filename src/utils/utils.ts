import {REGEXVALIDATORS} from 'src/models/validators';

export const getColorValue = (colorClass: string, tailwind: any): string => {
  const style = tailwind(colorClass);
  return style.color as string;
};

export const validationHelpers = {
  isRequired: (value: string | null | undefined, fieldName: string) => {
    if (!value || value.trim() === '') {
      return `${fieldName} is required.`;
    }
    return null;
  },

  hasSpecialCharacters: (value: string, fieldName: string, allowedPattern: RegExp): string | null => {
    if (!allowedPattern.test(value)) {
      return `${fieldName} contains invalid characters`;
    }
    return null;
  },

  minLength: (value: string, minLen: number, fieldName: string) => {
    if (!value || value.trim().length < minLen) {
      return `${fieldName} must be at least ${minLen} characters.`;
    }
    return null;
  },
};
