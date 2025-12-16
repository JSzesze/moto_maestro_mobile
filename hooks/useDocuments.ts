import { useAuth } from '@/contexts/AuthContext';
import { Document } from '@/types/supabase';
import { supabase } from '@/utils/supabase';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import * as DocumentPicker from 'expo-document-picker';
import { Alert } from 'react-native';

export type DocumentType = 'license' | 'insurance' | 'medical' | 'tech';

export const DOCUMENT_TYPES: { type: DocumentType; label: string }[] = [
    { type: 'license', label: 'Racing License' },
    { type: 'insurance', label: 'Insurance' },
    { type: 'medical', label: 'Medical Certificate' },
    { type: 'tech', label: 'Tech Inspection' },
];

export function useDocuments() {
    const { session } = useAuth();

    return useQuery({
        queryKey: ['documents', session?.user?.id],
        queryFn: async () => {
            if (!session?.user?.id) throw new Error('No user ID');

            const { data, error } = await supabase
                .from('documents')
                .select('*')
                .eq('profile', session.user.id)
                .order('created_at', { ascending: false });

            if (error) {
                console.error('Error fetching documents:', error);
                throw error;
            }

            return data as Document[];
        },
        enabled: !!session?.user?.id,
    });
}

export function useUploadDocument() {
    const { session } = useAuth();
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({
            file,
            documentType,
        }: {
            file: DocumentPicker.DocumentPickerAsset;
            documentType: DocumentType;
        }) => {
            if (!session?.user?.id) throw new Error('No user ID');

            // 1. Upload file to Supabase Storage
            const timestamp = Date.now();
            const fileExt = file.name.split('.').pop() || 'dat';
            const filePath = `${session.user.id}/${documentType}-${timestamp}.${fileExt}`;

            console.log('[Documents] Uploading file:', { 
                originalName: file.name, 
                path: filePath, 
                mimeType: file.mimeType 
            });

            // Fetch the file as a blob for React Native
            const response = await fetch(file.uri);
            const blob = await response.blob();

            const { data: uploadData, error: uploadError } = await supabase.storage
                .from('documents')
                .upload(filePath, blob, {
                    contentType: file.mimeType || 'application/octet-stream',
                    upsert: false,
                });

            if (uploadError) {
                console.error('[Documents] Upload error:', uploadError);
                throw uploadError;
            }

            console.log('[Documents] Upload successful:', uploadData);

            // 2. Insert record into documents table
            const { data: insertData, error: insertError } = await supabase
                .from('documents')
                .insert({
                    profile: session.user.id,
                    document_type: documentType,
                    file_name: file.name,
                    file_url: filePath,
                })
                .select()
                .single();

            if (insertError) {
                console.error('[Documents] Database insert error:', insertError);
                // Try to clean up the uploaded file if db insert fails
                await supabase.storage.from('documents').remove([filePath]);
                throw insertError;
            }

            console.log('[Documents] Record created:', insertData);
            return insertData;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['documents'] });
            Alert.alert('Success', 'Document uploaded successfully');
        },
        onError: (error) => {
            Alert.alert('Upload Failed', error.message);
        },
    });
}
