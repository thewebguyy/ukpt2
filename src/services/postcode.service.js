export const PostcodeService = {
    validate: (postcode) => {
        const regex = /^([G][I][R] 0[A][A]|[A-PR-UWYZ]([0-9]{1,2}|([A-HK-Y][0-9]|[A-HK-Y][0-9]([0-9]|[ABEHMNPRV-Y]))|[0-9][A-HJKSTUW])\s*[0-9][ABD-HJLNP-UW-Z]{2})$/i;
        return regex.test(postcode.trim());
    },

    lookup: async (postcode) => {
        try {
            const response = await fetch(`https://api.postcodes.io/postcodes/${postcode.trim()}`);
            const data = await response.json();
            if (data.status === 200) {
                return {
                    success: true,
                    result: {
                        city: data.result.admin_district || data.result.parish || data.result.town || '',
                        region: data.result.region || '',
                        country: data.result.country || ''
                    }
                };
            }
            return { success: false, message: 'Invalid UK postcode' };
        } catch (err) {
            console.error('Postcode lookup error:', err);
            return { success: false, message: 'Failed to lookup postcode' };
        }
    }
};
