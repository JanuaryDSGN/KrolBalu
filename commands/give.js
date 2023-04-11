const profileModel = require('../models/profileSchema');

module.exports = {
    name: 'give',
    aliases: [],
    permissions: ["ADMINISTRATOR"],
    description: 'Give a player some coins',
    async execute(message, args, cmd, client, Discord, profileData){
        if(!args.length) return message.channel.send('Musisz podać nazwę użytkownika któremu chcesz dać hajs');
        const amount = args[1];
        const target = message.mentions.users.first();
        if(!target) return message.channel.send('Nie ma takiego typa');

        if(amount % 1 != 0 || amount <= 0) return message.channel.send('Dać możesz tylko pełną ilość kremówek (bez miejsc po przecinku)');

        try{
            const targetData = await profileModel.findOne({ userID: target.id });
            if(!targetData) return message.channel.send('Nie ma takiego typa w bazie');

            await profileModel.findOneAndUpdate({
                userID: target.id
            }, {
                $inc: {
                    kremówki: amount
                }
            });

            return message.channel.send(`Dałeś ${amount} kremówek dla ${target.tag}`);
        }catch(err){
            console.log(err);
        }
    }
}