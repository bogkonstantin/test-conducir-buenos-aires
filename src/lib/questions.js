function getQuestions(category) {
    category = category.toUpperCase();

    if (category === 'A') {
        return require('../../static/api/questions/category-a.json');
    } else if (category === 'B') {
        return require('../../static/api/questions/category-b.json');
    } else {
        throw new Error('Unknown category: ' + category);
    }
}

export { getQuestions };