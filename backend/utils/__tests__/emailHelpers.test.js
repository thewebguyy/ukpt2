/**
 * Unit tests for email helpers
 */
import { escapeHtml, sanitizeName, formatOrderItemsHtml, formatCurrency, formatDate } from '../emailHelpers.js';

describe('emailHelpers', () => {
    describe('escapeHtml', () => {
        it('escapes HTML special characters', () => {
            expect(escapeHtml('<script>alert(1)</script>')).toBe('&lt;script&gt;alert(1)&lt;/script&gt;');
            expect(escapeHtml('a & b')).toBe('a &amp; b');
            expect(escapeHtml('"quoted"')).toBe('&quot;quoted&quot;');
        });
        it('handles null and undefined', () => {
            expect(escapeHtml(null)).toBe('');
            expect(escapeHtml(undefined)).toBe('');
        });
    });

    describe('sanitizeName', () => {
        it('removes dangerous characters', () => {
            expect(sanitizeName('<script>')).toBe('script');
            expect(sanitizeName('John "Doe"')).toBe('John Doe');
        });
        it('limits length', () => {
            expect(sanitizeName('a'.repeat(150), 100).length).toBe(100);
        });
    });

    describe('formatOrderItemsHtml', () => {
        it('formats items as table rows', () => {
            const items = [
                { name: 'T-Shirt', quantity: 2, price: 25 },
                { name: 'Mug', quantity: 1, price: 10 }
            ];
            const html = formatOrderItemsHtml(items);
            expect(html).toContain('<tr>');
            expect(html).toContain('T-Shirt');
            expect(html).toContain('£25.00');
        });
        it('handles empty array', () => {
            expect(formatOrderItemsHtml([])).toBe('');
        });
    });

    describe('formatCurrency', () => {
        it('formats as GBP', () => {
            expect(formatCurrency(50)).toBe('£50.00');
            expect(formatCurrency(0)).toBe('£0.00');
        });
    });

    describe('formatDate', () => {
        it('formats as DD/MM/YYYY', () => {
            const d = new Date('2026-02-14');
            expect(formatDate(d)).toMatch(/\d{2}\/\d{2}\/2026/);
        });
    });
});
