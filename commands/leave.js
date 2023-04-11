module.exports = {
    name: 'leave',
    aliases: ['l'],
    description: 'Wychodzi z kanału',
    async execute(message, args, cmd, client, Discord){
        const voiceChannel = message.member.voice.channel;

        if(!voiceChannel) return message.channel.send('Musisz być na kanale, żeby bot wyszedł');
        await voiceChannel.leave();

        const nauraEmbed = new Discord.MessageEmbed()
        .setColor('#cc0000')
        .setTitle('Miłego dnia i smacznej kawusi')
        .setImage('https://i1.sndcdn.com/artworks-dBuyTwsLRZFdwF6F-4AGJ5A-t500x500.jpg');

        await message.channel.send(nauraEmbed);
    }
}