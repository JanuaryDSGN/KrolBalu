module.exports = {
    name: 'clear',
    aliases: ['c'],
    cooldown: 10,
    permissions: ['ADMINISTRATOR', 'MANAGE_MESSAGES'],
    description: 'Czyszczenie czatu',
    async execute(message, args, cmd, client, Discord){
        if(!args[0]) return message.reply('Byq ile wiadomości usunąć?');
        if(isNaN(args[0])) return message.reply('Ale gościu wpisz ilość');

        if(args[0] > 100) return message.reply('Max 100 wiadomości mogę usunąć');
        if(args[0] < 1) return message.reply(`No i jak pajacu mam usunąć ${args[0]} wiadomości`);

        await message.channel.messages.fetch({limit: args[0]}).then(messages => {
            message.channel.bulkDelete(messages);
        })
    }
}