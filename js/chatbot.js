
"use strict";

(() => {
  const WHATSAPP_NUMBER = "5538998417651";
  const INSTAGRAM_URL = "https://www.instagram.com/jluanaa_s/";

  const services = [
    ["Fibra de vidro", "R$ 140,00"],
    ["Manutenção", "R$ 90,00"],
    ["Unha em gel (Molde F1)", "R$ 140,00"],
    ["Banho em gel", "R$ 90,00"],
    ["Blindagem", "R$ 60,00"],
    ["Manicure pé e mão", "R$ 45,00"],
    ["Somente pé ou mão", "R$ 25,00"]
  ];

  const launcher = document.getElementById("lu-chat-launcher");
  const chatWindow = document.getElementById("lu-chat-window");
  const closeButton = document.getElementById("lu-chat-close");
  const messages = document.getElementById("lu-chat-messages");
  const options = document.getElementById("lu-chat-options");
  const form = document.getElementById("lu-chat-form");
  const input = document.getElementById("lu-chat-text");

  if (
    !launcher ||
    !chatWindow ||
    !closeButton ||
    !messages ||
    !options ||
    !form ||
    !input
  ) return;

  let conversationStarted = false;
  let greetingTimers = [];

  function later(callback, delay) {
    const timer = window.setTimeout(callback, delay);
    greetingTimers.push(timer);
  }

  function clearGreetingTimers() {
    greetingTimers.forEach(window.clearTimeout);
    greetingTimers = [];
  }

  function normalizeText(text) {
    return text
      .toLocaleLowerCase("pt-BR")
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .trim();
  }

  function scrollToBottom() {
    messages.scrollTop = messages.scrollHeight;
  }

  function addMessage(text, type = "bot") {
    const bubble = document.createElement("div");
    bubble.className = `lu-chat-message ${type}`;
    bubble.textContent = text;

    const time = document.createElement("span");
    time.className = "lu-chat-time";
    time.textContent = new Date().toLocaleTimeString("pt-BR", {
      hour: "2-digit",
      minute: "2-digit"
    });

    bubble.appendChild(time);
    messages.appendChild(bubble);
    scrollToBottom();

    return bubble;
  }

  function addOptions(items) {
    options.replaceChildren();

    items.forEach(({ label, action, external = false }) => {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "lu-chat-option";
      button.textContent = label;

      button.addEventListener("click", () => {
        options.replaceChildren();
        addMessage(label, "user");

        if (external) {
          action();
        } else {
          later(action, 280);
        }
      });

      options.appendChild(button);
    });

    scrollToBottom();
  }

  function openWhatsApp(message) {
    const url =
      `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;

    const opened = window.open(
      url,
      "_blank",
      "noopener,noreferrer"
    );

    if (!opened) {
      const bubble = addMessage(
        "O navegador não abriu o WhatsApp automaticamente. Use o link abaixo para continuar seu atendimento:"
      );

      const link = document.createElement("a");
      link.className = "lu-chat-link";
      link.href = url;
      link.target = "_blank";
      link.rel = "noopener noreferrer";
      link.textContent = "Abrir conversa no WhatsApp";

      bubble.appendChild(link);
      scrollToBottom();
    }
  }

  function goToWhatsApp(message) {
    openWhatsApp(message);
  }

  function mainMenu() {
    options.replaceChildren();

    addMessage(
      "Como posso ajudar você? 💗\n\n" +
      "Digite o número da opção desejada:\n\n" +
      "1 - Conhecer os serviços\n" +
      "2 - Consultar preços\n" +
      "3 - Tirar dúvidas\n" +
      "4 - Agendar horário\n" +
      "5 - Falar com a Luana\n\n" +
      "Você também pode escrever sua dúvida ou o nome de um serviço."
    );
  }

  function backToMenu() {
    options.replaceChildren();
    addMessage("Claro! Vamos voltar ao início. 😊");
    later(mainMenu, 350);
  }

  function addBackButton() {
    addOptions([
      {
        label: "↩ Voltar ao menu principal",
        action: backToMenu
      }
    ]);
  }

  function showServices() {
    options.replaceChildren();

    addMessage(
      "Estes são os serviços oferecidos pela Luana: 💅\n\n" +
      "• Fibra de vidro\n" +
      "• Unha em gel (Molde F1)\n" +
      "• Banho em gel / Blindagem\n" +
      "• Esmaltação em gel\n" +
      "• Manicure tradicional\n" +
      "• Pedicure tradicional\n\n" +
      "Se desejar saber mais sobre algum procedimento, " +
      "digite o nome dele aqui. 💗"
    );

    addOptions([
      {
        label: "💰 Consultar preços",
        action: showPrices
      },
      {
        label: "↩ Voltar ao menu principal",
        action: backToMenu
      }
    ]);
  }

  function showPrices() {
    options.replaceChildren();

    addMessage(
      "Confira os valores informados: 💗\n\n" +
      services
        .map(([name, price]) => `• ${name}: ${price}`)
        .join("\n") +
      "\n\nA esmaltação em gel não possui preço informado nesta tabela. " +
      "Para confirmar valores e condições, converse diretamente com a Luana."
    );

    addOptions([
      {
        label: "📲 Confirmar valores com a Luana",
        action: () =>
          goToWhatsApp(
            "Olá, Luana! Vim pelo site Meu Designer e gostaria de confirmar os valores dos serviços."
          ),
        external: true
      },
      {
        label: "↩ Voltar ao menu principal",
        action: backToMenu
      }
    ]);
  }

  function showServiceDetails(service) {
    options.replaceChildren();

    const details = {
      fibra:
        "A fibra de vidro é uma técnica de alongamento de unhas. " +
        "O valor informado é R$ 140,00. A manutenção está informada por R$ 90,00.",

      molde:
        "A unha em gel com Molde F1 é uma opção de alongamento. " +
        "O valor informado é R$ 140,00.",

      banho:
        "O banho em gel é um procedimento para reforçar e dar estrutura às unhas. " +
        "O valor informado é R$ 90,00.",

      blindagem:
        "A blindagem é um procedimento para reforçar as unhas naturais. " +
        "O valor informado é R$ 60,00.",

      esmalatacao:
        "A esmaltação em gel é uma opção de acabamento com gel. " +
        "Ainda não temos um preço informado para esse procedimento. " +
        "Consulte diretamente a Luana.",

      manicure:
        "A Luana oferece manicure tradicional. " +
        "Os valores informados são R$ 45,00 para pé e mão e R$ 25,00 para somente pé ou mão.",

      pedicure:
        "A Luana oferece pedicure tradicional. " +
        "Os valores informados são R$ 45,00 para pé e mão e R$ 25,00 para somente pé ou mão."
    };

    addMessage(details[service]);

    addOptions([
      {
        label: "💰 Consultar todos os preços",
        action: showPrices
      },
      {
        label: "↩ Voltar ao menu principal",
        action: backToMenu
      }
    ]);
  }

  function showDoubtsWhatsApp() {
    goToWhatsApp(
      "Olá, Luana! Vim pelo site Meu Designer e gostaria de tirar uma dúvida sobre seu atendimento."
    );
  }

  function scheduleWhatsApp() {
    goToWhatsApp(
      "Olá, Luana! Vim pelo site Meu Designer e gostaria de agendar um horário. Quais dias e horários estão disponíveis?"
    );
  }

  function contactLuanaWhatsApp() {
    goToWhatsApp(
      "Olá, Luana! Vim pelo site Meu Designer e gostaria de falar diretamente com você."
    );
  }

  function openInstagram() {
    const bubble = addMessage(
      "Você também pode conhecer o perfil da Luana no Instagram: 💗"
    );

    const link = document.createElement("a");
    link.className = "lu-chat-link";
    link.href = INSTAGRAM_URL;
    link.target = "_blank";
    link.rel = "noopener noreferrer";
    link.textContent = "@jluanaa_s";

    bubble.appendChild(link);
    scrollToBottom();

    addBackButton();
  }

  function startConversation() {
    if (conversationStarted) return;

    conversationStarted = true;

    later(() => {
      addMessage(
        "Olá! Seja muito bem-vinda ao atendimento da Luana Santos Design! 💗"
      );

      later(() => {
        addMessage(
          "Sou a Lu Designer e estou aqui para ajudar você a conhecer nossos serviços, consultar preços e encontrar o melhor caminho para seu atendimento. ✨"
        );

        later(mainMenu, 500);
      }, 850);
    }, 500);
  }

  function openChat() {
    clearGreetingTimers();

    chatWindow.classList.add("is-open");
    chatWindow.setAttribute("aria-hidden", "false");

    launcher.classList.add("is-hidden");
    launcher.setAttribute("aria-expanded", "true");

    startConversation();
  }

  function closeChat() {
    clearGreetingTimers();

    chatWindow.classList.remove("is-open");
    chatWindow.setAttribute("aria-hidden", "true");

    launcher.classList.remove("is-hidden");
    launcher.setAttribute("aria-expanded", "false");

    launcher.focus();
  }

  function handleUserMessage(rawText) {
    const originalText = rawText.trim();

    if (!originalText) return;

    addMessage(originalText, "user");

    const value = normalizeText(originalText);

    // Retornar ao menu principal
    if (
      value === "0" ||
      value === "menu" ||
      value === "inicio" ||
      value === "voltar" ||
      value === "menu principal"
    ) {
      backToMenu();
      return;
    }

    // Opções numéricas do menu
    if (/^[1]$/.test(value)) {
      showServices();
      return;
    }

    if (/^[2]$/.test(value)) {
      showPrices();
      return;
    }

    if (/^[3]$/.test(value)) {
      showDoubtsWhatsApp();
      return;
    }

    if (/^[4]$/.test(value)) {
      scheduleWhatsApp();
      return;
    }

    if (/^[5]$/.test(value)) {
      contactLuanaWhatsApp();
      return;
    }

    // Serviços específicos
    if (
      value.includes("fibra de vidro") ||
      value.includes("unha de fibra") ||
      value.includes("alongamento de fibra")
    ) {
      showServiceDetails("fibra");
      return;
    }

    if (
      value.includes("molde f1") ||
      value.includes("unha em gel") ||
      value.includes("unhas em gel")
    ) {
      showServiceDetails("molde");
      return;
    }

    if (
      value.includes("manutencao") ||
      value.includes("manutencao de unha")
    ) {
      showServiceDetails("fibra");
      return;
    }

    if (
      value.includes("banho em gel") ||
      value.includes("banho de gel")
    ) {
      showServiceDetails("banho");
      return;
    }

    if (value.includes("blindagem")) {
      showServiceDetails("blindagem");
      return;
    }

    if (
      value.includes("esmalatacao em gel") ||
      value.includes("esmalatacao")
    ) {
      showServiceDetails("esmalatacao");
      return;
    }

    if (
      value.includes("manicure") ||
      value.includes("mao")
    ) {
      showServiceDetails("manicure");
      return;
    }

    if (
      value.includes("pedicure") ||
      value.includes("pe")
    ) {
      showServiceDetails("pedicure");
      return;
    }

    // Consultas gerais de preço
    if (
      value.includes("preco") ||
      value.includes("valor") ||
      value.includes("quanto custa") ||
      value.includes("quanto e") ||
      value.includes("quanto fica")
    ) {
      showPrices();
      return;
    }

    // Consultas gerais de serviços
    if (
      value.includes("servico") ||
      value.includes("servicos") ||
      value.includes("procedimento") ||
      value.includes("procedimentos") ||
      value.includes("o que faz") ||
      value.includes("o que oferece")
    ) {
      showServices();
      return;
    }

    // Instagram
    if (
      value.includes("instagram") ||
      value.includes("perfil") ||
      value.includes("rede social")
    ) {
      openInstagram();
      return;
    }

    // Agendamento
    if (
      value.includes("agendar") ||
      value.includes("agendamento") ||
      value.includes("marcar horario") ||
      value.includes("horario")
    ) {
      scheduleWhatsApp();
      return;
    }

    // Contato direto
    if (
      value.includes("falar com luana") ||
      value.includes("falar com a luana") ||
      value.includes("contato") ||
      value.includes("atendente") ||
      value.includes("pessoa")
    ) {
      contactLuanaWhatsApp();
      return;
    }

    // Dúvidas
    if (
      value.includes("duvida") ||
      value.includes("duvidas") ||
      value.includes("informacao") ||
      value.includes("informacoes")
    ) {
      showDoubtsWhatsApp();
      return;
    }

    // Fallback: informação não cadastrada
    addMessage(
      "Desculpe, ainda não tenho essa informação por aqui. 😊 " +
      "Vou encaminhar você para a Luana, que poderá ajudar melhor."
    );

    later(() => {
      addMessage("Transferindo para o atendimento da Luana...");
      later(() => {
        goToWhatsApp(
          "Olá, Luana! Vim pelo site Meu Designer e gostaria de ajuda com esta informação: " +
          originalText
        );
      }, 700);
    }, 400);
  }

  launcher.addEventListener("click", openChat);
  closeButton.addEventListener("click", closeChat);

  form.addEventListener("submit", (event) => {
    event.preventDefault();

    const text = input.value.trim();

    if (!text) return;

    input.value = "";
    handleUserMessage(text);
  });

  document.addEventListener("keydown", (event) => {
    if (
      event.key === "Escape" &&
      chatWindow.classList.contains("is-open")
    ) {
      closeChat();
    }
  });
})();
