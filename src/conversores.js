/**
 * Classe BASE
 */
class Conversor {
    filtrar (dados) {
        if(Array.isArray(dados)) {
            dados = dados.map( (post) => this.filtrarObjeto(post));
        } else {
            dados = this.filtrarObjeto(dados);
        }
        return dados;
    }

    filtrarObjeto(objeto) {
        const objetoFiltrado = {};
        this.camposPublicos.forEach( (campo) => {
            if(Reflect.has(objeto, campo)) {
                objetoFiltrado[campo]= objeto[campo]
            }
        });
        return objetoFiltrado;
    }

    converter(dados) {
        if(this.camposPublicos.indexOf('*') === -1 ){
            dados = this.filtrar(dados);
        }
        if(this.tipoDeConteudo === 'json') {
            return this.json(dados);
        }
    }

    json(dados) {
        return JSON.stringify(dados);
    }
}

/**
 * Conversor de objetos "Post"
 * @see src\posts\posts-modelo.js
 */
class ConversorPost extends Conversor {
    constructor(tipoDeConteudo, camposExtras = []) {
        super();
        this.tipoDeConteudo = tipoDeConteudo;
        this.camposPublicos = ['titulo','conteudo'].concat(camposExtras);
    }
}

/**
 * Conversor de objetos "Usuário"
 * @see src\usuarios\usuarios-modelo.js
 */
class ConversorUsuario extends Conversor {
    constructor(tipoDeConteudo, camposExtras = []) {
        super();
        this.tipoDeConteudo = tipoDeConteudo;
        this.camposPublicos = ['nome'].concat(camposExtras);
    }
}

/**
 * Conversor de objetos "Erro"
 */
class ConversorErro extends Conversor {
    constructor(tipoDeConteudo) {
        super();
        this.tipoDeConteudo = tipoDeConteudo;
        this.camposPublicos = ['message', 'mensagem'];
    }
}

module.exports = { ConversorPost, ConversorUsuario, ConversorErro };