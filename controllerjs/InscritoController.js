const { query } = require('express');
const cnn = require('../db/sqlserver')
const f = console.log;

var sendJsonResponse = function (res, status, content) {
    res.status(status);
    res.json(content);
}


module.exports.salvarInscrito = (req, res, next) => {
    cnn.sql.on('error', err => {
        sendJsonResponse(res, 401, {
            msg: 'Falha na obtenção do recurso'
        })
    })


    cnn.sql.connect(cnn.config)
        .then(pool => {
            return pool.request()
                .input('NomeInscrito', cnn.sql.VarChar(255), req.body.NomeInscrito)
                .input('DataNascimento', cnn.sql.Date, req.body.DataNascimento)
                .input('NickName', cnn.sql.VarChar(255), req.body.NickName)
                .input('Email', cnn.sql.VarChar(255), req.body.Email)
                .input('IDEquipe', cnn.sql.Int, req.body.IDEquipe)
                .input('CPF', cnn.sql.VarChar(255), req.body.CPF)
                .query("insert into Inscritos(NomeInscrito, DataNascimento, NickName, Email, IDEquipe, CPF) values (@NomeInscrito, @DataNascimento, @NickName, @Email, @IDEquipe, @CPF)");
        })
        .then(result => {
            sendJsonResponse(res, 200, result);
            return cnn.sql.close();
        })
        .catch(err => {
            sendJsonResponse(res, 404, err);
            return cnn.sql.close();
        })
}

module.exports.listarInscritos = (req, res, next) => {
    let equipes = [];


    cnn.sql.on('error', err => {
        sendJsonResponse(res, 401, {
            msg: 'Falha na obtenção do recurso'
        })
    })


    cnn.sql.connect(cnn.config)
        .then(pool => {
            let data = pool.request()
                .query("select * from Inscritos");     

            return data;
        })
        .then(data => {
            for (let i = 0; i < data.rowsAffected; i++) {
                equipes.push(data.recordset[i]);
            }
            sendJsonResponse(res, 200, equipes);
            return cnn.sql.close();
        })
        .catch(err => {
            sendJsonResponse(res, 404, err);
            return cnn.sql.close();
        })
}

module.exports.salvarEquipe = (req, res, next) => {
    cnn.sql.on('error', err => {
        sendJsonResponse(res, 401, {
            msg: 'Falha na obtenção do recurso'
        })
    })


    cnn.sql.connect(cnn.config)
        .then(pool => {
            return pool.request()
                .input('IDTipoEquipe', cnn.sql.Int, req.body.IDTipoEquipe)
                .input('NomeEquipe', cnn.sql.VarChar(255), req.body.NomeEquipe.toUpperCase())
                .input('CEP', cnn.sql.VarChar(25), req.body.CEP)
                .query("insert into Equipes(IDTipoEquipe, NomeEquipe, CEP) values (@IDTipoEquipe, @NomeEquipe, @CEP)");
        })
        .then(result => {
            sendJsonResponse(res, 200, result);
            return cnn.sql.close();
        })
        .catch(err => {
            sendJsonResponse(res, 404, err);
            return cnn.sql.close();
        })
}

module.exports.listarEquipes = (req, res, next) => {
    let equipes = [];


    cnn.sql.on('error', err => {
        sendJsonResponse(res, 401, {
            msg: 'Falha na obtenção do recurso'
        })
    })


    cnn.sql.connect(cnn.config)
        .then(pool => {
            let data = pool.request()
                .query("select * from Equipes");     

            return data;
        })
        .then(data => {
            for (let i = 0; i < data.rowsAffected; i++) {
                equipes.push(data.recordset[i]);
            }
            sendJsonResponse(res, 200, equipes);
            return cnn.sql.close();
        })
        .catch(err => {
            sendJsonResponse(res, 404, err);
            return cnn.sql.close();
        })
}

