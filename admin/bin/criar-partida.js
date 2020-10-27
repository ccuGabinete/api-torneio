var admin = require('../admin');
const idtorneio = process.argv.slice(2)[0];
const idmesa = process.argv.slice(3)[0];
admin.criarPartidas(idtorneio, idmesa)

