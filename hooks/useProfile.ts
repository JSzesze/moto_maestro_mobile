import { useAuth } from '@/contexts/AuthContext';
import { Profile } from '@/types/supabase';
import { supabase } from '@/utils/supabase';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

export function useProfile() {
    const { session } = useAuth();

    return useQuery({
        queryKey: ['profile', session?.user?.id],
        queryFn: async () => {
            if (!session?.user?.id) throw new Error('No user ID');

            const { data, error } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', session.user.id)
                .single();

            if (error) {
                throw error;
            }

            return data as Profile;
        },
        enabled: !!session?.user?.id,
    });
}

export function useUpdateProfile() {
    const { session } = useAuth();
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (updates: Partial<Profile>) => {
            if (!session?.user?.id) throw new Error('No user ID');

            const { data, error } = await supabase
                .from('profiles')
                .update(updates)
                .eq('id', session.user.id)
                .select();

            if (error) {
                throw error;
            }

            if (!data || data.length === 0) {
                throw new Error('Unable to update profile. Please try again.');
            }

            return data[0] as Profile;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['profile', session?.user?.id] });
        },
    });
}
