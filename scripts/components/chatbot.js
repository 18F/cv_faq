// This chatbot is dependent on the Microsoft Bot Framework JS bundle being
// loaded via a script tag.
// https://cdn.botframework.com/botframework-webchat/latest/webchat.js

import { html, render } from 'lit-html';

const CHATBOT_CONTAINER_ID = 'chatbot';

export const initChatbot = (token) => {
  const element = document.getElementById(CHATBOT_CONTAINER_ID);
  window.WebChat.renderWebChat(
    {
      directLine: window.WebChat.createDirectLine({
        token: token
      }),
      locale: 'en-US'
    },
    element
  );
};
