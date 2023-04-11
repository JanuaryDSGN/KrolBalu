const profileModel = require('../models/profileSchema');

module.exports = {
    name: 'deposit',
    aliases: ['dep'],
    permissions: [],
    description: 'Deposit coint into your bank',
    async execute(message, args, cmd, client, Discord, profileData){
        const amount = args[0];
        if(amount % 1 != 0 || amount <= 0) return message.channel.send('Wpłacić możesz tylko pełną ilość kremówek (bez miejsc po przecinku)');
        try{
            if(amount > profileData.kremówki) return message.channel.send('Nie masz tyle kremówek gołodupcu');
            await profileModel.findOneAndUpdate({
                userID: message.author.id
            }, {
                $inc: {
                    kremówki: -amount,
                    bank: amount
                },
            });

            return message.channel.send(`Przelałeś ${amount} kremówek do banku`);
        }catch(err){
            console.log(err);
        }
    }
}