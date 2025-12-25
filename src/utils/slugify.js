import slugifyLib from 'slugify';

// Generate URL-friendly slug from title
export const slugify = (text) => {
    return slugifyLib(text, {
        lower: true,
        strict: true,
        remove: /[*+~.()'"!:@]/g
    });
};

// Generate unique slug with timestamp
export const generateUniqueSlug = (title) => {
    const baseSlug = slugify(title);
    const timestamp = Date.now().toString(36);
    return `${baseSlug}-${timestamp}`;
};
