var admin = require('../admin');

admin.mostrarPartidas();

setInterval(() => {
    admin.mostrarPartidas();
}, 20000);
