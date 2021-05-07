const postsControlador = require('./posts-controlador');
const { middlewaresAutenticacao } = require('../usuarios');
const autorizacao = require('../middlewares/autorizacao');
const tentarAutenticar = require('../middlewares/tentarAutenticar');
const tentarAutorizar = require('../middlewares/tentarAutorizar');

module.exports = app => {
  app
    .route('/post')
    /** Lista de posts */
    .get(
      [tentarAutenticar, tentarAutorizar('post', 'ler')],
      postsControlador.lista
    )
    /** Cria novo post */
    .post(
      [middlewaresAutenticacao.bearer, autorizacao('post', 'criar')],
      postsControlador.adiciona
    );

  app.route('/post/:id')
    /** Mostra um post em particular */  
    .get(
      [middlewaresAutenticacao.bearer, autorizacao('post', 'ler')],
      postsControlador.obterDetalhes
    )
    /** Exclui um post em particular */
    .delete(
      /** 
       * O Middleware "local" tem o intuito de servir de 
       * uma confirmação para essa rota crítica 
       * */      
      [middlewaresAutenticacao.bearer, middlewaresAutenticacao.local, autorizacao('post', 'remover')],
      postsControlador.remover
    );
}
