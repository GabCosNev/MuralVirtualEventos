const IMAGE_TYPES = [
  { mime: 'image/jpeg', format: 'jpg' },
  { mime: 'image/png', format: 'png' },
  { mime: 'image/webp', format: 'webp' },
];

export const IMAGE_MAX_SIZE_BYTES = 2 * 1024 * 1024;

export const IMAGE_MIME_REGEX = new RegExp(`^(${IMAGE_TYPES.map((type) => type.mime).join('|')})$`);

export const IMAGE_ALLOWED_FORMATS = IMAGE_TYPES.map((type) => type.format);
