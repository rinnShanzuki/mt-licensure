/* SERVICE: Handles database interactions using Supabase. */

const DBService = {
    // ---- Progress Tracking ----
    
    async loadProgress(userId) {
        const { data, error } = await sbClient
            .from('user_progress')
            .select('progress_data')
            .eq('user_id', userId)
            .single();

        if (error) {
            if (error.code === 'PGRST116') {
                // Not found, meaning new user. Return empty progress.
                return {};
            }
            console.error("Error loading progress:", error);
            throw error;
        }

        return data ? data.progress_data : {};
    },

    async saveProgress(userId, progressData) {
        // Upsert progress (insert if not exists, update if exists)
        const { error } = await sbClient
            .from('user_progress')
            .upsert({ 
                user_id: userId, 
                progress_data: progressData 
            });

        if (error) {
            console.error("Error saving progress:", error);
            throw error;
        }
    },

    // ---- Access Code Unlocking ----

    async verifyCodeUnused(code) {
        // Allows an unauthenticated user to check if a code is valid and unused
        const { data, error } = await sbClient
            .from('access_codes')
            .select('is_used')
            .eq('code', code)
            .single();
            
        if (error) {
            return { success: false, message: 'Invalid access code.' };
        }
        if (data.is_used) {
            return { success: false, message: 'This code has already been claimed.' };
        }
        return { success: true };
    },

    async checkAndClaimCode(userId, code) {
        // Attempt to claim the code. RLS policies ensure this only works
        // if the code exists, is_used is false, and we are an authenticated user.
        const { data, error } = await sbClient
            .from('access_codes')
            .update({ 
                is_used: true, 
                used_by: userId,
                used_at: new Date().toISOString()
            })
            .eq('code', code)
            .eq('is_used', false)
            .select()
            .single();

        if (error) {
            // If error or no rows returned, the code is invalid or already used
            return { success: false, message: 'Invalid or already used access code.' };
        }

        return { success: true };
    },

    async hasUserUnlocked(userId) {
        const { data, error } = await sbClient
            .from('access_codes')
            .select('code')
            .eq('used_by', userId)
            .limit(1);

        if (error) {
            console.error("Error checking unlock status:", error);
            return false;
        }

        return data && data.length > 0;
    }
};
