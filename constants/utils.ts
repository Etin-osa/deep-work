export const presentTime = (totalSeconds: number) => {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);

    if (hours > 0) {
        return `${hours}h ${minutes > 0 ? minutes + 'm' : ''}`
    }
    return `${minutes}m`
}