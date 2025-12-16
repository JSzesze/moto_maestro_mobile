import { Event } from '@/types/supabase';
import { supabase } from '@/utils/supabase';
import { useQuery } from '@tanstack/react-query';

export function useEvents() {
    return useQuery({
        queryKey: ['events'],
        queryFn: async () => {
            console.log('Fetching events...');
            const start = Date.now();
            const { data, error } = await supabase
                .from('events')
                .select('*')
                // .eq('status', 'published') // TODO: Uncomment for production
                // .eq('visibility', 'public') // TODO: Uncomment for production
                .order('date_start', { ascending: true });
            const end = Date.now();
            console.log(`Fetched events in ${end - start}ms`);

            if (error) {
                console.error('Error fetching events:', error);
                throw error;
            }

            return data as Event[];
        },
    });
}

export function useEvent(id: string) {
    return useQuery({
        queryKey: ['event', id],
        queryFn: async () => {
            console.log(`Fetching event ${id}...`);
            const start = Date.now();
            const { data, error } = await supabase
                .from('events')
                .select(`
          *,
          classes (*)
        `)
                .eq('id', id)
                .single();
            const end = Date.now();
            console.log(`Fetched event ${id} in ${end - start}ms`);

            if (error) {
                console.error(`Error fetching event ${id}:`, error);
                throw error;
            }

            return data as (Event & { classes: any[] });
        },
        enabled: !!id,
    });
}
