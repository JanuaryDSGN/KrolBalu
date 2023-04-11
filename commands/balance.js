module.exports = {
    name: 'balance',
    aliases: ['bal', 'bl'],
    permissions: [],
    description: 'Check the balance',
    execute(message, args, cmd, client, Discord, profileData){
        const balanceEmbed = new Discord.MessageEmbed()
        .setColor('#9000e3')
        .setAuthor(`${message.author.username}'s Balance`, `https://cdn.discordapp.com/avatars/${message.author.id}/${message.author.avatar}.png`)
        .setDescription(`Kremówki: **${profileData.kremówki}**\nBank: **${profileData.bank}**`)
        message.channel.send(balanceEmbed);
    }
}