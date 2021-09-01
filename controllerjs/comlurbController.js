const cnn = require("../db/sqlserver");
const bcrypt = require("bcrypt");
require("dotenv").config();

var sendJsonResponse = function (res, status, content) {
  res.status(status);
  res.json(content);
};

module.exports.salvar = (req, res) => {
  cnn.sql.on("error", () => {
    sendJsonResponse(res, 401, {
      msg: "Problemas de conexão",
    });
  });

  bcrypt.hash(req.body.senha, 10, function (err, hash) {
    if (err) {
      sendJsonResponse(res, 401, {
        msg: "Problemas com a encriptação",
      });
    }

    cnn.sql
      .connect(cnn.config)
      .then((pool) => {
        let result = pool
          .request()
          .input("usuario", cnn.sql.VarChar(255), req.body.usuario)
          .input("senha", cnn.sql.VarChar(255), hash)
          .input("grupo", cnn.sql.Int, req.body.grupo)
          .query(
            "insert into login(usuario, senha, grupo) values (@usuario, @senha, @grupo)"
          );

        return result;
      })
      .then((result) => {
        sendJsonResponse(res, 200, "Usuário salvo com sucesso");
        return cnn.sql.close();
      })
      .catch((err) => {
        sendJsonResponse(res, 404, err);
        return cnn.sql.close();
      });
  });
};

module.exports.listar = (req, res) => {
  let usuarios = [];

  cnn.sql.on("error", () => {
    sendJsonResponse(res, 401, {
      msg: "Falha na obtenção do recurso",
    });
  });

  cnn.sql
    .connect(cnn.config)
    .then((pool) => {
      let data = pool.request().query("select * from login");

      return data;
    })
    .then((data) => {
      for (let i = 0; i < data.rowsAffected; i++) {
        usuarios.push(data.recordset[i]);
      }
      sendJsonResponse(res, 200, usuarios);
      return cnn.sql.close();
    })
    .catch((err) => {
      sendJsonResponse(res, 404, err);
      return cnn.sql.close();
    });
};

module.exports.getUsuario = (req, res) => {
  cnn.sql.on("error", () => {
    sendJsonResponse(res, 500, {
      msg: "error 5",
    });
  });

  cnn.sql
    .connect(cnn.config)
    .then((pool) => {
      let data = pool
        .request()
        .input("usuario", cnn.sql.VarChar(255), req.body.usuario)
        .query(
          "select id, usuario, senha, grupo from login where usuario = @usuario"
        );

      return data;
    })
    .then((data) => {
      let tamanho = JSON.stringify(data).length;
      if (data.recordset.length > 0) {
        data = data.recordset[0];
        bcrypt.compare(req.body.senha, data["senha"], function (err, result) {
          if (err) {
            sendJsonResponse(res, 401, {
              msg: "error 1",
            });
            return cnn.sql.close();
          } else {
            if (result) {
              var obj = {
                id: data["id"],
                usuario: data["usuario"],
                grupo: data["grupo"],
              };

              sendJsonResponse(res, 200, obj);
              return cnn.sql.close();
            } else {
              sendJsonResponse(res, 401, "error 2");
              return cnn.sql.close();
            }
          }
        });
      } else {
        sendJsonResponse(res, 401, "error 3");
      }
    })
    .catch((err) => {
      sendJsonResponse(res, 500, "error 4");
      return cnn.sql.close();
    });
};
