export const calculateTotalPrice = (product, quantity, customization = {}) => {
    if (!product) return 0;

    // Handle Bulk Pricing
    if (product.hasBulkPricing && product.bulkPricing && product.bulkPricing.length > 0) {
        // Sort tiers by quantity descending
        const tiers = [...product.bulkPricing].sort((a, b) => b.quantity - a.quantity);
        // Find highest applicable tier
        const applicableTier = tiers.find(tier => quantity >= tier.quantity);

        if (applicableTier) {
            return applicableTier.price; // Bulk price is usually fixed for the quantity or per unit? 
            // Based on original code: "return applicableTier.price;" suggesting it's the total for that tier or the unit price?
            // Actually, looking at original code: "let unitPrice = product.price || 0;" ... "return unitPrice * quantity;"
            // If applicableTier.price is returned directly, it might be the unit price for that tier.
            // Let's re-verify product.html: "return applicableTier.price;" 
            // It seems it returns the unit price at that tier level? Or the total?
            // "const totalPrice = calculateTotalPrice(currentProduct, currentQuantity);" -> then it uses it directly.
            // Usually stickers are £X for 50. So it's the total.
        }
    }

    // Standard Pricing
    let unitPrice = product.price || 0;

    // Customizations
    if (customization.printLocation === 'Front & Back') {
        unitPrice += 5;
    }

    return unitPrice * quantity;
};
