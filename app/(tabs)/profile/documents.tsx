import { useColorScheme } from '@/components/useColorScheme';
import Colors from '@/constants/Colors';
import { DOCUMENT_TYPES, useDocuments, useUploadDocument } from '@/hooks/useDocuments';
import { supabase } from '@/utils/supabase';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import * as DocumentPicker from 'expo-document-picker';
import { Stack } from 'expo-router';
import { ActivityIndicator, Alert, Linking, Pressable, RefreshControl, ScrollView, StyleSheet, Text, View } from 'react-native';

export default function DocumentsScreen() {
    const { data: documents, isLoading, refetch } = useDocuments();
    const { mutate: uploadDocument, isPending: isUploading } = useUploadDocument();
    const colorScheme = useColorScheme();
    const isDark = colorScheme === 'dark';
    const theme = Colors[colorScheme ?? 'light'];

    const handlePickDocument = async (type: string) => {
        try {
            const result = await DocumentPicker.getDocumentAsync({
                type: ['application/pdf', 'image/*'],
                copyToCacheDirectory: true,
            });

            if (result.canceled) return;

            const file = result.assets[0];

            if (file.size && file.size > 5 * 1024 * 1024) {
                Alert.alert('File too large', 'Please select a file smaller than 5MB');
                return;
            }

            uploadDocument({ file, documentType: type as any });

        } catch (err) {
            console.error('Error picking document:', err);
            Alert.alert('Error', 'Failed to pick document');
        }
    };

    const handleViewDocument = async (path: string) => {
        try {
            console.log('[Documents] Attempting to get signed URL for path:', path);
            
            const { data, error } = await supabase.storage
                .from('documents')
                .createSignedUrl(path, 3600);
            
            if (error) {
                console.error('[Documents] Signed URL error:', error);
                // Try public URL as fallback
                const { data: publicData } = supabase.storage
                    .from('documents')
                    .getPublicUrl(path);
                
                if (publicData?.publicUrl) {
                    console.log('[Documents] Using public URL:', publicData.publicUrl);
                    Linking.openURL(publicData.publicUrl);
                    return;
                }
                
                Alert.alert('Error', `Could not access document: ${error.message}`);
                return;
            }
            
            if (data?.signedUrl) {
                console.log('[Documents] Opening signed URL');
                Linking.openURL(data.signedUrl);
            } else {
                Alert.alert('Error', 'Could not generate download link');
            }
        } catch (error: any) {
            console.error('[Documents] Error viewing document:', error);
            Alert.alert('Error', error.message || 'Failed to open document');
        }
    };

    const getDocIcon = (type: string): string => {
        switch (type) {
            case 'racing_license': return 'id-card';
            case 'medical_certificate': return 'heartbeat';
            case 'insurance': return 'shield';
            case 'vehicle_registration': return 'car';
            default: return 'file-text-o';
        }
    };

    if (isLoading) {
        return (
            <View style={[styles.container, styles.centered]}>
                <ActivityIndicator size="large" color={theme.tint} />
            </View>
        );
    }

    const uploadedCount = DOCUMENT_TYPES.filter(dt => 
        documents?.some(d => d.document_type === dt.type)
    ).length;

    return (
        <ScrollView 
            style={[styles.container, isDark && styles.containerDark]}
            contentInsetAdjustmentBehavior="automatic"
            contentContainerStyle={styles.content}
            refreshControl={<RefreshControl refreshing={isLoading} onRefresh={refetch} />}
        >
            <Stack.Screen options={{ title: 'Documents' }} />

            {/* Status Summary */}
            <View style={[styles.summaryCard, isDark && styles.summaryCardDark]}>
                <View style={styles.summaryIcon}>
                    <FontAwesome name="folder-open" size={24} color="#00D4FF" />
                </View>
                <View style={styles.summaryContent}>
                    <Text style={[styles.summaryTitle, isDark && styles.textLight]}>
                        Document Status
                    </Text>
                    <Text style={styles.summarySubtitle}>
                        {uploadedCount} of {DOCUMENT_TYPES.length} required documents uploaded
                    </Text>
                </View>
                <View style={[
                    styles.statusBadge,
                    uploadedCount === DOCUMENT_TYPES.length ? styles.statusComplete : styles.statusIncomplete
                ]}>
                    <Text style={styles.statusText}>
                        {uploadedCount === DOCUMENT_TYPES.length ? 'Complete' : 'Incomplete'}
                    </Text>
                </View>
            </View>

            {/* Uploading indicator */}
            {isUploading && (
                <View style={[styles.uploadingBar, isDark && styles.uploadingBarDark]}>
                    <ActivityIndicator size="small" color="#00D4FF" />
                    <Text style={styles.uploadingText}>Uploading document...</Text>
                </View>
            )}

            {/* Document Cards */}
            <Text style={[styles.sectionTitle, isDark && styles.sectionTitleDark]}>
                REQUIRED DOCUMENTS
            </Text>

            <View style={[styles.documentsGroup, isDark && styles.documentsGroupDark]}>
                {DOCUMENT_TYPES.map((docType, index) => {
                    const userDoc = documents?.find((d) => d.document_type === docType.type);
                    const isUploaded = !!userDoc;

                    return (
                        <Pressable
                            key={docType.type}
                            onPress={() => isUploaded 
                                ? handleViewDocument(userDoc.file_url) 
                                : handlePickDocument(docType.type)
                            }
                            style={({ pressed }) => [
                                styles.documentRow,
                                index < DOCUMENT_TYPES.length - 1 && styles.documentRowBorder,
                                isDark && styles.documentRowDark,
                                pressed && styles.documentRowPressed,
                            ]}
                        >
                            {/* Icon */}
                            <View style={[
                                styles.docIconContainer,
                                isUploaded ? styles.docIconUploaded : styles.docIconMissing,
                            ]}>
                                <FontAwesome 
                                    name={getDocIcon(docType.type) as any} 
                                    size={18} 
                                    color={isUploaded ? '#fff' : (isDark ? '#666' : '#999')} 
                                />
                            </View>

                            {/* Content */}
                            <View style={styles.docContent}>
                                <Text style={[styles.docTitle, isDark && styles.textLight]}>
                                    {docType.label}
                                </Text>
                                {isUploaded ? (
                                    <View style={styles.docMeta}>
                                        <FontAwesome name="check-circle" size={12} color="#34C759" />
                                        <Text style={styles.docMetaText}>
                                            Uploaded {new Date(userDoc.created_at).toLocaleDateString()}
                                        </Text>
                                    </View>
                                ) : (
                                    <Text style={styles.docMissing}>Tap to upload</Text>
                                )}
                            </View>

                            {/* Action */}
                            <View style={[
                                styles.actionButton,
                                isUploaded ? styles.actionView : styles.actionUpload,
                            ]}>
                                <FontAwesome 
                                    name={isUploaded ? 'external-link' : 'cloud-upload'} 
                                    size={14} 
                                    color={isUploaded ? '#007AFF' : '#fff'} 
                                />
                            </View>
                        </Pressable>
                    );
                })}
            </View>

            {/* Upload History */}
            {documents && documents.length > 0 && (
                <>
                    <Text style={[styles.sectionTitle, isDark && styles.sectionTitleDark, { marginTop: 32 }]}>
                        UPLOAD HISTORY
                    </Text>

                    <View style={[styles.historyGroup, isDark && styles.historyGroupDark]}>
                        {documents.map((doc, index) => (
                            <Pressable
                                key={doc.id}
                                onPress={() => handleViewDocument(doc.file_url)}
                                style={({ pressed }) => [
                                    styles.historyRow,
                                    index < documents.length - 1 && styles.historyRowBorder,
                                    isDark && styles.historyRowDark,
                                    pressed && styles.historyRowPressed,
                                ]}
                            >
                                <View style={styles.historyFileIcon}>
                                    <FontAwesome name="file-o" size={20} color={isDark ? '#666' : '#ccc'} />
                                </View>
                                <View style={styles.historyContent}>
                                    <Text style={[styles.historyName, isDark && styles.textLight]} numberOfLines={1}>
                                        {doc.file_name}
                                    </Text>
                                    <Text style={styles.historyMeta}>
                                        {DOCUMENT_TYPES.find(t => t.type === doc.document_type)?.label} • {new Date(doc.created_at).toLocaleDateString()}
                                    </Text>
                                </View>
                                <FontAwesome name="chevron-right" size={12} color={isDark ? '#444' : '#ccc'} />
                            </Pressable>
                        ))}
                    </View>
                </>
            )}

            <Text style={styles.footerNote}>
                Supported formats: PDF, JPEG, PNG (max 5MB)
            </Text>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f7',
    },
    containerDark: {
        backgroundColor: '#000',
    },
    centered: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    content: {
        padding: 16,
        paddingBottom: 40,
    },

    // Summary Card
    summaryCard: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 16,
        marginBottom: 24,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 2,
    },
    summaryCardDark: {
        backgroundColor: '#1c1c1e',
    },
    summaryIcon: {
        width: 48,
        height: 48,
        borderRadius: 12,
        backgroundColor: 'rgba(0,212,255,0.1)',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 12,
    },
    summaryContent: {
        flex: 1,
    },
    summaryTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#000',
        marginBottom: 2,
    },
    summarySubtitle: {
        fontSize: 13,
        color: '#888',
    },
    statusBadge: {
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 12,
    },
    statusComplete: {
        backgroundColor: 'rgba(52,199,89,0.15)',
    },
    statusIncomplete: {
        backgroundColor: 'rgba(255,149,0,0.15)',
    },
    statusText: {
        fontSize: 11,
        fontWeight: '600',
        color: '#FF9500',
    },

    // Uploading
    uploadingBar: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(0,212,255,0.1)',
        padding: 12,
        borderRadius: 8,
        marginBottom: 16,
        gap: 10,
    },
    uploadingBarDark: {
        backgroundColor: 'rgba(0,212,255,0.15)',
    },
    uploadingText: {
        color: '#00D4FF',
        fontSize: 14,
        fontWeight: '500',
    },

    // Section Title
    sectionTitle: {
        fontSize: 12,
        fontWeight: '600',
        color: '#888',
        letterSpacing: 1,
        marginBottom: 8,
        marginLeft: 4,
    },
    sectionTitleDark: {
        color: '#666',
    },

    // Documents Group
    documentsGroup: {
        backgroundColor: '#fff',
        borderRadius: 12,
        overflow: 'hidden',
    },
    documentsGroupDark: {
        backgroundColor: '#1c1c1e',
    },
    documentRow: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 14,
        backgroundColor: '#fff',
    },
    documentRowDark: {
        backgroundColor: '#1c1c1e',
    },
    documentRowBorder: {
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderBottomColor: '#e5e5e5',
    },
    documentRowPressed: {
        backgroundColor: '#f5f5f5',
    },
    docIconContainer: {
        width: 40,
        height: 40,
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 12,
    },
    docIconUploaded: {
        backgroundColor: '#34C759',
    },
    docIconMissing: {
        backgroundColor: '#f0f0f0',
    },
    docContent: {
        flex: 1,
    },
    docTitle: {
        fontSize: 16,
        fontWeight: '500',
        color: '#000',
        marginBottom: 2,
    },
    docMeta: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    docMetaText: {
        fontSize: 13,
        color: '#34C759',
    },
    docMissing: {
        fontSize: 13,
        color: '#FF9500',
    },
    actionButton: {
        width: 32,
        height: 32,
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center',
    },
    actionView: {
        backgroundColor: 'rgba(0,122,255,0.1)',
    },
    actionUpload: {
        backgroundColor: '#00D4FF',
    },

    // History
    historyGroup: {
        backgroundColor: '#fff',
        borderRadius: 12,
        overflow: 'hidden',
    },
    historyGroupDark: {
        backgroundColor: '#1c1c1e',
    },
    historyRow: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 12,
        backgroundColor: '#fff',
    },
    historyRowDark: {
        backgroundColor: '#1c1c1e',
    },
    historyRowBorder: {
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderBottomColor: '#e5e5e5',
    },
    historyRowPressed: {
        backgroundColor: '#f5f5f5',
    },
    historyFileIcon: {
        width: 36,
        height: 44,
        borderWidth: 1,
        borderColor: '#e5e5e5',
        borderRadius: 4,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 12,
        backgroundColor: '#fafafa',
    },
    historyContent: {
        flex: 1,
    },
    historyName: {
        fontSize: 14,
        fontWeight: '500',
        color: '#000',
        marginBottom: 2,
    },
    historyMeta: {
        fontSize: 12,
        color: '#888',
    },

    // Footer
    footerNote: {
        textAlign: 'center',
        fontSize: 12,
        color: '#999',
        marginTop: 24,
    },

    // Utilities
    textLight: {
        color: '#fff',
    },
});
