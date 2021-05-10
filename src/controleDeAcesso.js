const { AccessControl } = require('accesscontrol');
const controle = new AccessControl();

/**
 * Controle de acesso baseado em permissões (PABC)
 * Ideal para conteúdo
 */

controle
    .grant('assinante')
    .readAny('usuario', ['nome'])
    .readAny('post', ['id','titulo','conteudo', 'autor']);

controle
    .grant('editor')
    .extend('assinante')
    .createOwn('post')
    .deleteOwn('post');

controle
    .grant('admin')
    .extend('assinante')
    .deleteAny('post')
    .createAny('post')
    .createAny('usuario')
    .readAny('usuario')
    .deleteAny('usuario')

module.exports = controle;