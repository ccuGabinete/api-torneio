const cnn = require('../db/sqlserver');
const nodemailer = require("nodemailer");
require('dotenv').config()

var sendJsonResponse = function (res, status, content) {
    res.status(status);
    res.json(content);
}

module.exports.salvarInscrito = (req, res) => {
    cnn.sql.on('error', () => {
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

module.exports.listarInscritos = (req, res) => {
    let equipes = [];


    cnn.sql.on('error', () => {
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

module.exports.salvarEquipe = (req, res) => {
    cnn.sql.on('error', () => {
        sendJsonResponse(res, 401, {
            msg: 'Falha na obtenção do recurso'
        })
    })

    cnn.sql.connect(cnn.config)
        .then(pool => {
            return pool.request()

                .input('NomeEquipe', cnn.sql.VarChar(255), req.body.NomeEquipe.toUpperCase())
                .input('CEP', cnn.sql.VarChar(25), req.body.CEP)
                .query("insert into Equipes(IDTipoEquipe, NomeEquipe, CEP) values (@IDTipoEquipe, @NomeEquipe, @CEP)");
        })
        .then(() => {
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

module.exports.listarEquipes = (req, res) => {
    let equipes = [];


    cnn.sql.on('error', () => {
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

module.exports.listarMesas = (req, res) => {
    let mesas = [];


    cnn.sql.on('error', () => {
        sendJsonResponse(res, 401, {
            msg: 'Falha na obtenção do recurso'
        })
    })


    cnn.sql.connect(cnn.config)
        .then(pool => {
            let data = pool.request()
                .query("select * from Mesas");

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

module.exports.listarJogadores = (req, res) => {
    let jogadores = [];


    cnn.sql.on('error', () => {
        sendJsonResponse(res, 401, {
            msg: 'Falha na obtenção do recurso'
        })
    })


    cnn.sql.connect(cnn.config)
        .then(pool => {
            let data = pool.request()
                .input('IDTorneio', cnn.sql.Int, req.body.IDTorneio)
                .query("select A.*, b.NickName from Jogadores as A inner join Inscritos as B on A.IDInscrito = B.IDInscrito where IDTorneio = @IDTorneio");

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

module.exports.getCPF = (req, res) => {
    let equipes = [];


    cnn.sql.on('error', () => {
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

module.exports.sendEmail = (req, res) => {
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




    }

    main()
        .then(
            sendJsonResponse(res, 200, { response: "ok" })
        )
        .catch(err => sendJsonResponse(res, 404, { response: err }));

}

module.exports.getEmail = (req, res) => {
    let equipes = [];


    cnn.sql.on('error', () => {
        sendJsonResponse(res, 401, {
            msg: 'Falha na obtenção do recurso'
        })
    })


    cnn.sql.connect(cnn.config)
        .then(pool => {
            let data = pool.request()
                .input('Email', cnn.sql.VarChar(255), req.body.email)
                .query("select COUNT(Email) as Total, IDinscrito  from Inscritos where Email = @Email group by IDInscrito");

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

module.exports.limparMesas = (req, res) => {
    cnn.sql.on('error', () => {
        sendJsonResponse(res, 401, {
            msg: 'Falha na obtenção do recurso'
        })
    })

    cnn.sql.connect(cnn.config)
        .then(pool => {
            let data = pool.request()
                .input('IDTorneio', cnn.sql.Int, req.params.idtorneio)
                .query("delete JogadorMesa from JogadorMesa as A inner join Jogadores as B on A.IDJogador = B.IDJogador where b.IDTorneio = @IDTorneio");

            return data;
        })
        .then(data => {

            sendJsonResponse(res, 200, {
                linhasafetadas: data.rowsAffected
            });

            return cnn.sql.close();
        })
        .catch(err => {
            sendJsonResponse(res, 404, err);
            return cnn.sql.close();
        })

}

module.exports.povoarMesas = (req, res) => {


    cnn.sql.on('error', () => {
        sendJsonResponse(res, 401, {
            msg: 'Falha na obtenção do recurso'
        })
    })

    cnn.sql.connect(cnn.config)
        .then(pool => {
            let data = pool.request()
                .input('IDJogador', cnn.sql.Int, req.params.idjogador)
                .input('IDMesa', cnn.sql.Int, req.params.idmesa)
                .input('IDTorneio', cnn.sql.Int, req.params.idtorneio)
                .input('NickName', cnn.sql.VarChar(255), req.params.NickName)
                .query("insert into JogadorMesa(IDJogador, IDMesa, IDTorneio, NickName) values (@IDJogador, @IDMesa, @IDTorneio, @NickName)");

            return data;
        })
        .then(data => {

            sendJsonResponse(res, 200, {
                linhasafetadas: data.rowsAffected
            });

            return cnn.sql.close();
        })
        .catch(err => {
            sendJsonResponse(res, 404, err);
            return cnn.sql.close();
        })
}

module.exports.listarJogadoresMesas = (req, res) => {
    let jogadores = [];


    cnn.sql.on('error', () => {
        sendJsonResponse(res, 401, {
            msg: 'Falha na obtenção do recurso'
        })
    })


    cnn.sql.connect(cnn.config)
        .then(pool => {
            let data = pool.request()
                .input('IDTorneio', cnn.sql.Int, req.body.IDTorneio)
                .query("select B.IDJogador, C.NomeInscrito, C.NickName, B.IDMesa, A.Vidas from Jogadores as A inner join JogadorMesa as B on A.IDJogador = B.IDJogador inner join Inscritos as C on A.IDInscrito = C.IDInscrito where A.Vidas > 0 AND A.IDTorneio = @IDTorneio  order by A.IDJogador");

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

module.exports.buscarJogador = (req, res) => {
    let jogadores = [];

    console.log(req.params);

    cnn.sql.on('error', () => {
        sendJsonResponse(res, 401, {
            msg: 'Falha na obtenção do recurso'
        })
    })
  
    cnn.sql.connect(cnn.config)
        .then(pool => {
            let data = pool.request()
                .input('IDTorneio', cnn.sql.Int, parseInt(req.body.IDTorneio))
                .input('IDInscrito', cnn.sql.Int, parseInt(req.body.IDInscrito))
                .query("select count(A.IDInscrito) as TOTAL from Jogadores as A where IDInscrito = @IDInscrito and IDTorneio = @IDTorneio");

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









