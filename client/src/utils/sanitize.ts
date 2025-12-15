import DOMPurify from "dompurify";

export function sanitizeDescription(unsanitizedDesc: string): string {
  if (!unsanitizedDesc || typeof unsanitizedDesc !== "string") {
    return "";
  }

  const clean = DOMPurify.sanitize(unsanitizedDesc, {
    ALLOWED_TAGS: [],
    ALLOWED_ATTR: [],
    KEEP_CONTENT: true,
  });

  return clean.trim();
}

type ValidationResult = {
  isValid: boolean;
  error?: string;
}

export function validateDescription(description: string): ValidationResult {
  if (!description || typeof description !== "string") {
    return { isValid: false, error: "Description is required" };
  }

  const suspiciousPatterns = [
    /<script/i,
    /javascript:/i,
    /on\w+\s*=/i,
    /<iframe/i,
    /<object/i,
    /<embed/i,
  ];

  for (const pattern of suspiciousPatterns) {
    if (pattern.test(description)) {
      return {
        isValid: false,
        error: "Description contains potentially dangerous content",
      };
    }
  }

  const sanitized = sanitizeDescription(description);

  if (sanitized.length === 0) {
    return { isValid: false, error: "Description cannot be empty" };
  }

  if (sanitized.length > 500) {
    return {
      isValid: false,
      error: "Description is too long (max 500 characters)",
    };
  }

  return { isValid: true };
}
