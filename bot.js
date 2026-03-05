const fs = require('fs');
const TelegramBot = require('node-telegram-bot-api');

// Replace with your bot's API token
const token = '7432253073:AAEXeDaKZ5SnYPkLlGy6GH-N11GzLXxS4Yg';

// Create a new bot instance
const bot = new TelegramBot(token, { polling: true });

// File to store user IDs
const usersFile = 'users.json';

// Load existing user IDs from file (if any)
let users = [];
try {
    const data = fs.readFileSync(usersFile, 'utf8');
    users = JSON.parse(data);
    console.log('Loaded existing user data:', users); // Debugging log
} catch (err) {
    console.log('No existing user data found. Starting fresh.'); // Debugging log
}

// Save user IDs to file
function saveUsers() {
    fs.writeFileSync(usersFile, JSON.stringify(users, null, 2));
    console.log('User data saved to file:', users); // Debugging log
}

console.log("Bot is starting..."); // Debugging log

// Handle the /start command
bot.onText(/\/start/, (msg) => {
    const chatId = msg.chat.id;
    const userId = msg.from.id;
    const botLink = "https://t.me/redpacket_gift_bot/giftbox"; // Your bot's link

    console.log(`Received /start command from chat ID: ${chatId}`); // Debugging log
    console.log(`Sending link: ${botLink}`); // Debugging log

    // Add user ID if not already in the list
    if (!users.includes(userId)) {
        users.push(userId);
        saveUsers(); // Save updated list to file
    }

    // Send a welcome message with the bot link (using Markdown for clickable link)
    bot.sendMessage(
        chatId,
        `Welcome to the Spin Wheel Bot! ??\n\nUse this link to access the game: [Click Here](${botLink})`,
        { parse_mode: 'Markdown' } // Enable Markdown formatting
    );
});

// Handle other messages
bot.on('message', (msg) => {
    const chatId = msg.chat.id;
    const userId = msg.from.id;

    console.log(`Received message: ${msg.text} from chat ID: ${chatId}`); // Debugging log

    // Add user ID if not already in the list
    if (!users.includes(userId)) {
        users.push(userId);
        saveUsers(); // Save updated list to file
    }

    bot.sendMessage(chatId, "Sorry, I don't understand that command. Use /start to begin.");
});

// Handle bot shutdown
process.on('SIGINT', () => {
    console.log('Saving user data before exiting...'); // Debugging log
    saveUsers();
    process.exit();
});

console.log("Bot is running and waiting for messages..."); // Debugging log