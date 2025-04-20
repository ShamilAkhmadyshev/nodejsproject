function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min)
}

function generateUserData() {
    return {
        rate: getRandomInt(1, 5),
        completedMeetings: getRandomInt(0, 200),
        image: `https://picsum.photos/500/300`,
    }
}

module.exports = {
    generateUserData
}