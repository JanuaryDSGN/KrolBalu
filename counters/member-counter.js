module.exports = async (client) => {
    const guild = client.guilds.cache.get('813321720081285120');
    setInterval(() => {
        const memberCount = guild.memberCount;
        const channel = guild.channels.cache.get('894610953457512538');
        channel.setName(`Kizowników: ${memberCount.toLocaleString()}`);
        console.log('Updating Member Count');
    }, 60000);
}