/**
 * Email validation and sanitization middleware
 */
import validator from 'validator';

const DISPOSABLE_DOMAINS = [
    'tempmail.com',
    'throwaway.email',
    'guerrillamail.com',
    '10minutemail.com',
    'mailinator.com',
    'yopmail.com'
];

/**
 * Validate email format and reject disposable domains
 * @param {string} email
 * @returns {{ valid: boolean, error?: string }}
 */
export function validateEmail(email) {
    if (!email || typeof email !== 'string') {
        return { valid: false, error: 'Email is required' };
    }

    const trimmed = email.trim().toLowerCase();
    if (!trimmed) {
        return { valid: false, error: 'Email is required' };
    }

    if (!validator.isEmail(trimmed)) {
        return { valid: false, error: 'Invalid email format' };
    }

    const domain = trimmed.split('@')[1]?.toLowerCase();
    if (domain && DISPOSABLE_DOMAINS.some((d) => domain.includes(d))) {
        return { valid: false, error: 'Please use a permanent email address' };
    }

    return { valid: true };
}

/**
 * Sanitize text input - limit length, strip dangerous chars
 * @param {string} value
 * @param {number} maxLength
 * @returns {string}
 */
export function sanitizeText(value, maxLength = 100) {
    if (!value || typeof value !== 'string') return '';
    return value.replace(/[<>"']/g, '').trim().slice(0, maxLength);
}

/**
 * Express middleware: validate email in body
 */
export function requireEmail(req, res, next) {
    const email = req.body?.email;
    const result = validateEmail(email);
    if (!result.valid) {
        return res.status(400).json({ success: false, message: result.error, error: result.error });
    }
    req.body.email = email.trim().toLowerCase();
    next();
}

/**
 * Express middleware: validate newsletter subscription body
 */
export function validateNewsletterSubscribe(req, res, next) {
    const { email, firstName } = req.body || {};

    const emailResult = validateEmail(email);
    if (!emailResult.valid) {
        return res.status(400).json({ success: false, message: emailResult.error, error: emailResult.error });
    }

    if (!firstName || typeof firstName !== 'string' || firstName.trim().length < 2) {
        return res.status(400).json({
            success: false,
            message: 'First name is required and must be at least 2 characters',
            error: 'Invalid first name'
        });
    }

    req.body.email = email.trim().toLowerCase();
    req.body.firstName = sanitizeText(firstName, 100);
    req.body.lastName = sanitizeText(req.body.lastName || '', 100);
    next();
}
