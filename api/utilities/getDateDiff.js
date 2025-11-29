const getDateDiff = (date1, date2) => {
    const diffMs = new Date(date1) - new Date(date2);
    const totalSeconds = Math.floor(diffMs / 1000);
    const days = Math.floor(totalSeconds / (3600 * 24));
    const hours = Math.floor((totalSeconds % (3600 * 24)) / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    // const diff = (`${days} days, ${hours} hours, ${minutes} minutes, ${seconds} seconds`);
    const diff = { days, hours, minutes, seconds }
    return diff
}

export default getDateDiff