import { cfImage } from "./image";


// --- Category definitions ---
export const categoryConfig = {
  landscape: {
    folder: "landscapes",
    label: { he: "נופים", en: "Landscapes" },
  },
  activities: {
    folder: "activities",
    label: { he: "פעילויות", en: "Activities" },
  },
  meals: {
    folder: "meals",
    label: { he: "ארוחות", en: "Meals" },
  },
  accommodation: {
    folder: "accommodation",
    label: { he: "לינה", en: "Accommodation" },
  },
};

// --- Lazy image import using Vite's glob ---
// Note: import.meta.glob paths must be string literals.
// Use one static glob and filter by folder.
const allImagesGlob = import.meta.glob(
  "/public/images/*/*.{jpg,JPG,jpeg,JPEG,png,PNG}",
  { eager: true, as: "url" }
);

const loadCategoryImages = (folder) => {
  const prefix = `/public/images/${folder}/`;
  return Object.fromEntries(
    Object.entries(allImagesGlob).filter(([path]) => path.startsWith(prefix))
  );
};

// --- Build image objects ---
const createImageObjects = (imageMap, category) =>
  Object.entries(imageMap).map(([path, url], index) => ({
    id: `${category}-${index + 1}`,
    url: cfImage(url.replace("/public", "")),
    filename: path.split("/").pop(),
    category,
  }));

// --- Export a single loader function ---
export const loadAllGalleryImages = () => {
  const allImages = [];

  for (const [category, cfg] of Object.entries(categoryConfig)) {
    const imageMap = loadCategoryImages(cfg.folder);
    const images = createImageObjects(imageMap, category);
    allImages.push(...images);
  }

  return allImages;
};

// --- Helper to get shuffled subset (for preview) ---
export const getGalleryPreview = (limit = 8) => {
  const all = loadAllGalleryImages();
  const shuffled = [...all].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, limit);
};
