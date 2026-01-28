import { supabase } from '../lib/supabase';

const STORAGE_BUCKET = 'documents';

export interface UploadResult {
  path: string;
  url: string;
  size: number;
  type: string;
}

class StorageService {
  async uploadDocument(
    file: File,
    folder: 'workers' | 'participants' | 'general',
    userId: string,
    fileName?: string
  ): Promise<UploadResult> {
    try {
      if (!supabase) {
        return this.mockUpload(file, folder, userId, fileName);
      }

      const fileExt = file.name.split('.').pop();
      const uniqueFileName = fileName || `${userId}_${Date.now()}.${fileExt}`;
      const filePath = `${folder}/${userId}/${uniqueFileName}`;

      const { data, error } = await supabase.storage
        .from(STORAGE_BUCKET)
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (error) throw error;

      const { data: urlData } = supabase.storage
        .from(STORAGE_BUCKET)
        .getPublicUrl(filePath);

      return {
        path: data.path,
        url: urlData.publicUrl,
        size: file.size,
        type: file.type
      };
    } catch (error) {
      console.error('Upload error:', error);
      return this.mockUpload(file, folder, userId, fileName);
    }
  }

  async downloadDocument(path: string): Promise<Blob> {
    try {
      if (!supabase) {
        throw new Error('Storage not configured');
      }

      const { data, error } = await supabase.storage
        .from(STORAGE_BUCKET)
        .download(path);

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Download error:', error);
      throw new Error('Failed to download document');
    }
  }

  async deleteDocument(path: string): Promise<void> {
    try {
      if (!supabase) {
        return;
      }

      const { error } = await supabase.storage
        .from(STORAGE_BUCKET)
        .remove([path]);

      if (error) throw error;
    } catch (error) {
      console.error('Delete error:', error);
      throw new Error('Failed to delete document');
    }
  }

  async getPublicUrl(path: string): Promise<string> {
    try {
      if (!supabase) {
        return `https://placeholder.com/${path}`;
      }

      const { data } = supabase.storage
        .from(STORAGE_BUCKET)
        .getPublicUrl(path);

      return data.publicUrl;
    } catch (error) {
      console.error('Get URL error:', error);
      return `https://placeholder.com/${path}`;
    }
  }

  async listDocuments(folder: string, userId: string): Promise<any[]> {
    try {
      if (!supabase) {
        return [];
      }

      const { data, error } = await supabase.storage
        .from(STORAGE_BUCKET)
        .list(`${folder}/${userId}`);

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('List documents error:', error);
      return [];
    }
  }

  private mockUpload(
    file: File,
    folder: string,
    userId: string,
    fileName?: string
  ): UploadResult {
    const fileExt = file.name.split('.').pop();
    const uniqueFileName = fileName || `${userId}_${Date.now()}.${fileExt}`;
    const filePath = `${folder}/${userId}/${uniqueFileName}`;

    return {
      path: filePath,
      url: `https://placeholder.com/${filePath}`,
      size: file.size,
      type: file.type
    };
  }

  validateFile(file: File, maxSizeMB: number = 10, allowedTypes: string[] = []): { valid: boolean; error?: string } {
    const maxSizeBytes = maxSizeMB * 1024 * 1024;

    if (file.size > maxSizeBytes) {
      return {
        valid: false,
        error: `File size must be less than ${maxSizeMB}MB`
      };
    }

    if (allowedTypes.length > 0 && !allowedTypes.includes(file.type)) {
      return {
        valid: false,
        error: `File type ${file.type} is not allowed. Allowed types: ${allowedTypes.join(', ')}`
      };
    }

    return { valid: true };
  }
}

export const storageService = new StorageService();
export default storageService;
