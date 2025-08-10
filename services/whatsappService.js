const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');

let client;
let clientReady = false;

const initializeWhatsApp = () => {
    if (client) return client;

    console.log('Initializing WhatsApp...');

    client = new Client({
        authStrategy: new LocalAuth(),
    });

    client.on('qr', (qr) => {
        console.log('Scan the QR code below:');
        qrcode.generate(qr, { small: true });
    });

    client.on('ready', () => {
        console.log('✅ WhatsApp client is ready!');
        clientReady = true;
    });

    client.on('auth_failure', (msg) => {
        console.error('❌ Authentication failure:', msg);
    });

    client.on('disconnected', (reason) => {
        console.log('❌ WhatsApp client disconnected:', reason);
        clientReady = false;
    });

    client.initialize();
    return client;
};

const sendMessage = async (number, message) => {
    const chatId = number + '@c.us';
    try {
        const result = await client.sendMessage(chatId, message);
        return { success: true, result };
    } catch (error) {
        return { success: false, error };
    }
};

const isClientReady = () => clientReady;

module.exports = {
    initializeWhatsApp,
    sendMessage,
    isClientReady,
};
