const { default: makeWASocket, useMultiFileAuthState, DisconnectReason } = require('@whiskeysockets/baileys');
const { Boom } = require('@hapi/boom');
const fs = require('fs');

let sock;
let ready = false;

const initializeWhatsApp = async () => {
    const { state, saveCreds } = await useMultiFileAuthState('auth_info_baileys');

    sock = makeWASocket({
        auth: state,
        // ⛔️ DEPRECATED: printQRInTerminal: true,
    });

    sock.ev.on('creds.update', saveCreds);

    // ✅ Handle QR manually
    sock.ev.on('connection.update', (update) => {
        const { connection, lastDisconnect, qr } = update;

        if (qr) {
            console.log('📱 Scan this QR Code to log in:\n');
            console.log(qr); // <- This is the raw QR string
        }

        if (connection === 'close') {
            const shouldReconnect =
                lastDisconnect?.error instanceof Boom &&
                lastDisconnect.error.output?.statusCode !== DisconnectReason.loggedOut;
            console.log('❌ Connection closed. Reconnecting:', shouldReconnect);
            if (shouldReconnect) initializeWhatsApp();
        } else if (connection === 'open') {
            console.log('✅ WhatsApp is ready');
            ready = true;
        }
    });
};

const sendMessage = async (number, text) => {
    const phone = number.startsWith('91') ? number : `91${number}`;
    const jid = `${phone}@s.whatsapp.net`;

    try {
        await sock.sendMessage(jid, { text });
        return { success: true, result: 'Message sent' };
    } catch (error) {
        return { success: false, error };
    }
};

const isClientReady = () => ready;

module.exports = {
    initializeWhatsApp,
    sendMessage,
    isClientReady,
};
