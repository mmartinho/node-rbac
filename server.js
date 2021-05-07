require('dotenv').config();

const app = require('./app');
const port = 3000;

require('./database');
require('./redis/blocklist-access-token');
require('./redis/allowlist-refresh-token');

const { InvalidArgumentError, NaoEncontrado, NaoAutorizado } = require('./src/erros');
const jwt = require('jsonwebtoken');

/**
 * Middleare para definir o cabeçalho da resposta
 */
 app.use((requisicao, resposta, proximo) => {
    resposta.set({
          'Content-Type': 'application/json'
    })
    proximo();
})

const routes = require('./rotas');
routes(app);

/**
 * Middleware de tratamento de todos os erros possíveis da app
 */
app.use((erro, requisicao, resposta, proximo) => {
    let status = 500;
    const corpo = {
        mensagem : erro.message
    };
    if(erro instanceof InvalidArgumentError) {
        status = 400;
    }
    if(erro instanceof jwt.JsonWebTokenError) {
        status = 401;
    }
    if(erro instanceof jwt.TokenExpiredError) {
        status = 401;
        corpo.expiradoEm = erro.expiredAt;
    } 
    if(erro instanceof NaoEncontrado) {
        status = 404;
    }  
    if(erro instanceof NaoAutorizado) {
        status = 401;
    } 
    resposta.status(status);
    resposta.json(corpo);
});

app.listen(port, () => console.log('A API está funcionando!'));
