const { query } = require('express');
const cnn = require('../db/sqlserver');
const nodemailer = require("nodemailer");
const { pool } = require('mssql');
require('dotenv').config()
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
                .input('DataNascimento', cnn.sql.VarChar(20), req.body.DataNascimento)
                .input('NickName', cnn.sql.VarChar(255), req.body.NickName)
                .input('Email', cnn.sql.VarChar(255), req.body.Email)
                .input('IDEquipe', cnn.sql.Int, parseInt(req.body.IDEquipe))
                .input('CPF', cnn.sql.VarChar(25), req.body.CPF)
                .input('CEP', cnn.sql.VarChar(25), req.body.CEP)
                .query("insert into Inscritos(NomeInscrito, DataNascimento, NickName, Email, IDEquipe, CPF, CEP) values (@NomeInscrito, @DataNascimento, @NickName, @Email, @IDEquipe, @CPF, @CEP)");
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
                .query("select * from Inscritos order by NomeInscrito");

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
            cnn.sql.connect(cnn.config)
                .then(pool => {
                    return pool.request()
                        .input('NomeEquipe', cnn.sql.VarChar(255), req.body.NomeEquipe)
                        .query("select top (1) [IDEquipe] from Equipes where NomeEquipe = @NomeEquipe");
                })
                .then(data => {
                    sendJsonResponse(res, 200, data.recordset[0].IDEquipe);
                    return cnn.sql.close();
                })
                .catch(err => {
                    sendJsonResponse(res, 404, err);
                    console.log(error);
                    return cnn.sql.close();
                })

            // return cnn.sql.close();
        })
        .catch(err => {
            sendJsonResponse(res, 404, err);
            console.log(err);
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

module.exports.listarMesas = (req, res, next) => {
    let mesas = [];


    cnn.sql.on('error', err => {
        sendJsonResponse(res, 401, {
            msg: 'Falha na obtenção do recurso'
        })
    })


    cnn.sql.connect(cnn.config)
        .then(pool => {
            let data = pool.request()
                .query("select * from Mesas where IDStatusMesa = 1 order by IDMesa");

            return data;
        })
        .then(data => {
            for (let i = 0; i < data.rowsAffected; i++) {
                mesas.push(data.recordset[i]);
            }
            sendJsonResponse(res, 200, mesas);
            return cnn.sql.close();
        })
        .catch(err => {
            sendJsonResponse(res, 404, err);
            return cnn.sql.close();
        })
}

module.exports.listarJogadores = (req, res, next) => {
    let jogadores = [];


    cnn.sql.on('error', err => {
        sendJsonResponse(res, 401, {
            msg: 'Falha na obtenção do recurso'
        })
    })


    cnn.sql.connect(cnn.config)
        .then(pool => {
            let data = pool.request()
                .input('IDTorneio', cnn.sql.Int, req.body.IDTorneio)
                .query("select * from Jogadores where IDTorneio = @IDTorneio");

            return data;
        })
        .then(data => {
            for (let i = 0; i < data.rowsAffected; i++) {
                jogadores.push(data.recordset[i]);
            }
            sendJsonResponse(res, 200, jogadores);
            return cnn.sql.close();
        })
        .catch(err => {
            sendJsonResponse(res, 404, err);
            return cnn.sql.close();
        })
}

module.exports.getCPF = (req, res, next) => {
    let equipes = [];


    cnn.sql.on('error', err => {
        sendJsonResponse(res, 401, {
            msg: 'Falha na obtenção do recurso'
        })
    })


    cnn.sql.connect(cnn.config)
        .then(pool => {
            let data = pool.request()
                .input('CPF', cnn.sql.VarChar(25), req.body.CPF)
                .query("select COUNT(CPF) as Total from Inscritos where CPF = @CPF");

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

module.exports.sendEmail = (req, res, next) => {
    async function main() {

        let transporter = nodemailer.createTransport({
            host: "smtpout.secureserver.net",
            port: 465,
            secure: true,
            auth: {
                user: process.env.MAIL_USER,
                pass: process.env.MAIL_PASS
            },
        });


        let info = await transporter.sendMail({
            from: '"LCS" <admin@ligadoscampeoesdasinuca.com>',
            to: req.body.destino,
            subject: "Confirmação de Inscrição  ✔",
            text: req.body.msg,
            html: "<b>" + req.body.msg + "</b>"
        });


    }

    main()
        .then(
            sendJsonResponse(res, 200, { response: "ok" })
        )
        .catch(err => sendJsonResponse(res, 404, { response: err }));

}

module.exports.getEmail = (req, res, next) => {
    let equipes = [];


    cnn.sql.on('error', err => {
        sendJsonResponse(res, 401, {
            msg: 'Falha na obtenção do recurso'
        })
    })


    cnn.sql.connect(cnn.config)
        .then(pool => {
            let data = pool.request()
                .input('Email', cnn.sql.VarChar(255), req.body.email)
                .query("select COUNT(Email) as Total from Inscritos where Email = @Email");

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