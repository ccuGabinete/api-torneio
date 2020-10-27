const cnn = require('../db/sqlserver');
const e = console;
const luxon = require('luxon');

var sendJsonResponse = function (res, status, content) {
    res.status(status);
    res.json(content);
}

module.exports.salvarPartida = (req, res) => {
    cnn.sql.on('error', () => {
        sendJsonResponse(res, 401, {
            msg: 'Falha na obtenção do recurso'
        })
    })

    cnn.sql.connect(cnn.config)
        .then(pool => {
            return pool.request()
                .input('IDMesa', cnn.sql.Int, req.body.IDMesa)
                .input('PrimeiroJogador', cnn.sql.Int, req.body.PrimeiroJogador)
                .input('SegundoJogador', cnn.sql.Int, req.body.SegundoJogador)
                .input('IDStatusPartida', cnn.sql.Int, req.body.IDStatusPartida)
                .input('IDTorneio', cnn.sql.Int, parseInt(req.body.IDTorneio))
                .input('ApelidoPrimeiroJogador', cnn.sql.VarChar(150), req.body.ApelidoPrimeiroJogador)
                .input('ApelidoSegundoJogador', cnn.sql.VarChar(150), req.body.ApelidoSegundoJogador)
                .query("insert into Partidas(IDMesa, PrimeiroJogador, SegundoJogador, IDStatusPartida, IDTorneio, ApelidoPrimeiroJogador, ApelidoSegundoJogador) values (@IDMesa, @PrimeiroJogador, @SegundoJogador, @IDStatusPartida, @IDTorneio, @ApelidoPrimeiroJogador, @ApelidoSegundoJogador)");
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

module.exports.iniciarPartida = (req, res) => {
    cnn.sql.on('error', () => {
        sendJsonResponse(res, 401, {
            msg: 'Falha na obtenção do recurso'
        })
    })


    e.log(req.body);
    cnn.sql.connect(cnn.config)
        .then(pool => {
            return pool.request()
                .input('IDPartida', cnn.sql.Int, parseInt(req.body.IDPartida))
                .input('IDStatusPartida', cnn.sql.Int, 2)
                .query("update Partidas set IDStatusPartida = @IDStatusPartida where IDPartida = @IDPartida");
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

module.exports.finalizarPartida = (req, res) => {
    cnn.sql.on('error', () => {
        sendJsonResponse(res, 401, {
            msg: 'Falha na obtenção do recurso'
        })
    })

    cnn.sql.connect(cnn.config)
        .then(pool => {
            return pool.request()
                .input('IDPartida', cnn.sql.Int, parseInt(req.body.IDPartida))
                .input('IDVencedor', cnn.sql.Int, parseInt(req.body.IDVencedor))
                .input('DataFim', cnn.sql.DateTime2, luxon.DateTime.local().plus({ hours: -3 }).toISO())
                .query("update Partidas set IDStatusPartida = 3, IDVencedor = @IDVencedor, DataFim = @DataFim where IDPartida = @IDPartida");
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

module.exports.retiraVidas = (req, res) => {
    cnn.sql.on('error', () => {
        sendJsonResponse(res, 401, {
            msg: 'Falha na obtenção do recurso'
        })
    })

    cnn.sql.connect(cnn.config)
        .then(pool => {
            return pool.request()
                .input('IDPerdedor', cnn.sql.Int, req.body.IDPerdedor)
                .query("update Jogadores set Vidas = Vidas - 1 where IDJogador = @IDPerdedor");
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

module.exports.listarPartidas = (req, res, next) => {
    let partidas = [];


    cnn.sql.on('error', err => {
        sendJsonResponse(res, 401, {
            msg: 'Falha na obtenção do recurso'
        })
    })


    cnn.sql.connect(cnn.config)
        .then(pool => {
            let data = pool.request()
                .query("select * from Partidas where IDStatusPartida = 2");

            return data;
        })
        .then(data => {
            for (let i = 0; i < data.rowsAffected; i++) {
                partidas.push(data.recordset[i]);
            }
            sendJsonResponse(res, 200, partidas);
            return cnn.sql.close();
        })
        .catch(err => {
            sendJsonResponse(res, 404, err);
            return cnn.sql.close();
        })
}
