const cnn = require('../db/sqlserver');
require('dotenv').config()

var sendJsonResponse = function (res, status, content) {
    res.status(status);
    res.json(content);
}

module.exports.salvar = (req, res) => {
    cnn.sql.on('error', () => {
        sendJsonResponse(res, 401, {
            msg: 'Falha na obtenção do recurso'
        })
    })

    cnn.sql.connect(cnn.config)
        .then(pool => {
             let result = pool.request()
                .input('usuario', cnn.sql.VarChar(255), req.body.usuario)
                .input('senha', cnn.sql.VarChar(255), req.body.senha)
                .query("insert into login(usuario, senha) values (@usuario, @senha)");

                return result;
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

module.exports.listar = (req, res) => {
    let usuarios = [];


    cnn.sql.on('error', () => {
        sendJsonResponse(res, 401, {
            msg: 'Falha na obtenção do recurso'
        })
    })


    cnn.sql.connect(cnn.config)
        .then(pool => {
            let data = pool.request()
                .query("select * from login");

            return data;
        })
        .then(data => {
            for (let i = 0; i < data.rowsAffected; i++) {
                usuarios.push(data.recordset[i]);
            }
            sendJsonResponse(res, 200, usuarios);
            return cnn.sql.close();
        })
        .catch(err => {
            sendJsonResponse(res, 404, err);
            return cnn.sql.close();
        })
}

module.exports.getUsuario = (req, res) => {

    cnn.sql.on('error', () => {
        sendJsonResponse(res, 401, {
            msg: 'Falha na obtenção do recurso'
        })
    })

    cnn.sql.connect(cnn.config)
        .then(pool => {
            let data = pool.request()
            .input('usuario', cnn.sql.VarChar(255), req.body.usuario)
            .input('senha', cnn.sql.VarChar(255), req.body.senha)
            .query("select id, usuario, senha from login where usuario = @usuario and senha = @senha");
            
            return data;
        })
        .then(data => {
            
            sendJsonResponse(res, 200, data.recordset[0]);
            return cnn.sql.close();
        })
        .catch(err => {
            sendJsonResponse(res, 404, err);
            console.log(err);
            return cnn.sql.close();
        })
}
