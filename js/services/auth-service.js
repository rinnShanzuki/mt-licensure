/* SERVICE: Handles user authentication using Supabase. */

const AuthService = {
    async signUp(email, password) {
        const { data, error } = await sbClient.auth.signUp({
            email,
            password,
        });
        if (error) throw error;
        return data;
    },

    async signIn(email, password) {
        const { data, error } = await sbClient.auth.signInWithPassword({
            email,
            password,
        });
        if (error) throw error;
        return data;
    },

    async signOut() {
        const { error } = await sbClient.auth.signOut();
        if (error) throw error;
    },

    async getCurrentUser() {
        const { data: { user } } = await sbClient.auth.getUser();
        return user;
    },

    onAuthStateChange(callback) {
        return sbClient.auth.onAuthStateChange((event, session) => {
            callback(event, session);
        });
    }
};
