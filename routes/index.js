var express = require('express');
var router = express.Router();
const inscrito = require('../controllerjs/InscritoController')
const cep = require('../controllerjs/cepContoller')


/* GET home page. */
router.post('/salvar/inscrito', inscrito.salvarInscrito);
router.post('/salvar/equipe', inscrito.salvarEquipe);
router.post('/buscar/CPF', inscrito.getCPF);
router.post('/email/send', inscrito.sendEmail);
router.get('/listar/equipes', inscrito.listarEquipes);
router.get('/listar/inscritos', inscrito.listarInscritos);
router.post('/buscar/CEP', cep.buscarCEP);
router.post('/buscar/email', inscrito.getEmail);

module.exports = router;
