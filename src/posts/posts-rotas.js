const postsControlador = require('./posts-controlador');
const { middlewaresAutenticacao } = require('../usuarios');
const autorizacao = require('../middlewares/autorizacao');

module.exports = app => {
  app
    .route('/post')
    /** Lista de posts */
    .get(
      [middlewaresAutenticacao.bearer, autorizacao(['admin', 'editor', 'assinante'])],
      postsControlador.lista
    )
    /** Cria novo post */
    .post(
      [middlewaresAutenticacao.bearer, autorizacao(['admin', 'editor'])],
      postsControlador.adiciona
    );

  app.route('/post/:id')
    /** Mostra um post em particular */  
    .get(
      [middlewaresAutenticacao.bearer, autorizacao(['admin', 'editor', 'assinante'])],
      postsControlador.obterDetalhes
    )
    /** Exclui um post em particular */
    .delete(
      [middlewaresAutenticacao.bearer, autorizacao(['admin', 'editor'])],
      postsControlador.remover
    );
}
