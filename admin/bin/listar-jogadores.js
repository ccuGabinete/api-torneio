var admin = require('../admin');
const idtorneio = process.argv.slice(2)[0];
admin.listarJogadores(idtorneio);