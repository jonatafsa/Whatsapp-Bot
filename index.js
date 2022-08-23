// importando os pacotes para uso no arquivo index.js
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const bodyParser = require('body-parser');
const { Client, Message, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');

// crio um servidor express
const app = express();

// aplico configurações para dentro do servidor express, adicionando middlewares (body-parser, morgan, cors)
app.use(morgan('dev'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());

const client = new Client({
  authStrategy: new LocalAuth()
});

client.on('qr', (qr) => {
  qrcode.generate(qr, { small: true });
});

client.on('ready', () => {
  console.log('Client is ready!');
});

client.on('message', message => {
  if (message.body === '!ping') {
    client.sendMessage(message.from, 'pong');
  }
});

client.initialize();

app.post('/nova-art', (req, res) => {
  const number = `556199461282@c.us`
  const text = `
    Olá, essa é uma mensagem vindo do formulário de contato do seu site, os dados da mensagem são os seguintes: \n
    Nome: ${req.body.name}
    Telefone: ${req.body.phone}
    Mensagem: ${req.body.message}
  `

  client.sendMessage(number, text);
  return res.status(200).json({message: 'Mensagem enviada com sucesso!'})
})


app.listen(9001, () => console.log('Express started at http://localhost:9001'));