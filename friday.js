let button = window.document.querySelector('button');
let p = window.document.querySelector('p');
let conversation = []

let speechRecognizer = new webkitSpeechRecognition();

let speechSynthesis = window.speechSynthesis;

const speech = () => {
    speechRecognizer.start();
    button.textContent = 'Говорите...';
}

const talk = (text) => {
    let textToTalk = new SpeechSynthesisUtterance(text);
    textToTalk.rate = 1.5;
    textToTalk.pinch = 0.1;
    speechSynthesis.speak(textToTalk);
}

let request = axios.create({
    headers: {
       Authorization: `Bearer ${apiKey}`
    }
})

const requestFunc = () => {
    if(p.textContent) {
        button.textContent = 'Отправка...';
        button.style.animation = 'button_anim 2s infinite';
        let message = {
            "role": "user",
            "content": `${p.textContent}`
        }
        conversation.push(message);
        let params = {
            "model": "gpt-3.5-turbo",
            "messages": conversation
        }
        request.post('https://api.openai.com/v1/chat/completions', params)
        .then(response => {
            p.textContent = response.data.choices[0].content;
            let gptMessage = {
                "role": "assistant",
                "content": `${p.textContent}`
            }
            conversation.push(gptMessage);
            button.textContent = 'Задать вопрос';
            button.style.animation = 'none';
            talk(p.textContent);
        });
    }
}

speechRecognizer.onresult = (event) => {
p.textContent = event.results[0][0].transcript;
requestFunc();
}