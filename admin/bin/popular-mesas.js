var admin = require('../admin');
const idtorneio = process.argv.slice(2)[0];
const idempresa = process.argv.slice(3)[0];
admin.populamesas(idtorneio, idempresa);