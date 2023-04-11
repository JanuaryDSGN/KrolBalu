require('dotenv').config();
const Discord = require('discord.js');
const ytdl = require('ytdl-core');
const ytSearch = require('yt-search');
const yts = require('yt-search');

const queue = new Map();

const nauraEmbed = new Discord.MessageEmbed()
.setColor('#9000e3')
.setTitle('Miłego dnia i smacznej kawusi')
.setImage('https://i1.sndcdn.com/artworks-dBuyTwsLRZFdwF6F-4AGJ5A-t500x500.jpg');

module.exports = {
    name: 'play',
    aliases: ['p', 'skip', 's', 'queue', 'q', 'nowplaying', 'np', 'seek', 'stop'],
    cooldown: 0,
    permissions: [],
    description: 'Advanced music bot',
    async execute(message, args, cmd, client, Discord){
        let role = message.guild.roles.cache.find(r => r.name.toLowerCase() === 'dj');
        
        if(message.member.roles.cache.some(r => r.name.toLowerCase() === 'dj')){
            const voice_channel = message.member.voice.channel;

            if(!voice_channel) return message.channel.send('Musisz być na kanale, żeby puszczać muzykę');
            const permissions = voice_channel.permissionsFor(message.client.user);
            if(!permissions.has('CONNECT')) return message.channel.send('Nie masz wystarczających uprawnień');
            if(!permissions.has('SPEAK')) return message.channel.send('Nie masz wystarczających uprawnień');

            const server_queue = queue.get(message.guild.id);

            if(cmd === 'play' || cmd === 'p'){
                if(!args.length) return message.channel.send('Musisz wpisać frazę by móc wyszukać muzykę');
                let song = {};

                if(ytdl.validateURL(args[0])){
                    const song_info = await ytdl.getInfo(args[0]);
                    song = { info: song_info, title: song_info.videoDetails.title, description: song_info.videoDetails.description, url: song_info.videoDetails.video_url, thumbnail: song_info.thumbnail_url, timestamp: song_info.timestamp, ago: song_info.videoDetails.published, views: song_info.videoDetails.viewCount, requester: message.author }
                } else {
                    const video_finder = async(query) => {
                        const videoResult = await ytSearch(query);
                        return (videoResult.videos.length > 1) ? videoResult.videos[0] : null;
                    }

                    const video = await video_finder(args.join(' '));
                    if(video){
                        song = { title: video.title, description: video.description, url: video.url, thumbnail: video.thumbnail, timestamp: video.timestamp, ago: video.ago, views: video.views, requester: message.author }
                    } else {
                        message.channel.send('Error finding video');
                    }
                }

                if(!server_queue){
                    const queue_constructor = {
                        voice_channel: voice_channel,
                        text_channel: message.channel,
                        connection: null,
                        songs: []
                    }
    
                    queue.set(message.guild.id, queue_constructor);
                    queue_constructor.songs.push(song);
    
                    try{
                        const connection = await voice_channel.join();
                        queue_constructor.connection = connection;
                        video_player(message.guild, queue_constructor.songs[0]);
                    } catch(err){
                        queue.delete(message.guild.id);
                        message.channel.send('Błąd był jakiś ło tego');
                        throw err;
                    }
                } else {
                    server_queue.songs.push(song);
                    return message.channel.send(`▶️ **${song.title}** dodane do kolejki`);
                }
            } else if(cmd ==='queue' || cmd === 'q') {
                get_queue(message, server_queue);
            } else if(cmd ==='nowplaying' || cmd === 'np') {
                get_current(message, server_queue);
            }
            else if(cmd === 'skip' || cmd === 's') skip_song(message, server_queue);
            else if(cmd === 'stop') stop_song(message, server_queue);
        } else {
            message.channel.reply('Nie masz roli by użyć tej komendy byq :cold_face:');
        }
    }
}

const video_player = async(guild, song) => {
    const song_queue = queue.get(guild.id);

    if(!song){
        song_queue.voice_channel.leave();
        queue.delete(guild.id);
        await song_queue.text_channel.send(nauraEmbed);
        return;
    }
    const stream = ytdl(song.url, { filter: 'audioonly' });
    song_queue.connection.play(stream, { seek: 0, volume: process.env.VOLUME })
    .on('finish', () => {
        song_queue.songs.shift();
        video_player(guild, song_queue.songs[0]);
    });
    await song_queue.text_channel.send(`:sunglasses: Teraz bangla **${song.title}**`);
}

const get_queue = (message, server_queue) => {
    if(!server_queue){
        return message.channel.send('Nie ma nic w kolejce');
    }

    let index = 1;
    let string = '';

        if(server_queue.songs[0]) string += `**${server_queue.songs[0].title}**\nRequested by ${server_queue.songs[0].requester.tag}\n\n`;
        if(server_queue.songs[1]) string += `▶️ **Reszta kolejki:**\n ${server_queue.songs.slice(1, 10).map(x => `${index++}) **${x.title}**\nRequested by ${x.requester.tag}`).join("\n")}`;

    const queueEmbed = new Discord.MessageEmbed()
    .setColor('#9000e3')
    .setTitle(':sunglasses: **Teraz bangla**')
    .setThumbnail(server_queue.songs[0].thumbnail)
    .setDescription(string)
    .setTimestamp()
    .setFooter('Strona 1/1');
    
    message.channel.send(queueEmbed);
}

const get_current = (message, server_queue) => {
    if(!server_queue){
        return message.channel.send('Nic teraz nie leci mordo');
    }
    const currentEmbed = new Discord.MessageEmbed()
    .setColor('#9000e3')
    .setTitle(server_queue.songs[0].title)
    .setURL(server_queue.songs[0].url)
    .setDescription(server_queue.songs[0].description)
    .addFields(
        { name: '\u200B', value: '\u200B' },
        { name: 'Length:', value: server_queue.songs[0].timestamp, inline: true },
        { name: 'Uploaded:', value: server_queue.songs[0].ago, inline: true },
        { name: 'Views:', value: server_queue.songs[0].views, inline: true }
    )
    .setImage(server_queue.songs[0].thumbnail)
    .setTimestamp()
    .setFooter(`Requested by: ${server_queue.songs[0].requester.tag}`)

    message.channel.send(currentEmbed);
}

const skip_song = (message, server_queue) => {
    if(!message.member.voice.channel) return message.channel.send('Nie ma cię na kanale byq');
    if(!server_queue){
        return message.channel.send('Nie ma czego pominąć wariacie');
    }
    server_queue.connection.dispatcher.end();
}

const stop_song = (message, server_queue) => {
    if(!message.member.voice.channel) return message.channel.send('Nie ma cię na kanale byq');
    server_queue.songs = [];
    server_queue.connection.dispatcher.end();
}