export interface ProcessingFile {
  medium: File;
  small: File;
  large: File;
  image?: any;
  imageLoaded: boolean;
  isUploading: boolean;
  isUploaded: boolean;
}
