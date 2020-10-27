const cnn = require('../db/sqlserver');
require('dotenv').config()

var sendJsonResponse = function (res, status, content) {
    res.status(status);
    res.json(content);
}

module.exports.listarRankingGeral = (req, res) => {
    let jogadores = [];
   
    cnn.sql.on('error', () => {
        sendJsonResponse(res, 401, {
            msg: 'Falha na obtenção do recurso'
        })
    })


    cnn.sql.connect(cnn.config)
        .then(pool => {
            let data = pool.request()
                .query("select A.IDInscrito, A.NickName, count(C.IDVencedor) as Vitorias, SUM(DATEDIFF(second, C.DataInicio, C.DataFim)) AS DIIF from Inscritos as A inner join Jogadores as B on A.IDInscrito = b.IDInscrito left join Partidas as C on B.IDJogador = C.IDVencedor inner join Torneios as D on B.IDTorneio = D.IDTorneio group by A.IDInscrito, A.NickName, C.IDVencedor order by Vitorias desc, A.IDInscrito asc, DIIF;");

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

module.exports.listarRankingTorneio = (req, res) => {
    let jogadores = [];
   
    cnn.sql.on('error', () => {
        sendJsonResponse(res, 401, {
            msg: 'Falha na obtenção do recurso'
        })
    })


    cnn.sql.connect(cnn.config)
        .then(pool => {
            let data = pool.request()
                .query("select A.IDInscrito, A.NickName, B.IDTorneio, D.DataTorneio, count(C.IDVencedor) as Vitorias, SUM(DATEDIFF(second, C.DataInicio, C.DataFim)) AS DIIF from Inscritos as A inner join Jogadores as B on A.IDInscrito = b.IDInscrito left join Partidas as C on B.IDJogador = C.IDVencedor inner join Torneios as D on B.IDTorneio = D.IDTorneio where D.IDStatusTorneio = 4 or D.IDStatusTorneio = 5 group by A.IDInscrito, A.NickName, B.IDTorneio, D.DataTorneio, C.IDVencedor order by Vitorias desc, A.IDInscrito asc, DIIF");

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