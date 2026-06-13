const key = 'onboardState';

function getStateFromStorage() {
    try {
        return localStorage.getItem(key);
    } catch (e) {
        console.error('Failed to get state from storage', e);
        return null;
    }
}

function saveStateToStorage(state) {
    try {
        localStorage.setItem(key, state);
    } catch (e) {
        console.error('Failed to save state to storage', e);
    }
}

export { getStateFromStorage, saveStateToStorage };