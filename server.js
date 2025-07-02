// Passo 1: Importar os pacotes que instalamos.
// 'require' é a forma do Node.js de carregar um módulo para que possamos usá-lo.
const express = require('express');
const nodemailer = require('nodemailer');
const cors = require('cors');

// Passo 2: Inicializar o Express.
// A variável 'app' agora é o nosso objeto principal do servidor.
// É com ela que vamos configurar tudo.
const app = express();

// Passo 3: Configurar os "Middlewares".
// Middlewares são funções que rodam entre o momento que a requisição chega
// e o momento que ela é entregue à nossa rota final.

// Este middleware do Express pega o corpo da requisição que está em formato JSON
// e o transforma em um objeto JavaScript fácil de usar (acessível via 'req.body').
app.use(express.json());

// Este middleware habilita o CORS, como explicado na Parte 1.
// Ele permite que nosso frontend se comunique com este backend.
app.use(cors());

// Passo 4: Definir a porta do servidor.
// Esta linha é uma boa prática. Ela diz: "Use a porta que a plataforma de
// hospedagem (como Heroku) me der. Se não houver nenhuma, use a porta 3000".
// Para rodar localmente, usaremos a 3000.
const PORT = process.env.PORT || 3000;

// Passo 5: Criar a nossa rota (ou "endpoint") para receber os dados do formulário.
// app.post() significa que estamos criando uma rota que só aceita requisições do tipo POST.
// '/enviar-contato' é o caminho da URL que o frontend vai chamar.
// (req, res) => { ... } é a função que será executada quando uma requisição chegar.
// 'req' (request) contém todos os dados que o frontend enviou.
// 'res' (response) é o que usamos para enviar uma resposta de volta para o frontend.
app.post('/enviar-contato', (req, res) => {
    
    // Passo 5.1: Extrair os dados do corpo da requisição.
    // Graças ao middleware 'express.json()', os dados do formulário estão em 'req.body'.
    const { name, email, subject, message } = req.body;

    // Passo 5.2: Configurar o "transportador" do Nodemailer.
    // Isso é como configurar sua conta de email em um programa como Outlook ou Apple Mail.
    // Você faz isso uma vez.
    const transporter = nodemailer.createTransport({
        host: "smtp.gmail.com", // Servidor SMTP do seu provedor de email
        port: 587,              // Porta padrão para conexão segura
        secure: false,          // A segurança é feita com STARTTLS na porta 587
        auth: {
            user: "seu-email@gmail.com", // Seu email completo
            pass: "sua-senha-de-aplicativo"    // A senha de app que você gerou
        }
    });

    // Passo 5.3: Definir as opções do email que será enviado.
    // Este objeto representa a "carta" que vamos enviar.
    const mailOptions = {
        from: `"${name}" <${email}>`, // Remetente (aparecerá no campo "De:")
        to: 'seu-email-de-destino@gmail.com', // Para quem você quer enviar
        replyTo: email, // Quando você clicar em "Responder", o email irá para o usuário. Essencial!
        subject: `Nova Mensagem do Site: ${subject}`, // Assunto do email
        text: `Nome: ${name}\nEmail: ${email}\n\nMensagem:\n${message}` // Corpo do email em texto puro
    };

    // Passo 5.4: Enviar o email.
    // Usamos o 'transporter' que configuramos para enviar a 'carta' (mailOptions).
    // O último argumento é uma "função de callback", que é executada após a tentativa de envio.
    transporter.sendMail(mailOptions, (error, info) => {
        // Se a variável 'error' existir, algo deu errado.
        if (error) {
            console.log(error); // Mostra o erro no console do seu servidor (para você ver)
            // Envia uma resposta de erro para o frontend.
            return res.status(500).send("Ocorreu um erro ao enviar o email.");
        }
        // Se não houve erro, o email foi enviado com sucesso.
        console.log('Email enviado: ' + info.response); // Log de sucesso no seu console
        // Envia uma resposta de sucesso para o frontend.
        res.status(200).send("Mensagem enviada com sucesso!");
    });
});

// Passo 6: Iniciar o servidor.
// Este comando "liga" o servidor e o faz ficar escutando por requisições na porta definida.
// A função de callback aqui serve apenas para nos avisar no terminal que tudo deu certo.
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});