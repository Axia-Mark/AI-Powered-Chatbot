document.addEventListener("DOMContentLoaded", () => {
    const chatbotToggler = document.querySelector(".chatbot-toggler");
    const closeBtn = document.querySelector(".close-btn");
    const chatbox = document.querySelector(".chatbox");
    const chatInput = document.querySelector(".chat-input textarea");
    const sendChatBtn = document.querySelector(".chat-input span");

    const API_KEY = "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"; // Replace with your OpenAI API Key
    const API_URL = "https://api.openai.com/v1/chat/completions";
    const inputInitHeight = chatInput.scrollHeight;

    const createChatLi = (message, className) => {
        const chatLi = document.createElement("li");
        chatLi.classList.add("chat", className);
        chatLi.innerHTML = className === "outgoing"
            ? <p></p> 
            : <span class="material-symbols-outlined">smart_toy</span><p></p>;
        chatLi.querySelector("p").textContent = message;
        return chatLi;
    }

    const generateResponse = (chatElement, userMessage) => {
        const messageElement = chatElement.querySelector("p");

        // Define API request options
        const requestOptions = {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": Bearer ${API_KEY}
            },
            body: JSON.stringify({
                model: "gpt-3.5-turbo",
                messages: [{ role: "user", content: userMessage }]
            })
        };

        // Fetch response from OpenAI API
        fetch(API_URL, requestOptions)
            .then(res => res.json())
            .then(data => {
                console.log("API Response:", data); // Debugging
                if (data.choices && data.choices.length > 0) {
                    messageElement.textContent = data.choices[0].message.content.trim();
                } else {
                    messageElement.textContent = "No response received.";
                }
            })
            .catch(error => {
                console.error("API Error:", error);
                messageElement.classList.add("error");
                messageElement.textContent = "Oops! Something went wrong. Please try again.";
            })
            .finally(() => chatbox.scrollTo(0, chatbox.scrollHeight));
    }

    const handleChat = () => {
        const userMessage = chatInput.value.trim();
        if (!userMessage) return;

        chatInput.value = "";
        chatInput.style.height = ${inputInitHeight}px;

        // Append user message
        chatbox.appendChild(createChatLi(userMessage, "outgoing"));
        chatbox.scrollTo(0, chatbox.scrollHeight);

        setTimeout(() => {
            // Display "Thinking..." before getting response
            const incomingChatLi = createChatLi("Thinking...", "incoming");
            chatbox.appendChild(incomingChatLi);
            chatbox.scrollTo(0, chatbox.scrollHeight);
            generateResponse(incomingChatLi, userMessage);
        }, 600);
    }

    chatInput.addEventListener("input", () => {
        chatInput.style.height = ${inputInitHeight}px;
        chatInput.style.height = ${chatInput.scrollHeight}px;
    });

    chatInput.addEventListener("keydown", (e) => {
        if (e.key === "Enter" && !e.shiftKey && window.innerWidth > 800) {
            e.preventDefault();
            handleChat();
        }
    });

    sendChatBtn.addEventListener("click", handleChat);
    closeBtn.addEventListener("click", () => document.body.classList.remove("show-chatbot"));
    chatbotToggler.addEventListener("click", () => document.body.classList.toggle("show-chatbot"));
});