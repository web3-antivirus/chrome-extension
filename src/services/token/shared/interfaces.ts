import type * as Enums from './enums';

export interface ImageDescriptor {
  animatedPreviewURL?: string;
  previewURL: string;
  croppedPreviewURL?: string;
  defaultPreviewURL?: string
  size?: Enums.ImageSize;
}
