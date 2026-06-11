
function getKey(postfix) {
    return `state${postfix}`;
}

function getProgressFromStorage(postfix) {
    const key = getKey(postfix);

    try {
        return localStorage.getItem(key);
    } catch (e) {
        console.error('Failed to get progress from storage', e);
        return null;
    }
}

function saveProgressToStorage(postfix, progress) {
    if (!postfix) throw new Error('Postfix is required');
    const key = getKey(postfix);

    try {
        localStorage.setItem(key, progress);
    } catch (e) {
        console.error('Failed to save progress to storage', e);
    }
}

export { getProgressFromStorage, saveProgressToStorage };