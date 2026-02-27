import { httpsCallable } from 'firebase/functions';
import { functions } from './firebase';

export const DesignService = {
    async submitProject(data) {
        try {
            const submitDesignServiceFn = httpsCallable(functions, 'submitDesignService');
            const result = await submitDesignServiceFn(data);
            return result.data;
        } catch (error) {
            console.error('Design service error:', error);
            return {
                success: false,
                message: error.message || 'Failed to submit design request.'
            };
        }
    }
};
