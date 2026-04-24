import { Injectable, inject } from '@angular/core';
import { FileCompressor } from '@capawesome-team/capacitor-file-compressor';
import { FirebaseStorage } from '@capacitor-firebase/storage';
import { Capacitor } from '@capacitor/core';
import { getApp } from 'firebase/app';
import {
  deleteObject,
  getDownloadURL,
  getStorage,
  ref,
  uploadBytes
} from 'firebase/storage';
import { UserService } from './user.service';

export interface UploadFileOptions {
  mimeType: string;
}

export interface UploadSource {
  blob?: Blob;
  path?: string;
  fileName: string;
  mimeType: string;
  size?: number;
}

export interface UploadResult {
  storagePath: string;
  downloadUrl: string;
  fileName: string;
  mimeType: string;
  size?: number;
}

@Injectable({ providedIn: 'root' })
export class StorageService {
  private readonly userService = inject(UserService);

  /** Longest edge for compressed images (matches previous intent; native uses width-only for proportional scale). */
  private readonly imageMaxEdgePx = 1600;

  async uploadTripCover(
    tripId: string,
    fileUri: string,
    fileName: string,
    options: UploadFileOptions
  ): Promise<UploadResult> {
    const uploadSource = await this.prepareUploadSource(
      fileUri,
      fileName,
      options.mimeType
    );
    const storagePath = `users/${this.userService.getUserId()}/trips/${tripId}/cover/${
      uploadSource.fileName
    }`;

    if (Capacitor.isNativePlatform() && uploadSource.path) {
      await this.uploadNativeFile(storagePath, uploadSource.path);
    } else if (uploadSource.blob) {
      const storage = getStorage(getApp());
      await uploadBytes(ref(storage, storagePath), uploadSource.blob, {
        contentType: uploadSource.mimeType
      });
    } else {
      throw new Error('No upload source available for trip cover.');
    }

    const downloadUrl = await this.getDownloadUrl(storagePath);
    return {
      storagePath,
      downloadUrl,
      fileName: uploadSource.fileName,
      mimeType: uploadSource.mimeType,
      size: uploadSource.size
    };
  }

  async uploadProfileAvatar(
    fileUri: string,
    fileName: string,
    options: UploadFileOptions
  ): Promise<UploadResult> {
    const uploadSource = await this.prepareUploadSource(
      fileUri,
      fileName,
      options.mimeType
    );
    const storagePath = `users/${this.userService.getUserId()}/profile/avatar/${
      uploadSource.fileName
    }`;

    if (Capacitor.isNativePlatform() && uploadSource.path) {
      await this.uploadNativeFile(storagePath, uploadSource.path);
    } else if (uploadSource.blob) {
      const storage = getStorage(getApp());
      await uploadBytes(ref(storage, storagePath), uploadSource.blob, {
        contentType: uploadSource.mimeType
      });
    } else {
      throw new Error('No upload source available for profile avatar.');
    }

    const downloadUrl = await this.getDownloadUrl(storagePath);
    return {
      storagePath,
      downloadUrl,
      fileName: uploadSource.fileName,
      mimeType: uploadSource.mimeType,
      size: uploadSource.size
    };
  }

  async uploadFile(
    tripId: string,
    expenseId: string,
    fileUri: string,
    fileName: string,
    options: UploadFileOptions
  ): Promise<UploadResult> {
    const uploadSource = await this.prepareUploadSource(
      fileUri,
      fileName,
      options.mimeType
    );
    const storagePath = `users/${this.userService.getUserId()}/trips/${tripId}/expenses/${expenseId}/${
      uploadSource.fileName
    }`;

    if (Capacitor.isNativePlatform() && uploadSource.path) {
      await this.uploadNativeFile(storagePath, uploadSource.path);
    } else if (uploadSource.blob) {
      const storage = getStorage(getApp());
      await uploadBytes(ref(storage, storagePath), uploadSource.blob, {
        contentType: uploadSource.mimeType
      });
    } else {
      throw new Error('No upload source available for attachment.');
    }

    const downloadUrl = await this.getDownloadUrl(storagePath);
    return {
      storagePath,
      downloadUrl,
      fileName: uploadSource.fileName,
      mimeType: uploadSource.mimeType,
      size: uploadSource.size
    };
  }

  async deleteFile(storagePath: string): Promise<void> {
    try {
      if (Capacitor.isNativePlatform()) {
        await FirebaseStorage.deleteFile({ path: storagePath });
      } else {
        const storage = getStorage(getApp());
        await deleteObject(ref(storage, storagePath));
      }
    } catch {
      // File may have been already deleted
    }
  }

  async getDownloadUrl(storagePath: string): Promise<string> {
    if (Capacitor.isNativePlatform()) {
      const { downloadUrl } = await FirebaseStorage.getDownloadUrl({
        path: storagePath
      });
      return downloadUrl;
    }
    const storage = getStorage(getApp());
    return getDownloadURL(ref(storage, storagePath));
  }

  private async prepareUploadSource(
    fileUri: string,
    fileName: string,
    mimeType: string
  ): Promise<UploadSource> {
    if (!mimeType.startsWith('image/')) {
      if (Capacitor.isNativePlatform()) {
        return {
          path: fileUri,
          fileName,
          mimeType
        };
      }

      const blob = await this.fetchBlob(fileUri);
      return {
        blob,
        fileName,
        mimeType,
        size: blob.size
      };
    }

    try {
      return await this.compressImage(fileUri, fileName, mimeType);
    } catch (error) {
      console.warn(
        'Failed to compress image attachment, uploading original file.',
        error
      );
      if (Capacitor.isNativePlatform()) {
        return {
          path: fileUri,
          fileName,
          mimeType
        };
      }

      const blob = await this.fetchBlob(fileUri);
      return {
        blob,
        fileName,
        mimeType,
        size: blob.size
      };
    }
  }

  private async fetchBlob(fileUri: string): Promise<Blob> {
    const candidateUris = Capacitor.isNativePlatform()
      ? [fileUri, Capacitor.convertFileSrc(fileUri)]
      : [fileUri];

    for (const candidateUri of candidateUris) {
      try {
        const response = await fetch(candidateUri);
        if (response.ok) {
          return await response.blob();
        }
      } catch {
        // Try the next possible URI variant.
      }
    }

    throw new Error('Unable to read attachment for upload.');
  }

  private async compressImage(
    fileUri: string,
    fileName: string,
    mimeType: string
  ): Promise<UploadSource> {
    if (Capacitor.isNativePlatform()) {
      const { path } = await FileCompressor.compressImage({
        path: fileUri,
        mimeType: 'image/jpeg',
        quality: 0.7,
        width: this.imageMaxEdgePx
      });

      return {
        path: path ?? fileUri,
        fileName: this.replaceFileExtension(fileName, 'jpg'),
        mimeType: 'image/jpeg'
      };
    }

    const originalBlob = await this.fetchBlob(fileUri);
    const compressedBlob = await this.downscaleImageToJpegBlob(
      originalBlob,
      this.imageMaxEdgePx,
      0.7
    );

    if (!compressedBlob || compressedBlob.size >= originalBlob.size) {
      return {
        blob: originalBlob,
        fileName,
        mimeType,
        size: originalBlob.size
      };
    }

    return {
      blob: compressedBlob,
      fileName: this.replaceFileExtension(fileName, 'jpg'),
      mimeType: 'image/jpeg',
      size: compressedBlob.size
    };
  }

  /**
   * Web-only: {@link FileCompressor} web implementation sets the canvas to the source size but
   * draws into a smaller destination rect when width/height are passed, producing a tiny image on a
   * large black canvas. We resize correctly here instead.
   */
  private async downscaleImageToJpegBlob(
    blob: Blob,
    maxEdge: number,
    quality: number
  ): Promise<Blob | null> {
    let bitmap: ImageBitmap | null = null;
    try {
      bitmap = await createImageBitmap(blob);
    } catch {
      return null;
    }

    try {
      const w = bitmap.width;
      const h = bitmap.height;
      const scale = Math.min(1, maxEdge / Math.max(w, h));
      const outW = Math.max(1, Math.round(w * scale));
      const outH = Math.max(1, Math.round(h * scale));

      const canvas = document.createElement('canvas');
      canvas.width = outW;
      canvas.height = outH;
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        return null;
      }
      ctx.drawImage(bitmap, 0, 0, outW, outH);

      return await new Promise<Blob | null>((resolve) => {
        canvas.toBlob((b) => resolve(b), 'image/jpeg', quality);
      });
    } finally {
      bitmap.close();
    }
  }

  private async uploadNativeFile(
    storagePath: string,
    fileUri: string
  ): Promise<void> {
    await new Promise<void>((resolve, reject) => {
      FirebaseStorage.uploadFile(
        { path: storagePath, uri: fileUri },
        (event, error) => {
          if (error) {
            reject(error);
          } else if (event?.completed) {
            resolve();
          }
        }
      );
    });
  }

  private replaceFileExtension(fileName: string, extension: string): string {
    const dotIndex = fileName.lastIndexOf('.');
    const baseName = dotIndex > 0 ? fileName.slice(0, dotIndex) : fileName;
    return `${baseName}.${extension}`;
  }
}
