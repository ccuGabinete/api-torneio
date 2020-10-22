const cnn = require('../db/sqlserver');
require('dotenv').config()
const f = console.log;

var sendJsonResponse = function (res, status, content) {
    res.status(status);
    res.json(content);
}


module.exports.salvarTorneio = (req, res, next) => {
    cnn.sql.on('error', err => {
        sendJsonResponse(res, 401, {
            msg: 'Falha na obtenção do recurso'
        })
    })

    cnn.sql.connect(cnn.config)
        .then(pool => {
            return pool.request()
                .input('NomeTorneio', cnn.sql.VarChar(255), req.body.NomeTorneio)
                .input('DataTorneio', cnn.sql.VarChar(20), req.body.DataTorneio)
                .input('UF', cnn.sql.VarChar(5), req.body.UF)
                .input('Municipio', cnn.sql.VarChar(255), req.body.Municipio)
                .input('Bairro', cnn.sql.VarChar(255), req.body.Bairro)
                .input('Logradouro', cnn.sql.VarChar(255), req.body.Logradouro)
                .input('Numero', cnn.sql.VarChar(50), req.body.Numero)
                .input('Complemento', cnn.sql.VarChar(50), req.body.Complemento)
                .input('status', cnn.sql.Int, req.body.status)
                .query("insert into Torneios(NomeTorneio, DataTorneio, UF, Municipio, Bairro, Logradouro, Numero, Complemento, status) values (@NomeTorneio, @DataTorneio, @UF, @Municipio, @Bairro, @Logradouro, @Numero, @Complemento, @status)");
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