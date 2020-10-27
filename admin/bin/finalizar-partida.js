var admin = require('../admin');
const idpartida = process.argv.slice(2)[0];
const idvencedor = process.argv.slice(3)[0];
const idperdedor = process.argv.slice(4)[0];
admin.finalizarPartida(idpartida, idvencedor, idperdedor);