import fs = require('fs');
import { ButtonInteraction, Client, Collection, GatewayIntentBits, Message, Role, SlashCommandBuilder } from "discord.js";
var logger = require('winston');
var messageConfig = require('./react-config.json');
import { token } from './config';

// Configure logger settings
logger.remove(logger.transports.Console);
logger.add(new logger.transports.Console, {
    colorize: true
});
logger.level = 'debug';

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.GuildMessageReactions,
        GatewayIntentBits.MessageContent,
    ]
});


// Login to Discord with your client's token
client.login(token);

var commands = new Collection<String, any>();
var buttons = new Collection<String, any>();
var emojiCodes = {};

// When the client is ready, run this code (only once)
client.once('ready', async () => {
    Object.keys(messageConfig).forEach((key) => {
        var value = messageConfig[key];
        // Emoji codes match their values by default, assuming they are unicode.
        emojiCodes[key] = value;

        var found = client.emojis.cache.find((emoji) => {
            var regex = new RegExp(value);
            if (regex.exec(emoji.name)) {
                return true;
            }
            return false;
        });
        if (found) {
            emojiCodes[key] = found;
        }
    });

    await client.application.fetch().then(async (application) => {
        if (!application?.owner) await application?.fetch();
        const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));
        logger.info(`Registering ${commandFiles.length} command files.`);
        for (var index in commandFiles) {
            const file = commandFiles[index];
            var commandFile = require(`./commands/${file}`);
            const command: SlashCommandBuilder = commandFile.data;
            commands.set(command.name, commandFile);
            logger.info(`Registered command ${command.name}`);
        }

        const buttonFiles = fs.readdirSync('./buttons').filter(file => file.endsWith('.js'));
        for (var index in buttonFiles) {
            const file = buttonFiles[index];
            var buttonFile = require(`./buttons/${file}`);
            buttons.set(buttonFile.customIdPrefix, buttonFile);
            logger.info(`Registered button ${buttonFile.customIdPrefix}`);
        }
    });
    logger.info('Ready!');
});

var lastInteraction = new Date();
lastInteraction.setMinutes(lastInteraction.getMinutes() - 5);

async function _handleButtonPress(interaction: ButtonInteraction) {
    logger.info(`Handling button press ${interaction.customId}. Checking against ${buttons.size} prefixes.`);

    const prefix = interaction.customId.substring(0, interaction.customId.indexOf('-'));
    const button = buttons.get(prefix);
    if (!button) {
        return await interaction.reply({ content: `Error executing button press ${prefix}.`, ephemeral: true });
    }

    if (!_checkAdminPermissions(interaction, button)) {
        interaction.reply({
            content: "You don't have permission to do that.",
            ephemeral: true,
        });
        return false;
    }

    logger.info(`Executing ${prefix} for ${interaction.customId}`);

    button.execute(interaction);
}

function _checkAdminPermissions(interaction: ButtonInteraction, buttonModule: any) {
    if (!buttonModule.requiredRoles) {
        return true;
    }
    var hasAdminPermissions = false;
    var roles: Collection<string, Role> = interaction.member.roles.valueOf() as Collection<string, Role>;
    roles.forEach((role) => {
        if (buttonModule.requiredRoles.indexOf(role.id) >= 0) {
            hasAdminPermissions = true;
        }
    });

    return hasAdminPermissions;
}

client.on('interactionCreate', async interaction => {
    if (interaction.isButton()) {
        return _handleButtonPress(interaction);
    }
    if (!interaction.isCommand()) {
        return;
    }
    var date = new Date(interaction.createdTimestamp);
    logger.info(`${date.toDateString()}: Processing interaction ${interaction.commandName} with options ${JSON.stringify(interaction.options)}`);

    const command = commands.get(interaction.commandName);
    if (!command) return;

    try {
        if (interaction.guild.name == "Liergaard's server" && command.devExecute != undefined) {
            logger.info(`Using ${interaction.commandName}.devExecute.`);
            return await command.devExecute(interaction);
        }
        await command.execute(interaction);
        lastInteraction = new Date();
    } catch (error) {
        console.error(error);
        await interaction.reply({
            content: 'There was an error while executing this command!', ephemeral: true
        });
    }
});

client.on('messageCreate', (message) => {
    _handleMessage(message);
});

var _handleMessage = function (message: Message) {
    if (message.author.id == client.user.id) {
        return;
    }
    if (message.guild.name == "Liergaard's dev server") {
        logger.info(`Processing message: ${message} in dev server ${message.guildId}`);
    }

    if (message.content.match(/\bgood bots?\b/i)) {
        const now = new Date();
        const diff = now.valueOf() - lastInteraction.valueOf();
        if (diff < 5 * 60 * 1000 /* 5 minutes */) {
            message.reply("🍑");
        }
    }

    Object.keys(emojiCodes).forEach((key) => {
        var regex = RegExp(key, 'i');
        var matches = regex.exec(message.content);
        if (matches && matches.length > 0) {
            message.react(emojiCodes[key]).catch((reason) => {
                logger.error(`Could not react to message: no emoji matching ${emojiCodes[key]} found. ${reason}.`);
            });
            lastInteraction = new Date();
        }
    });
}