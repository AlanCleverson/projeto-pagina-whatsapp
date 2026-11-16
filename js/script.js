"use strict";

// Número de WhatsApp da Luana, em formato internacional e sem símbolos.
const WHATSAPP_NUMBER = "5538998417651";

// Os links com data-whatsapp continuam levando diretamente ao WhatsApp.
// O botão flutuante do chatbot não usa esse atributo e abre o chat local.
document.querySelectorAll("[data-whatsapp]").forEach((link) => {
    const message = link.dataset.message ||
        "Olá, Luana! Gostaria de informações sobre seus serviços.";

    link.href = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
    link.target = "_blank";
    link.rel = "noopener noreferrer";
});