module.exports = {
    name: 'command',
    aliases: [],
    cooldown: 0,
    description: 'Embeds',
    execute(message, args, cmd, client, Discord){
        const newEmbed = new Discord.MessageEmbed()
        .setColor('#304281')
        .setTitle('Rules')
        .setURL('https://www.youtube.com/channel/UChH_GbiCBhJFYou4XVK4Gow')
        .setDescription('Opis')
        .addFields(
            {name: 'Rule 1', value: 'Kizo'},
            {name: 'Rule 2', value: 'Kizo'},
            {name: 'Rule 3', value: 'Kizo'},
            {name: 'Rule 4', value: 'Kizo'},
            {name: 'Rule 5', value: 'Kizo'}
        )
        .setImage('https://rytmy.pl/wp-content/uploads/bfi_thumb/kizo-1-oltwnb9ccsp7aevm8vs5djz2bc9nk2xllactff1s34.jpg')
        .setFooter('Pegas eyy');

        message.channel.send(newEmbed);
    }
}