/**
 * Email helper utilities: sanitization, formatting, validation
 */

/**
 * Escape HTML to prevent XSS
 * @param {string} str - Raw string
 * @returns {string}
 */
export function escapeHtml(str) {
    if (str == null) return '';
    return String(str)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
}

/**
 * Sanitize name - limit length and remove problematic characters
 * @param {string} name - Raw name
 * @param {number} maxLength - Max characters (default 100)
 * @returns {string}
 */
export function sanitizeName(name, maxLength = 100) {
    if (!name || typeof name !== 'string') return '';
    return name
        .replace(/[<>"']/g, '')
        .trim()
        .slice(0, maxLength);
}

/**
 * Format order items as HTML table rows
 * @param {Array<{name: string, quantity: number, price: number}>} items
 * @returns {string}
 */
export function formatOrderItemsHtml(items) {
    if (!Array.isArray(items) || items.length === 0) return '';

    return items
        .map(
            (item) =>
                `<tr><td>${escapeHtml(item.name || 'Item')}</td><td>${item.quantity || 1}</td><td>£${Number(item.price || 0).toFixed(2)}</td></tr>`
        )
        .join('');
}

/**
 * Format currency for display
 * @param {number} amount
 * @returns {string}
 */
export function formatCurrency(amount) {
    return `£${Number(amount || 0).toFixed(2)}`;
}

/**
 * Format date for display (DD/MM/YYYY)
 * @param {Date|string} date
 * @returns {string}
 */
export function formatDate(date) {
    const d = date ? new Date(date) : new Date();
    return d.toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' });
}
