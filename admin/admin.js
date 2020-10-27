"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
var axios = require('axios');
var readline = require('readline');
var luxon = require('luxon');
var e = console;
var inicio = function (data) {
    var resp = '';
    var dt = luxon.DateTime.fromISO(data);
    dt = dt.c;
    resp += dt.hour + ':';
    resp += dt.minute;
    return resp;
};
/**
 * Essa função popula a tabela JogadorMesa
 * @param  {Number} idtorneio
 * Chave primária da tabela Torneio
 * @param  {Number} idempresa
 * Chave primária da tabela Empresa de aluguel das mesas
 */
var populamesas = function (idtorneio, idempresa) { return __awaiter(void 0, void 0, void 0, function () {
    var mesas, jogadores, urls, response, i, j, k, l, res, _i, urls_1, url, todo;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                mesas = [];
                jogadores = [];
                urls = [];
                return [4 /*yield*/, axios({
                        method: 'post',
                        url: 'http://localhost:5000/listar/jogadores',
                        data: { IDTorneio: idtorneio }
                    })];
            case 1:
                response = _a.sent();
                jogadores = response.data;
                return [4 /*yield*/, axios({
                        method: 'get',
                        url: 'http://localhost:5000/listar/mesas',
                        data: { IDTorneio: idtorneio }
                    })];
            case 2:
                response = _a.sent();
                mesas = response.data;
                mesas = mesas.filter(function (x) { return x.IDStatusMesa == 1 && x.IDEmpresa == idempresa; });
                return [4 /*yield*/, axios({
                        method: 'get',
                        url: "http://localhost:5000/limpar/mesas/" + idtorneio,
                        data: { IDTorneio: idtorneio }
                    })];
            case 3:
                response = _a.sent();
                for (i = 0; i < mesas.length; i++) {
                    for (j = 0; j < jogadores.length; j++) {
                        if ((j - i) % mesas.length === 0) {
                            k = jogadores[j];
                            l = mesas[i];
                            res = "http://localhost:5000/povoar/mesas/" + k.IDJogador + "/" + l.IDMesa + "/" + idtorneio + "/" + k.NickName;
                            urls.push(res);
                        }
                        else {
                            continue;
                        }
                    }
                }
                _i = 0, urls_1 = urls;
                _a.label = 4;
            case 4:
                if (!(_i < urls_1.length)) return [3 /*break*/, 7];
                url = urls_1[_i];
                return [4 /*yield*/, axios.get(url)];
            case 5:
                todo = _a.sent();
                e.log(todo.data);
                _a.label = 6;
            case 6:
                _i++;
                return [3 /*break*/, 4];
            case 7: return [2 /*return*/];
        }
    });
}); };
/**
 * Cria uma partida entre dois jogadores
 * @param  {number} idtorneio
 * Chave primária da tabela Torneios
 * @param  {number} idmesa?
 * Chave primária da tabela Mesas
 */
var criarPartidas = function (idtorneio, idmesa) { return __awaiter(void 0, void 0, void 0, function () {
    var players, jogadores, response, vidas, max, ids, min, index, total, data, result;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                players = [];
                return [4 /*yield*/, axios({
                        method: 'post',
                        url: 'http://localhost:5000/listar/jogadores/mesas',
                        data: { IDTorneio: idtorneio }
                    })];
            case 1:
                jogadores = _a.sent();
                response = jogadores.data.filter(function (x) { return x.IDMesa == idmesa; });
                vidas = [];
                response.forEach(function (a) {
                    vidas.push(a.Vidas);
                });
                max = Math.max.apply(Math, vidas);
                response = response.filter(function (x) { return x.Vidas === max; });
                ids = [];
                response.forEach(function (x) {
                    ids.push(x.IDJogador);
                });
                min = Math.min.apply(Math, ids);
                index = response.findIndex(function (x) { return x.IDJogador === min; });
                e.log(index);
                players.push(response[index]);
                /**
                * Aqui vou precisar deixar apenas os jogadores da mesa escolhida e retirar o primeiro
                * jogador selecionado para a partida
                */
                response = jogadores.data.filter(function (x) { return x.IDMesa == idmesa; });
                index = response.findIndex(function (x) { return x.IDJogador == players[0].IDJogador; });
                response.splice(index, 1);
                response = response.filter(function (x) { return x.IDMesa == idmesa; });
                vidas = [];
                response.forEach(function (a) {
                    vidas.push(a.Vidas);
                });
                /**
                 * Aqui vou definir qual o valor máximo de vidas ainda nessa
                 * mesa do torneio
                 */
                max = Math.max.apply(Math, vidas);
                response = response.filter(function (x) { return x.Vidas === max; });
                /**
                 * Aqui vou pegar apenas os IDs dos jogadores filtrados
                 */
                ids = [];
                response.forEach(function (x) {
                    ids.push(x.IDJogador);
                });
                /**
                 * Aqui vou pegar o menor id Entre esses jogadores
                 */
                min = Math.min.apply(Math, ids);
                /**
                 * Aqui vou pegar o index do elemento de menor id
                 * localizando dessa forma, o primeiro player da mesa
                 */
                index = response.findIndex(function (x) { return x.IDJogador === min; });
                players.push(response[index]);
                index = response.findIndex(function (x) { return x.IDJogador == players[1].IDJogador; });
                response.splice(index, 1);
                e.log(players);
                response = jogadores.data.filter(function (x) { return x.IDMesa == idmesa; });
                total = response.filter(function (x) { return x.Vidas > 0; }).length;
                e.log(total + " jogadores dispon\u00EDveis");
                if (!(total > 1)) return [3 /*break*/, 3];
                data = {
                    IDMesa: idmesa,
                    PrimeiroJogador: players[0].IDJogador,
                    SegundoJogador: players[1].IDJogador,
                    IDStatusPartida: 2,
                    IDTorneio: idtorneio,
                    ApelidoPrimeiroJogador: players[0].NickName,
                    ApelidoSegundoJogador: players[1].NickName
                };
                return [4 /*yield*/, axios({
                        method: 'post',
                        url: 'http://localhost:5000/salvar/partida',
                        data: data
                    })];
            case 2:
                result = _a.sent();
                return [3 /*break*/, 4];
            case 3:
                e.log("O vendedor da mesa foi " + players[0].NickName);
                _a.label = 4;
            case 4: return [2 /*return*/];
        }
    });
}); };
/**
 * Essa função monta a tela das partidas em andamento
 */
var mostrarPartidas = function () { return __awaiter(void 0, void 0, void 0, function () {
    var partidas, response, read, placar;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                partidas = [];
                return [4 /*yield*/, axios.get('http://localhost:5000/listar/partidas')];
            case 1:
                response = _a.sent();
                partidas = response.data;
                read = function () { return __awaiter(void 0, void 0, void 0, function () {
                    function askQuestion(query) {
                        var rl = readline.createInterface({
                            input: process.stdin,
                            output: process.stdout
                        });
                        return new Promise(function (resolve) { return rl.question(query, function (ans) {
                            rl.close();
                            resolve(ans);
                        }); });
                    }
                    var ans;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                console.clear();
                                return [4 /*yield*/, askQuestion('')];
                            case 1:
                                ans = _a.sent();
                                return [2 /*return*/];
                        }
                    });
                }); };
                read();
                placar = [];
                partidas.forEach(function (x) {
                    placar.push({ partida: x.IDPartida, mesa: x.IDMesa, "Nr 1º": x.PrimeiroJogador, "1º jogador": x.ApelidoPrimeiroJogador.trim(), "Nr 2º": x.SegundoJogador, "2º jogador": x.ApelidoSegundoJogador.trim(), início: inicio(x.DataInicio) });
                });
                console.table(placar);
                return [2 /*return*/];
        }
    });
}); };
/**
 * @param  {number} cpf
 * CPF do inscrito
 * @param  {number} idtorneio
 * Chave primária da tabela Torneio
 */
var confirmarPagamento = function (cpf, idtorneio) { return __awaiter(void 0, void 0, void 0, function () {
    var inscritos, response, idinscrito_1, index;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                inscritos = [];
                return [4 /*yield*/, axios({
                        method: 'get',
                        url: 'http://localhost:5000/listar/inscritos'
                    })];
            case 1:
                response = _a.sent();
                inscritos = response.data;
                inscritos = inscritos.filter(function (x) { return x.CPF === cpf; });
                if (!(inscritos.length === 0)) return [3 /*break*/, 2];
                e.log('Usuário desconhecido');
                return [3 /*break*/, 6];
            case 2:
                idinscrito_1 = inscritos[0].IDInscrito;
                return [4 /*yield*/, axios({
                        method: 'post',
                        url: 'http://localhost:5000/listar/jogadores',
                        data: {
                            IDTorneio: idtorneio
                        }
                    })];
            case 3:
                response = _a.sent();
                index = response.data.findIndex(function (x) { return x.IDInscrito === idinscrito_1; });
                if (!(index > -1)) return [3 /*break*/, 4];
                e.log('Essa inscrição já foi confirmada');
                return [3 /*break*/, 6];
            case 4: return [4 /*yield*/, axios({
                    method: 'post',
                    url: 'http://localhost:5000/salvar/jogador',
                    data: {
                        IDInscrito: idinscrito_1,
                        IDTorneio: idtorneio
                    }
                })];
            case 5:
                response = _a.sent();
                e.log(response);
                _a.label = 6;
            case 6: return [2 /*return*/];
        }
    });
}); };
/**
 * @param  {number} idpartida
 * @param  {number} idvencedor
 * @param  {number} idperdedor
 */
var finalizarPartida = function (idpartida, idvencedor, idperdedor) { return __awaiter(void 0, void 0, void 0, function () {
    var response;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, axios({
                    method: 'post',
                    url: 'http://localhost:5000/finalizar/partida',
                    data: {
                        IDPartida: idpartida,
                        IDVencedor: idvencedor
                    }
                })];
            case 1:
                response = _a.sent();
                return [4 /*yield*/, axios({
                        method: 'post',
                        url: 'http://localhost:5000/retirar/vidas',
                        data: {
                            IDPerdedor: idperdedor
                        }
                    })];
            case 2:
                response = _a.sent();
                return [2 /*return*/];
        }
    });
}); };
var criarFinal = function (idtorneio) { return __awaiter(void 0, void 0, void 0, function () {
    var players, jogadores, response, vidas, max, ids, min, index, total, data, result;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                players = [];
                return [4 /*yield*/, axios({
                        method: 'post',
                        url: 'http://localhost:5000/listar/jogadores/mesas',
                        data: { IDTorneio: idtorneio }
                    })];
            case 1:
                jogadores = _a.sent();
                response = jogadores.data;
                vidas = [];
                response.forEach(function (a) {
                    vidas.push(a.Vidas);
                });
                max = Math.max.apply(Math, vidas);
                response = response.filter(function (x) { return x.Vidas === max; });
                ids = [];
                response.forEach(function (x) {
                    ids.push(x.IDJogador);
                });
                min = Math.min.apply(Math, ids);
                index = response.findIndex(function (x) { return x.IDJogador === min; });
                players.push(response[index]);
                /**
                * Aqui vou precisar deixar apenas os jogadores da mesa escolhida e retirar o primeiro
                * jogador selecionado para a partida
                */
                response = jogadores.data;
                index = response.findIndex(function (x) { return x.IDJogador == players[0].IDJogador; });
                response.splice(index, 1);
                vidas = [];
                response.forEach(function (a) {
                    vidas.push(a.Vidas);
                });
                /**
                 * Aqui vou definir qual o valor máximo de vidas ainda nessa
                 * mesa do torneio
                 */
                max = Math.max.apply(Math, vidas);
                response = response.filter(function (x) { return x.Vidas === max; });
                /**
                 * Aqui vou pegar apenas os IDs dos jogadores filtrados
                 */
                ids = [];
                response.forEach(function (x) {
                    ids.push(x.IDJogador);
                });
                /**
                 * Aqui vou pegar o menor id Entre esses jogadores
                 */
                min = Math.min.apply(Math, ids);
                /**
                 * Aqui vou pegar o index do elemento de menor id
                 * localizando dessa forma, o primeiro player da mesa
                 */
                index = response.findIndex(function (x) { return x.IDJogador === min; });
                players.push(response[index]);
                e.log(players);
                response = jogadores.data;
                total = response.filter(function (x) { return x.Vidas > 0; }).length;
                e.log(total + " jogadores dispon\u00EDveis");
                if (!(total > 1)) return [3 /*break*/, 3];
                data = {
                    IDMesa: 1,
                    PrimeiroJogador: players[0].IDJogador,
                    SegundoJogador: players[1].IDJogador,
                    IDStatusPartida: 2,
                    IDTorneio: idtorneio,
                    ApelidoPrimeiroJogador: players[0].NickName,
                    ApelidoSegundoJogador: players[1].NickName
                };
                return [4 /*yield*/, axios({
                        method: 'post',
                        url: 'http://localhost:5000/salvar/partida',
                        data: data
                    })];
            case 2:
                result = _a.sent();
                return [3 /*break*/, 4];
            case 3:
                e.log("O vendedor da mesa foi " + players[0].NickName);
                _a.label = 4;
            case 4: return [2 /*return*/];
        }
    });
}); };
var listarJogadores = function (idtorneio) { return __awaiter(void 0, void 0, void 0, function () {
    var jogadores;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, axios({
                    method: 'post',
                    url: 'http://localhost:5000/listar/jogadores/mesas',
                    data: { IDTorneio: idtorneio }
                })];
            case 1:
                jogadores = _a.sent();
                console.clear();
                jogadores.data.forEach(function (x) { return e.log(x); });
                return [2 /*return*/];
        }
    });
}); };
module.exports = {
    populamesas: populamesas,
    criarPartidas: criarPartidas,
    mostrarPartidas: mostrarPartidas,
    confirmarPagamento: confirmarPagamento,
    finalizarPartida: finalizarPartida,
    criarFinal: criarFinal,
    listarJogadores: listarJogadores
};
