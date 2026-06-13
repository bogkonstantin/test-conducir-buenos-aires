const key = 'selectedCategory';
let cachedCategory = null;

const getCategories = () => [
    {
        code: 'A', label: {
            es: 'Categoría A',
            en: 'Category A',
            ru: 'Категория A'
        }
    },
    {
        code: 'B', label: {
            es: 'Categoría B',
            en: 'Category B',
            ru: 'Категория B'
        }
    },
];

function getCategoryFromStorage() {
    if (cachedCategory !== null) {
        return cachedCategory;
    }
    if (typeof window === 'undefined') return null;
    try {
        cachedCategory = localStorage.getItem(key);
        return cachedCategory;
    } catch (e) {
        console.error('Failed to get category from storage', e);
        return null;
    }
}

function saveCategoryToStorage(category) {
    if (!category) throw new Error('Category code is required');
    if (cachedCategory === category) return;
    if (!getCategories().some(c => c.code === category)) {
        throw new Error(`Unsupported category code: ${category}`);
    }

    try {
        localStorage.setItem(key, category);
        cachedCategory = category;
    } catch (e) {
        console.error('Failed to save category to storage', e);
    }
}

export { getCategories, getCategoryFromStorage, saveCategoryToStorage };