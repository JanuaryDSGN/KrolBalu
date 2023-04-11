const profileModel = require('../models/profileSchema');

module.exports = {
    name: 'withdraw',
    aliases: ['wd'],
    permissions: [],
    description: 'Withdraw coint from your bank',
    async execute(message, args, cmd, client, Discord, profileData){
        const amount = args[0];
        if(amount % 1 != 0 || amount <= 0) return message.channel.send('Wypłacić możesz tylko pełną ilość kremówek (bez miejsc po przecinku)');
        try{
            if(amount > profileData.bank) return message.channel.send('Nie masz tyle w banku gołodupcu');
            await profileModel.findOneAndUpdate({
                userID: message.author.id
            }, {
                $inc: {
                    kremówki: amount,
                    bank: -amount
                },
            });

            return message.channel.send(`Wypłaciłeś ${amount} kremówek`);
        }catch(err){
            console.log(err);
        }
    }
}