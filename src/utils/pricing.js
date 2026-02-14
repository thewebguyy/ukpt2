/**
 * Calculate the total price for a product.
 * - Bulk pricing: tier.price is the TOTAL price for that tier quantity (e.g., 50 stickers for £25).
 * - Standard pricing: unit price * quantity, plus any customization surcharges.
 */
export const calculateTotalPrice = (product, quantity, customization = {}) => {
    if (!product) return 0;

    // Handle Bulk Pricing — tier.price is the fixed total for that tier
    if (product.hasBulkPricing && product.bulkPricing && product.bulkPricing.length > 0) {
        const tiers = [...product.bulkPricing].sort((a, b) => b.quantity - a.quantity);
        const applicableTier = tiers.find(tier => quantity >= tier.quantity);

        if (applicableTier) {
            return applicableTier.price;
        }
    }

    // Standard Pricing
    let unitPrice = product.price || 0;

    // Customization surcharges
    if (customization.printLocation === 'Front & Back') {
        unitPrice += 5;
    }

    return unitPrice * quantity;
};
