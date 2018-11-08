'use strict';
/* eslint-disable */

const hello = [
  'Hey',
  'Olá',
  'Bonjour',
  'Hola',
  'Ciao',
  'Howdy',
  'Hallo',
  'Welcome',
  'Shalom',
  'Oi',
  'Salut',
  'Ahoy',
  'Ahoj',
  'Grüezi'
];
const adjective = ['sexy', 'gourgeous', 'beautiful', 'handsome', 'bonito', 'cariño'];
const create = ['create', 'set up', 'build', 'cook', 'make', 'generate'];
const goodbye = [
  `Go develop a beautiful component!`,
  `Enjoy your day!`,
  `Make me proud and write some good code!`
];

module.exports = {
  randomize: function(array) {
    return eval(array)[Math.floor(Math.random() * eval(array).length)];
  },
  sayHello: function() {
    return `${this.randomize(hello)}`;
  },
  sayGoodbye: function() {
    return `${this.randomize(goodbye)}`;
  }
};
