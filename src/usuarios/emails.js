const nodemailer = require('nodemailer')

const configuracaoEmailProducao = {
  host: process.env.EMAIL_HOST,
  auth: {
    user: process.env.EMAIL_USUARIO,
    pass: process.env.EMAIL_SENHA
  },
  secure: true
}

const configuracaoEmailTeste = (contaTeste) => ({
  host: 'smtp.ethereal.email',
  auth: contaTeste
})

async function criaConfiguracaoEmail () {
  if (process.env.NODE_ENV === 'production') {
    return configuracaoEmailProducao
  } else {
    const contaTeste = await nodemailer.createTestAccount()
    return configuracaoEmailTeste(contaTeste)
  }
}

class Email {
  async enviaEmail () {
    const configuracaoEmail = await criaConfiguracaoEmail()
    const transportador = nodemailer.createTransport(configuracaoEmail)
    const info = await transportador.sendMail(this)

    if (process.env.NODE_ENV !== 'production') {
      console.log('URL: ' + nodemailer.getTestMessageUrl(info))
    }
  }
}

/**
 * Mensagem de email para verificação se email existe
 * @extends Email
 */
class EmailVerificacao extends Email {
  constructor (usuario, endereco) {
    super()
    this.from = '"Blog do Código" <noreply@blogdocodigo.com.br>'
    this.to = usuario.email
    this.subject = 'Verificação de e-mail'
    this.text = `Olá! Verifique seu e-mail aqui: ${endereco}`
    this.html = `<h1>Olá!</h1> Verifique seu e-mail aqui: <a href="${endereco}">${endereco}</a>`
  }
}

/**
 * Mensagem de email para Redefinição de senha
 * @extends Email
 */
class EmailRedefinicaoSenha extends Email {
  constructor (usuario, token) {
    super();
    this.from = '"Blog do Código" <noreply@blogdocodigo.com.br>';
    this.to = usuario.email;
    this.subject = 'Redefinação de Senha';
    this.text = `Olá! Você pediu para redefinir sua senha. Use o token a seguir para trocar sua senha: ${token}`
    this.html = `<h1>Olá!</h1> Você pediu para redefinir sua senha. Use o token a seguir para trocar sua senha: ${token}`
  }
}

/**
 * Mensagem de email para notificar sobre novo POST criado
 * @extends Email
 */
class EmailPostCriado extends Email {
  constructor (usuario, tituloPost) {
        super()
        this.from = '"Blog do Código" <noreply@blogdocodigo.com.br>'
        this.to = usuario.email
        this.subject = 'Novo post cadastrado no blog!';
        this.text = `Olá! Você criou um novo post no blog e ele já foi publicado! Título: ${tituloPost}`
        this.html = `<h1>Olá!</h1> Você criou um novo post no blog e ele já foi publicado!<br />. <br />Título: ${tituloPost}`
  }
}
module.exports = { EmailVerificacao, EmailRedefinicaoSenha, EmailPostCriado }
