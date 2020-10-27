const axios = require('axios');
const readline = require('readline');
const luxon = require('luxon');
const e = console;
import { Mesa } from './modelos/mesa/Mesa';
import { Jogador } from './modelos/jogador/Jogador';
import { Partida } from './modelos/partida/partida';

var inicio = (data) => {
    let resp = '';
    let dt = luxon.DateTime.fromISO(data);
    dt = dt.c;
    resp += dt.hour + ':';
    resp += dt.minute;
    return resp;
}

/**
 * Essa função popula a tabela JogadorMesa
 * @param  {Number} idtorneio
 * Chave primária da tabela Torneio
 * @param  {Number} idempresa
 * Chave primária da tabela Empresa de aluguel das mesas
 */
const populamesas = async (idtorneio: Number, idempresa: number) => {
    let mesas: Mesa[] = [];
    let jogadores: Jogador[] = [];
    let urls: string[] = [];

    let response = await axios(

        {
            method: 'post',
            url: 'http://localhost:5000/listar/jogadores',
            data: { IDTorneio: idtorneio }
        }
    );

    jogadores = response.data;

    response = await axios(

        {
            method: 'get',
            url: 'http://localhost:5000/listar/mesas',
            data: { IDTorneio: idtorneio }
        }
    );

    mesas = response.data;
    mesas = mesas.filter(x => x.IDStatusMesa == 1 && x.IDEmpresa == idempresa);


    response = await axios(

        {
            method: 'get',
            url: `http://localhost:5000/limpar/mesas/${idtorneio}`,
            data: { IDTorneio: idtorneio }
        }
    );


    for (let i = 0; i < mesas.length; i++) {
        for (let j = 0; j < jogadores.length; j++) {
            if ((j - i) % mesas.length === 0) {
                let k = jogadores[j];
                let l = mesas[i];
                let res = `http://localhost:5000/povoar/mesas/${k.IDJogador}/${l.IDMesa}/${idtorneio}/${k.NickName}`;
                urls.push(res);
            } else {
                continue;
            }
        }
    }


    for (const url of urls) {
        const todo = await axios.get(url);
        e.log(todo.data);
    }

}

/**
 * Cria uma partida entre dois jogadores
 * @param  {number} idtorneio
 * Chave primária da tabela Torneios
 * @param  {number} idmesa?
 * Chave primária da tabela Mesas
 */
const criarPartidas = async (idtorneio: number, idmesa: number) => {
    let players = [];

    let jogadores = await axios(

        {
            method: 'post',
            url: 'http://localhost:5000/listar/jogadores/mesas',
            data: { IDTorneio: idtorneio }
        }
    );

    /**
  * Aqui vou precisar deixar apenas os jogadores da mesa escolhida
  */
    let response = jogadores.data.filter(x => x.IDMesa == idmesa);


    let vidas = [];

    response.forEach(a => {
        vidas.push(a.Vidas);
    });

    /**
     * Aqui vou definir qual o valor máximo de vidas ainda nessa 
     * mesa do torneio 
     */

    let max = Math.max(...vidas);

    response = response.filter(x => x.Vidas === max);



    /**
     * Aqui vou pegar apenas os IDs dos jogadores filtrados
     */

    let ids = [];

    response.forEach(x => {
        ids.push(x.IDJogador);
    })

    /**
     * Aqui vou pegar o menor id Entre esses jogadores
     */

    let min = Math.min(...ids);


    /**
     * Aqui vou pegar o index do elemento de menor id
     * localizando dessa forma, o primeiro player da mesa
     */


    let index = response.findIndex(x => x.IDJogador === min);

    e.log(index);

    players.push(response[index]);



    /**
    * Aqui vou precisar deixar apenas os jogadores da mesa escolhida e retirar o primeiro
    * jogador selecionado para a partida
    */


    response = jogadores.data.filter(x => x.IDMesa == idmesa);

    index = response.findIndex(x => x.IDJogador == players[0].IDJogador)

    response.splice(index, 1);

    response = response.filter(x => x.IDMesa == idmesa);

    vidas = [];

    response.forEach(a => {
        vidas.push(a.Vidas);
    });

    /**
     * Aqui vou definir qual o valor máximo de vidas ainda nessa 
     * mesa do torneio 
     */

    max = Math.max(...vidas);

    response = response.filter(x => x.Vidas === max);



    /**
     * Aqui vou pegar apenas os IDs dos jogadores filtrados
     */

    ids = [];

    response.forEach(x => {
        ids.push(x.IDJogador);
    })

    /**
     * Aqui vou pegar o menor id Entre esses jogadores
     */

    min = Math.min(...ids);


    /**
     * Aqui vou pegar o index do elemento de menor id
     * localizando dessa forma, o primeiro player da mesa
     */


    index = response.findIndex(x => x.IDJogador === min);

    players.push(response[index]);

    index = response.findIndex(x => x.IDJogador == players[1].IDJogador)

    response.splice(index, 1);

    e.log(players);

    response = jogadores.data.filter(x => x.IDMesa == idmesa);
    let total = response.filter(x => x.Vidas > 0).length;
    e.log(`${total} jogadores disponíveis`);

    if (total > 1) {
        let data = {
            IDMesa: idmesa,
            PrimeiroJogador: players[0].IDJogador,
            SegundoJogador: players[1].IDJogador,
            IDStatusPartida: 2,
            IDTorneio: idtorneio,
            ApelidoPrimeiroJogador: players[0].NickName,
            ApelidoSegundoJogador: players[1].NickName
        }


        let result = await axios(
            {
                method: 'post',
                url: 'http://localhost:5000/salvar/partida',
                data: data
            }
        )
    } else {
        e.log(`O vendedor da mesa foi ${players[0].NickName}`)
    }



}

/**
 * Essa função monta a tela das partidas em andamento
 */
const mostrarPartidas = async () => {
    let partidas: Partida[] = [];

    let response = await axios.get('http://localhost:5000/listar/partidas');

    partidas = response.data;

    const read = async () => {
        console.clear();
        function askQuestion(query) {
            const rl = readline.createInterface({
                input: process.stdin,
                output: process.stdout,
            });

            return new Promise(resolve => rl.question(query, ans => {
                rl.close();
                resolve(ans);
            }))
        }


        const ans = await askQuestion('');
    }

    read()

    let placar = [];
    partidas.forEach(x => {
        placar.push({ partida: x.IDPartida, mesa: x.IDMesa, "Nr 1º": x.PrimeiroJogador, "1º jogador": x.ApelidoPrimeiroJogador.trim(), "Nr 2º": x.SegundoJogador, "2º jogador": x.ApelidoSegundoJogador.trim(), início: inicio(x.DataInicio) })
    })

    console.table(placar);
}

/**
 * @param  {number} cpf
 * CPF do inscrito
 * @param  {number} idtorneio
 * Chave primária da tabela Torneio
 */
const confirmarPagamento = async (cpf: string, idtorneio: number) => {

    let inscritos = [];
    let response = await axios(

        {
            method: 'get',
            url: 'http://localhost:5000/listar/inscritos'
        }
    );

    inscritos = response.data;

    inscritos = inscritos.filter(x => x.CPF === cpf);

    if (inscritos.length === 0) {
        e.log('Usuário desconhecido')
    } else {

        let idinscrito = inscritos[0].IDInscrito;

        response = await axios(
            {
                method: 'post',
                url: 'http://localhost:5000/listar/jogadores',
                data: {
                    IDTorneio: idtorneio
                }
            }
        )

        let index = response.data.findIndex(x => x.IDInscrito === idinscrito)

        if (index > -1) {
            e.log('Essa inscrição já foi confirmada')
        } else {


            response = await axios(
                {
                    method: 'post',
                    url: 'http://localhost:5000/salvar/jogador',
                    data: {
                        IDInscrito: idinscrito,
                        IDTorneio: idtorneio
                    }
                }
            )

            e.log(response);
        }

    }

}


/**
 * @param  {number} idpartida
 * @param  {number} idvencedor
 * @param  {number} idperdedor
 */
const finalizarPartida = async (idpartida: number, idvencedor: number, idperdedor: number) => {
    let response = await axios(

        {
            method: 'post',
            url: 'http://localhost:5000/finalizar/partida',
            data: {
                IDPartida: idpartida,
                IDVencedor: idvencedor
            }
        }
    );

    response = await axios(

        {
            method: 'post',
            url: 'http://localhost:5000/retirar/vidas',
            data: {
                IDPerdedor: idperdedor
            }
        }
    );
}


const criarFinal = async (idtorneio: number) => {
    let players = [];

    let jogadores = await axios(

        {
            method: 'post',
            url: 'http://localhost:5000/listar/jogadores/mesas',
            data: { IDTorneio: idtorneio }
        }
    );

    /**
  * Aqui vou precisar deixar apenas os jogadores da mesa escolhida
  */
    let response = jogadores.data;


    let vidas = [];

    response.forEach(a => {
        vidas.push(a.Vidas);
    });

    /**
     * Aqui vou definir qual o valor máximo de vidas ainda nessa 
     * mesa do torneio 
     */

    let max = Math.max(...vidas);

    response = response.filter(x => x.Vidas === max);



    /**
     * Aqui vou pegar apenas os IDs dos jogadores filtrados
     */

    let ids = [];

    response.forEach(x => {
        ids.push(x.IDJogador);
    })

    /**
     * Aqui vou pegar o menor id Entre esses jogadores
     */

    let min = Math.min(...ids);


    /**
     * Aqui vou pegar o index do elemento de menor id
     * localizando dessa forma, o primeiro player da mesa
     */


    let index = response.findIndex(x => x.IDJogador === min);

    players.push(response[index]);



    /**
    * Aqui vou precisar deixar apenas os jogadores da mesa escolhida e retirar o primeiro
    * jogador selecionado para a partida
    */


    response = jogadores.data;

    index = response.findIndex(x => x.IDJogador == players[0].IDJogador)

    response.splice(index, 1);

    vidas = [];

    response.forEach(a => {
        vidas.push(a.Vidas);
    });

    /**
     * Aqui vou definir qual o valor máximo de vidas ainda nessa 
     * mesa do torneio 
     */

    max = Math.max(...vidas);

    response = response.filter(x => x.Vidas === max);



    /**
     * Aqui vou pegar apenas os IDs dos jogadores filtrados
     */

    ids = [];

    response.forEach(x => {
        ids.push(x.IDJogador);
    })

    /**
     * Aqui vou pegar o menor id Entre esses jogadores
     */

    min = Math.min(...ids);


    /**
     * Aqui vou pegar o index do elemento de menor id
     * localizando dessa forma, o primeiro player da mesa
     */


    index = response.findIndex(x => x.IDJogador === min);

    players.push(response[index]);

    e.log(players);


    response = jogadores.data;
    let total = response.filter(x => x.Vidas > 0).length;
    e.log(`${total} jogadores disponíveis`);

    if (total > 1) {
        let data = {
            IDMesa: 1,
            PrimeiroJogador: players[0].IDJogador,
            SegundoJogador: players[1].IDJogador,
            IDStatusPartida: 2,
            IDTorneio: idtorneio,
            ApelidoPrimeiroJogador: players[0].NickName,
            ApelidoSegundoJogador: players[1].NickName
        }


        let result = await axios(
            {
                method: 'post',
                url: 'http://localhost:5000/salvar/partida',
                data: data
            }
        )
    } else {
        e.log(`O vendedor da mesa foi ${players[0].NickName}`)
    }
}

const listarJogadores = async (idtorneio: number) => {

    let jogadores = await axios(

        {
            method: 'post',
            url: 'http://localhost:5000/listar/jogadores/mesas',
            data: { IDTorneio: idtorneio }
        }
    );

    console.clear();

    jogadores.data.forEach(x => e.log(x));
}

module.exports = {
    populamesas: populamesas,
    criarPartidas: criarPartidas,
    mostrarPartidas: mostrarPartidas,
    confirmarPagamento: confirmarPagamento,
    finalizarPartida: finalizarPartida,
    criarFinal: criarFinal,
    listarJogadores: listarJogadores
}
