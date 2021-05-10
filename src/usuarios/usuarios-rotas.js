const usuariosControlador = require('./usuarios-controlador')
const middlewaresAutenticacao = require('./middlewares-autenticacao')
const autorizacao = require('../middlewares/autorizacao')

module.exports = app => {
  app
    .route('/usuario/atualiza_token')
    /** Atualiza o token bearer usando o token de refresh */
    .post(middlewaresAutenticacao.refresh, usuariosControlador.login)

  app
    .route('/usuario/login')
    /** Faz o login solicitando token de bearer e refresh */
    .post(middlewaresAutenticacao.local, usuariosControlador.login)

  app
    .route('/usuario/logout')
    /** Faz o logout invalidando todos os tokens: refresh e bearer */
    .post(
      [middlewaresAutenticacao.refresh, middlewaresAutenticacao.bearer],
      usuariosControlador.logout
    );

  app
    .route('/usuario/verifica_email/:token')
    /** Verifica email de usuário recém cadastrado */
    .get(
      middlewaresAutenticacao.verificacaoEmail,
      usuariosControlador.verificaEmail
    );

  app
    .route('/usuario')
    /** Adiciona um usuario */
    .post(usuariosControlador.adiciona)
    /** Lista todos os usuários */
    .get(
      [middlewaresAutenticacao.bearer, autorizacao('usuario', 'ler')],
      usuariosControlador.lista
    );
    
  app
    .route('/usuario/:id')
    /** Exclui um usuario em particular */
    .delete(
      /** 
       * O Middleware "local" tem o intuito de servir de 
       * uma confirmação para essa rota crítica 
       * */
      [middlewaresAutenticacao.bearer, /*middlewaresAutenticacao.local,*/ autorizacao('usuario', 'remover')], 
      usuariosControlador.deleta
    );
}
