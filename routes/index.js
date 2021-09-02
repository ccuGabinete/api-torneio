var express = require('express');
var router = express.Router();
// const inscrito = require('../controllerjs/InscritoController');
// const cep = require('../controllerjs/cepContoller');
// const torneio = require('../controllerjs/torneioController');
// const partida = require('../controllerjs/partidaController');
// const jogador = require('../controllerjs/jogadorController');
// const ranking = require('../controllerjs/rankingController');
const comlurb = require('../controllerjs/comlurbController');

router.get('/', comlurb.listar);
router.post('/usuario', comlurb.getUsuario);
router.post('/salvar', comlurb.salvar);
router.post('/etiqueta', comlurb.getEtiqueta);
router.post('/leitura', comlurb.leitura);

/* GET home page. */
// router.get('/limpar/mesas/:idtorneio', inscrito.limparMesas);
// router.get('/listar/equipes', inscrito.listarEquipes);
// router.get('/listar/inscritos', inscrito.listarInscritos);
// router.get('/listar/mesas', inscrito.listarMesas);
// router.get('/listar/partidas', partida.listarPartidas);
// router.get('/listar/ranking', ranking.listarRankingTorneio);
// router.get('/listar/ranking/geral', ranking.listarRankingGeral);
// router.get('/povoar/mesas/:idjogador/:idmesa/:idtorneio/:NickName', inscrito.povoarMesas);
// router.post('/buscar/CEP', cep.buscarCEP);
// router.post('/buscar/CPF', inscrito.getCPF);
// router.post('/buscar/email', inscrito.getEmail);
// router.post('/buscar/jogador', inscrito.buscarJogador);
// router.post('/email/send', inscrito.sendEmail);
// router.post('/finalizar/partida', partida.finalizarPartida);
// router.post('/iniciar/partida', partida.iniciarPartida);
// router.post('/listar/jogadores', inscrito.listarJogadores);
// router.post('/listar/jogadores/mesas', inscrito.listarJogadoresMesas);
// router.post('/listar/torneios', torneio.listarTorneios);
// router.post('/retirar/vidas', partida.retiraVidas);
// router.post('/salvar/equipe', inscrito.salvarEquipe);
// router.post('/salvar/inscrito', inscrito.salvarInscrito);
// router.post('/salvar/jogador',jogador.salvarJogador);
// router.post('/salvar/partida', partida.salvarPartida);
// router.post('/salvar/torneio', torneio.salvarTorneio);


module.exports = router;
