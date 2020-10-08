var express = require('express');
var router = express.Router();
const inscrito = require('../controllerjs/InscritoController')


/* GET home page. */
router.post('/salvar/inscrito', inscrito.salvarInscrito);
router.post('/salvar/equipe', inscrito.salvarEquipe);
router.get('/listar/equipes', inscrito.listarEquipes);
router.get('/listar/inscritos', inscrito.listarInscritos);

module.exports = router;