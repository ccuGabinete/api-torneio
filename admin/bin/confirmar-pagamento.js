var admin = require('../admin');
const cpf = process.argv.slice(2)[0];
const idtorneio = process.argv.slice(3)[0];
admin.confirmarPagamento(cpf, idtorneio);