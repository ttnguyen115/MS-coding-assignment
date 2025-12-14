import DOMPurify from "dompurify";

export function sanitizeDescription(dirty: string): string {
  if (!dirty || typeof dirty !== "string") {
    return "";
  }

  const clean = DOMPurify.sanitize(dirty, {
    ALLOWED_TAGS: [],
    ALLOWED_ATTR: [],
    KEEP_CONTENT: true,
  });

  return clean.trim();
}

export function validateDescription(description: string): {
  isValid: boolean;
  error?: string;
} {
  if (!description || typeof description !== "string") {
    return { isValid: false, error: "Description is required" };
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

  return { isValid: true };
}
