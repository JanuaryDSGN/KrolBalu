module.exports = {
    name: 'ping',
    aliases: [],
    description: 'Mrozi dla Króla',
    execute(message, args, cmd, client, Discord){
        message.channel.send(':cold_face:');
    }
}