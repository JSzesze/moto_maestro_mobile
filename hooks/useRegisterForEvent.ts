import { supabase } from '@/utils/supabase';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Alert } from 'react-native';

type RegisterParams = {
    eventId: string;
    classId: string;
    profileId: string;
    driverName: string;
    driverEmail: string;
    kartNumber?: string;
};

export function useRegisterForEvent() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ eventId, classId, profileId, driverName, driverEmail, kartNumber }: RegisterParams) => {
            const { data, error } = await supabase
                .from('entries')
                .insert({
                    event_id: eventId,
                    class_id: classId,
                    profile: profileId,
                    driver_name: driverName,
                    driver_email: driverEmail,
                    kart_number: kartNumber,
                    status: 'pending', // Default status
                })
                .select()
                .single();

            if (error) {
                throw error;
            }

            return data;
        },
        onSuccess: () => {
            Alert.alert('Registration Successful', 'You have been registered for the event!');
            queryClient.invalidateQueries({ queryKey: ['my-entries'] });
        },
        onError: (error) => {
            Alert.alert('Registration Failed', error.message);
        },
    });
}
