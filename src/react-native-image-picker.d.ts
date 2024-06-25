declare module "react-native-image-picker" {
  export interface ImagePickerResponse {
    didCancel: boolean;
    errorCode?: string;
    errorMessage?: string;
    uri?: string;
    width?: number;
    height?: number;
    fileSize?: number;
    type?: string;
    fileName?: string;
    data?: string;
  }

  export interface ImagePickerOptions {
    title?: string;
    cancelButtonTitle?: string;
    takePhotoButtonTitle?: string;
    chooseFromLibraryButtonTitle?: string;
    customButtons?: { name: string; title: string }[];
    cameraType?: "front" | "back";
    mediaType?: "photo" | "video" | "mixed";
    maxWidth?: number;
    maxHeight?: number;
    quality?: number;
    videoQuality?: "low" | "high";
    durationLimit?: number;
    rotation?: number;
    allowsEditing?: boolean;
    noData?: boolean;
    storageOptions?: {
      skipBackup?: boolean;
      path?: string;
      waitUntilSaved?: boolean;
      cameraRoll?: boolean;
      waitUntilReady?: boolean;
    };
  }

  export function showImagePicker(
    options: ImagePickerOptions,
    callback: (response: ImagePickerResponse) => void
  ): void;

  export function launchCamera(
    options: ImagePickerOptions,
    callback: (response: ImagePickerResponse) => void
  ): void;

  export function launchImageLibrary(
    options: ImagePickerOptions,
    callback: (response: ImagePickerResponse) => void
  ): void;
}
