var express = require('express');
var router = express.Router();
const inscrito = require('../controllerjs/InscritoController');
const cep = require('../controllerjs/cepContoller');
const torneio = require('../controllerjs/torneioContoller');


/* GET home page. */
router.post('/salvar/inscrito', inscrito.salvarInscrito);
router.post('/salvar/equipe', inscrito.salvarEquipe);
router.post('/buscar/CPF', inscrito.getCPF);
router.post('/email/send', inscrito.sendEmail);
router.get('/listar/equipes', inscrito.listarEquipes);
router.get('/listar/inscritos', inscrito.listarInscritos);
router.get('/listar/mesas', inscrito.listarMesas);
router.post('/listar/jogadores', inscrito.listarJogadores);
router.post('/buscar/CEP', cep.buscarCEP);
router.post('/buscar/email', inscrito.getEmail);
router.post('/salvar/torneio', torneio.salvarTorneio);

module.exports = router;
