exports.getDate = () => {
    const date = new Date();
    const options = {
        weekday: 'long',
        day: 'numeric',
        month: 'short',
        year: 'numeric'
    }

    return date.toLocaleString('en-US', options);
}