function chokhlaMessage(name, email, password) {
    return `🙏 नमस्कार!

✅ आपका खाता सफलतापूर्वक बना लिया गया है! 🎉

🙋‍♂️ आपका स्वागत है पंचाल समाज पोर्टल पर!

👤 नाम: ${name}
📧 ईमेल: ${email}
🔑 पासवर्ड: ${password}
🧩 भूमिका: CHOKHLA_MEMBER

🚪 नीचे दिए गए विवरणों का उपयोग करके लॉगिन करें:
🌐 पोर्टल लिंक: https://panchalsamaj14.shreetripurasundari.com/

धन्यवाद और शुभकामनाएं! 🙏`;
}

function villageMemberMessage(name, email, password) {
    return `🙏 नमस्कार!

✅ आपका खाता सफलतापूर्वक बना लिया गया है! 🎉

🏡 आपका स्वागत है पंचाल समाज पोर्टल पर, ग्राम सदस्य के रूप में!

👤 नाम: ${name}
📧 ईमेल: ${email}
🔑 पासवर्ड: ${password}
🧩 भूमिका: VILLAGE_MEMBER

🚪 नीचे दिए गए विवरणों का उपयोग करके लॉगिन करें:
🌐 पोर्टल लिंक: https://panchalsamaj14.shreetripurasundari.com/

आपके सहयोग के लिए धन्यवाद! 🙏`;
}

module.exports = {
    chokhlaMessage,
    villageMemberMessage
};
