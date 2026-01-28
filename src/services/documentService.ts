import { supabase } from '../lib/supabase';

export interface Document {
  id: string;
  owner_id: string;
  participant_id?: string;
  document_type: 'service_agreement' | 'risk_assessment' | 'incident_report' | 'support_plan' | 'compliance' | 'medical' | 'identification' | 'other';
  filename: string;
  original_filename: string;
  file_type: string;
  file_size: number;
  file_path: string;
  access_permissions: string[];
  is_secure: boolean;
  access_level: 'private' | 'shared' | 'public';
  shared_with: string[];
  expiry_date?: string;
  tags: string[];
  metadata: any;
  uploaded_by: string;
  created_at: string;
  updated_at: string;
}

export interface UploadDocumentData {
  file: File;
  owner_id: string;
  participant_id?: string;
  document_type: string;
  access_level?: string;
  shared_with?: string[];
  expiry_date?: string;
  tags?: string[];
  metadata?: any;
}

class DocumentService {
  private readonly BUCKET_NAME = 'documents';

  async initializeBucket(): Promise<void> {
    if (!supabase) throw new Error('Supabase not configured');

    const { data: buckets, error: listError } = await supabase.storage.listBuckets();

    if (listError) {
      console.warn('Could not list buckets:', listError);
      return;
    }

    const bucketExists = buckets?.some(b => b.name === this.BUCKET_NAME);

    if (!bucketExists) {
      const { error: createError } = await supabase.storage.createBucket(this.BUCKET_NAME, {
        public: false,
        fileSizeLimit: 52428800
      });

      if (createError) {
        console.warn('Could not create bucket:', createError);
      }
    }
  }

  async uploadDocument(documentData: UploadDocumentData): Promise<Document> {
    if (!supabase) throw new Error('Supabase not configured');

    await this.initializeBucket();

    const fileExt = documentData.file.name.split('.').pop();
    const fileName = `${documentData.owner_id}/${Date.now()}_${Math.random().toString(36).substring(7)}.${fileExt}`;

    const { data: uploadData, error: uploadError } = await supabase.storage
      .from(this.BUCKET_NAME)
      .upload(fileName, documentData.file, {
        cacheControl: '3600',
        upsert: false
      });

    if (uploadError) throw uploadError;

    const { data: documentRecord, error: recordError } = await supabase
      .from('documents')
      .insert({
        owner_id: documentData.owner_id,
        participant_id: documentData.participant_id,
        document_type: documentData.document_type,
        filename: fileName,
        original_filename: documentData.file.name,
        file_type: documentData.file.type,
        file_size: documentData.file.size,
        file_path: uploadData.path,
        access_permissions: [],
        is_secure: true,
        access_level: documentData.access_level || 'private',
        shared_with: documentData.shared_with || [],
        expiry_date: documentData.expiry_date,
        tags: documentData.tags || [],
        metadata: documentData.metadata || {},
        uploaded_by: documentData.owner_id
      })
      .select()
      .single();

    if (recordError) throw recordError;

    return documentRecord;
  }

  async getDocument(id: string): Promise<Document | null> {
    if (!supabase) throw new Error('Supabase not configured');

    const { data, error } = await supabase
      .from('documents')
      .select('*')
      .eq('id', id)
      .maybeSingle();

    if (error) throw error;
    return data;
  }

  async getDocuments(filters?: {
    ownerId?: string;
    participantId?: string;
    documentType?: string;
    tags?: string[];
    limit?: number;
    offset?: number;
  }): Promise<{ data: Document[]; count: number }> {
    if (!supabase) throw new Error('Supabase not configured');

    let query = supabase
      .from('documents')
      .select('*', { count: 'exact' });

    if (filters?.ownerId) {
      query = query.eq('owner_id', filters.ownerId);
    }

    if (filters?.participantId) {
      query = query.eq('participant_id', filters.participantId);
    }

    if (filters?.documentType) {
      query = query.eq('document_type', filters.documentType);
    }

    if (filters?.tags && filters.tags.length > 0) {
      query = query.contains('tags', filters.tags);
    }

    if (filters?.limit) {
      query = query.limit(filters.limit);
    }

    if (filters?.offset) {
      query = query.range(filters.offset, filters.offset + (filters.limit || 10) - 1);
    }

    const { data, error, count } = await query.order('created_at', { ascending: false });

    if (error) throw error;
    return { data: data || [], count: count || 0 };
  }

  async downloadDocument(documentId: string): Promise<Blob> {
    if (!supabase) throw new Error('Supabase not configured');

    const document = await this.getDocument(documentId);
    if (!document) throw new Error('Document not found');

    const { data, error } = await supabase.storage
      .from(this.BUCKET_NAME)
      .download(document.file_path);

    if (error) throw error;
    if (!data) throw new Error('Failed to download document');

    return data;
  }

  async getDocumentUrl(documentId: string, expiresIn: number = 3600): Promise<string> {
    if (!supabase) throw new Error('Supabase not configured');

    const document = await this.getDocument(documentId);
    if (!document) throw new Error('Document not found');

    const { data, error } = await supabase.storage
      .from(this.BUCKET_NAME)
      .createSignedUrl(document.file_path, expiresIn);

    if (error) throw error;
    if (!data) throw new Error('Failed to create signed URL');

    return data.signedUrl;
  }

  async deleteDocument(documentId: string): Promise<void> {
    if (!supabase) throw new Error('Supabase not configured');

    const document = await this.getDocument(documentId);
    if (!document) throw new Error('Document not found');

    const { error: storageError } = await supabase.storage
      .from(this.BUCKET_NAME)
      .remove([document.file_path]);

    if (storageError) throw storageError;

    const { error: dbError } = await supabase
      .from('documents')
      .delete()
      .eq('id', documentId);

    if (dbError) throw dbError;
  }

  async shareDocument(documentId: string, userIds: string[]): Promise<Document> {
    if (!supabase) throw new Error('Supabase not configured');

    const document = await this.getDocument(documentId);
    if (!document) throw new Error('Document not found');

    const updatedSharedWith = [...new Set([...document.shared_with, ...userIds])];

    const { data, error } = await supabase
      .from('documents')
      .update({
        shared_with: updatedSharedWith,
        access_level: 'shared'
      })
      .eq('id', documentId)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async unshareDocument(documentId: string, userId: string): Promise<Document> {
    if (!supabase) throw new Error('Supabase not configured');

    const document = await this.getDocument(documentId);
    if (!document) throw new Error('Document not found');

    const updatedSharedWith = document.shared_with.filter(id => id !== userId);

    const { data, error } = await supabase
      .from('documents')
      .update({
        shared_with: updatedSharedWith,
        access_level: updatedSharedWith.length === 0 ? 'private' : 'shared'
      })
      .eq('id', documentId)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async updateDocument(documentId: string, updates: Partial<Document>): Promise<Document> {
    if (!supabase) throw new Error('Supabase not configured');

    const { data, error } = await supabase
      .from('documents')
      .update(updates)
      .eq('id', documentId)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async getExpiringDocuments(daysUntilExpiry: number = 30): Promise<Document[]> {
    if (!supabase) throw new Error('Supabase not configured');

    const futureDate = new Date();
    futureDate.setDate(futureDate.getDate() + daysUntilExpiry);

    const { data, error } = await supabase
      .from('documents')
      .select('*')
      .not('expiry_date', 'is', null)
      .lte('expiry_date', futureDate.toISOString().split('T')[0])
      .gte('expiry_date', new Date().toISOString().split('T')[0])
      .order('expiry_date', { ascending: true });

    if (error) throw error;
    return data || [];
  }

  async getExpiredDocuments(): Promise<Document[]> {
    if (!supabase) throw new Error('Supabase not configured');

    const { data, error } = await supabase
      .from('documents')
      .select('*')
      .not('expiry_date', 'is', null)
      .lt('expiry_date', new Date().toISOString().split('T')[0])
      .order('expiry_date', { ascending: false });

    if (error) throw error;
    return data || [];
  }

  async searchDocuments(searchTerm: string, ownerId?: string): Promise<Document[]> {
    if (!supabase) throw new Error('Supabase not configured');

    let query = supabase
      .from('documents')
      .select('*')
      .or(`original_filename.ilike.%${searchTerm}%,tags.cs.{${searchTerm}}`);

    if (ownerId) {
      query = query.eq('owner_id', ownerId);
    }

    const { data, error } = await query.order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  }
}

export const documentService = new DocumentService();
export default documentService;
