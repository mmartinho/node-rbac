const middlewaresAutenticacao = require('../usuarios/middlewares-autenticacao');
module.exports = (requisicao, resposta, proximo)  => {
    requisicao.estaAutenticado = false;
    if(requisicao.get('Authorization')) {
        return middlewaresAutenticacao.bearer(requisicao, resposta, proximo);
    }
    proximo();
}