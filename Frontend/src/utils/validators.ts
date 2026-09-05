export interface PasswordValidationResult {
  isValid: boolean;
  score: number; // 0 - 4
  label: string;
  color: string;
  hasMinLength: boolean;
  hasUppercase: boolean;
  hasLowercase: boolean;
  hasNumber: boolean;
  hasSpecialChar: boolean;
  errors: string[];
}

export function validatePassword(password: string): PasswordValidationResult {
  const hasMinLength = password.length >= 8;
  const hasUppercase = /[A-Z]/.test(password);
  const hasLowercase = /[a-z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const hasSpecialChar = /[^a-zA-Z0-9]/.test(password);

  const errors: string[] = [];
  if (!hasMinLength) errors.push("Password must be at least 8 characters");
  if (!hasUppercase) errors.push("Include at least one uppercase letter (A-Z)");
  if (!hasLowercase) errors.push("Include at least one lowercase letter (a-z)");
  if (!hasNumber) errors.push("Include at least one number (0-9)");
  if (!hasSpecialChar) errors.push("Include at least one special character (!@#$%^&*)");

  let score = 0;
  if (hasMinLength) score++;
  if (hasUppercase && hasLowercase) score++;
  if (hasNumber) score++;
  if (hasSpecialChar) score++;

  const labels = ["Very Weak", "Weak", "Fair", "Strong"];
  const colors = ["#ef4444", "#f59e0b", "#3b82f6", "#10b981"];

  // Valid if minimum length + at least 3 criteria satisfied
  const isValid = hasMinLength && (hasUppercase || hasLowercase) && (hasNumber || hasSpecialChar);

  return {
    isValid,
    score,
    label: score ? labels[score - 1] : "Too short",
    color: score ? colors[score - 1] : "#4a6a8a",
    hasMinLength,
    hasUppercase,
    hasLowercase,
    hasNumber,
    hasSpecialChar,
    errors,
  };
}

export function validateEmail(email: string): boolean {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email.trim());
}
