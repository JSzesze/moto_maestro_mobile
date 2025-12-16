import { useAuth } from '@/contexts/AuthContext';
import { Entry, Event } from '@/types/supabase';
import { supabase } from '@/utils/supabase';
import { useQuery } from '@tanstack/react-query';

export function useMyEntries() {
    const { session } = useAuth();

    return useQuery({
        queryKey: ['my-entries', session?.user?.id],
        queryFn: async () => {
            if (!session?.user?.id) throw new Error('No user ID');

            console.log('Fetching my entries...');
            const start = Date.now();
            const { data, error } = await supabase
                .from('entries')
                .select(`
          *,
          events (*)
        `)
                .eq('profile', session.user.id)
                .order('created_at', { ascending: false });
            const end = Date.now();
            console.log(`Fetched my entries in ${end - start}ms`);

            if (error) {
                console.error('Error fetching my entries:', error);
                throw error;
            }

            return data as (Entry & { events: Event })[];
        },
        enabled: !!session?.user?.id,
    });
}
