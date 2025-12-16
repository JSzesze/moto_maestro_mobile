import { useAuth } from '@/contexts/AuthContext';
import { Team, TeamMember } from '@/types/supabase';
import { supabase } from '@/utils/supabase';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

export function useMyTeams() {
    const { session } = useAuth();

    return useQuery({
        queryKey: ['my-teams', session?.user?.id],
        queryFn: async () => {
            if (!session?.user?.id) throw new Error('No user ID');

            const { data, error } = await supabase
                .from('team_members')
                .select(`
          *,
          teams (*)
        `)
                .eq('profile', session.user.id);

            if (error) {
                throw error;
            }

            return data as (TeamMember & { teams: Team })[];
        },
        enabled: !!session?.user?.id,
    });
}

export function useTeam(id: string) {
    return useQuery({
        queryKey: ['team', id],
        queryFn: async () => {
            const { data, error } = await supabase
                .from('teams')
                .select(`
          *,
          team_members (
            *,
            profiles (*)
          )
        `)
                .eq('id', id)
                .single();

            if (error) {
                throw error;
            }

            return data;
        },
        enabled: !!id,
    });
}

export function useUpdateTeam() {
    const { session } = useAuth();
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ id, updates }: { id: string; updates: Partial<Team> }) => {
            const { data, error } = await supabase
                .from('teams')
                .update({
                    ...updates,
                    updated_by: session?.user?.id,
                })
                .eq('id', id)
                .select();

            if (error) {
                throw error;
            }

            if (!data || data.length === 0) {
                throw new Error('Unable to update team. You may not have permission.');
            }

            return data[0] as Team;
        },
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: ['team', data.id] });
            queryClient.invalidateQueries({ queryKey: ['my-teams'] });
        },
    });
}
