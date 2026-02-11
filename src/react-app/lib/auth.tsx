import { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from './supabase';
import type { User, Session } from '@supabase/supabase-js';

interface AuthContextType {
    user: any | null;
    session: Session | null;
    loading: boolean;
    isPending: boolean;
    loginWithGoogle: () => Promise<void>;
    logout: () => Promise<void>;
    redirectToLogin: () => void;
}

const AuthContext = createContext<AuthContextType>({
    user: null,
    session: null,
    loading: true,
    isPending: true,
    loginWithGoogle: async () => { },
    logout: async () => { },
    redirectToLogin: () => { },
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [user, setUser] = useState<any | null>(null);
    const [session, setSession] = useState<Session | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Check active session
        supabase.auth.getSession().then(({ data: { session } }) => {
            setSession(session);
            if (session?.user) {
                formatUser(session.user)
                    .then(setUser)
                    .catch(err => console.error("Auth format error:", err))
                    .finally(() => setLoading(false));
            } else {
                setLoading(false);
            }
        }).catch(err => {
            console.error("Auth getSession error:", err);
            setLoading(false);
        });

        // Listen for changes
        const {
            data: { subscription },
        } = supabase.auth.onAuthStateChange(async (_event, session) => {
            setSession(session);
            if (session?.user) {
                try {
                    const formatted = await formatUser(session.user);
                    setUser(formatted);
                } catch (err) {
                    console.error("Auth OnChange format error:", err);
                }
            } else {
                setUser(null);
            }
            setLoading(false);
        });

        return () => subscription.unsubscribe();
    }, []);

    const formatUser = async (authUser: User) => {
        // Fetch profile from public users table
        const { data: profile } = await supabase
            .from('users')
            .select('*')
            .eq('email', authUser.email)
            .single();

        return {
            id: authUser.id, // Supabase Auth ID
            email: authUser.email,
            google_user_data: {
                name: authUser.user_metadata.full_name || authUser.email,
                picture: authUser.user_metadata.avatar_url,
            },
            ...authUser.user_metadata,
            // Merge profile data if exists
            ...(profile || {}),
            // Ensure these exist if profile is missing
            name: profile?.name || authUser.user_metadata.full_name || authUser.user_metadata.name || authUser.email,
            role: profile?.role || 'normal',
            reputation_points: profile?.reputation_points || 0,
            is_banned: profile?.is_banned || false,
        };
    };

    const loginWithGoogle = async () => {
        await supabase.auth.signInWithOAuth({
            provider: 'google',
            options: {
                redirectTo: `${window.location.origin}/auth/callback`,
            },
        });
    };

    const logout = async () => {
        await supabase.auth.signOut();
        setUser(null);
        setSession(null);
    };

    const redirectToLogin = () => {
        loginWithGoogle();
    };

    return (
        <AuthContext.Provider value={{
            user,
            session,
            loading,
            isPending: loading,
            loginWithGoogle,
            logout,
            redirectToLogin
        }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
