const cnn = require('../db/sqlserver');
require('dotenv').config()

var sendJsonResponse = function (res, status, content) {
    res.status(status);
    res.json(content);
}

module.exports.salvarJogador = (req, res) => {
    cnn.sql.on('error', () => {
        sendJsonResponse(res, 401, {
            msg: 'Falha na obtenção do recurso'
        })
    })

    cnn.sql.connect(cnn.config)
        .then(pool => {
            return pool.request()
                .input('IDInscrito', cnn.sql.Int, parseInt(req.body.IDInscrito))
                .input('IDTorneio', cnn.sql.Int, parseInt(req.body.IDTorneio))
                .query("insert into Jogadores(IDInscrito, IDTorneio) values (@IDInscrito, @IDTorneio)");
        })
        .then(result => {
            sendJsonResponse(res, 200, result);
            return cnn.sql.close();
        })
        .catch(err => {
            sendJsonResponse(res, 404, err);
            console.log(err);
            return cnn.sql.close();
        })
}