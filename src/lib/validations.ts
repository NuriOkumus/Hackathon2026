// Common validation regex patterns
export const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
export const PHONE_REGEX = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/;
export const GITHUB_REGEX = /^https:\/\/(www\.)?github\.com\/.+$/;
export const LINKEDIN_REGEX = /^https:\/\/(www\.)?linkedin\.com\/.+$/;

// Error Types
export type ValidationErrors = Record<string, string>;

// Shared Helpers
export const validateEmail = (email: string): string | null => {
    if (!email) return "E-posta adresi zorunludur";
    if (!EMAIL_REGEX.test(email)) return "Geçerli bir e-posta adresi giriniz";
    return null;
};

export const validatePhone = (phone: string): string | null => {
    if (!phone) return "Telefon numarası zorunludur";
    if (!PHONE_REGEX.test(phone)) return "Geçerli bir telefon numarası giriniz (örn: +905321234567)";
    return null;
};

export const validateUrl = (url: string, regex: RegExp, required: boolean, errorMsg: string): string | null => {
    if (!url && required) return "Bu alan zorunludur";
    if (url && !regex.test(url)) return errorMsg;
    return null;
};

export const validateRequired = (value: string | number | null, errorMsg: string = "Bu alan zorunludur"): string | null => {
    if (value === null || value === undefined || value === "") return errorMsg;
    return null;
};
