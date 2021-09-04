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
          "select id, usuario, senha, grupo, idEmpresa from login where usuario = @usuario"
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
                senha: data['senha'],
                idEmpresa: data["idEmpresa"]
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

module.exports.getEtiqueta = (req, res) => {
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
        .input("etiqueta", cnn.sql.VarChar(255), req.body.etiqueta)
        .query(
          "SELECT B.id, E.Empresa, E.cnpj, B.identificacao FROM Empresas E INNER JOIN ETIQUETAS B ON E.id = B.idEmpresa WHERE B.identificacao = @etiqueta"
        );

      return data;
    })
    .then((data) => {
      if (data.recordset.length > 0) {
        sendJsonResponse(res, 200, data.recordset);
        return cnn.sql.close();
      } else {
        sendJsonResponse(res, 404, {});
        return cnn.sql.close();
      }
    })
    .catch((err) => {
      sendJsonResponse(res, 500, "error 4");
      return cnn.sql.close();
    });
};

module.exports.leitura = (req, res) => {
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
        .input("idEtiqueta", cnn.sql.Int, req.body.idEtiqueta)
        .input("idColaborador", cnn.sql.Int, req.body.idColaborador)
        .query(
          "INSERT INTO Leitura(idEtiqueta, idColaborador) VALUES(@idEtiqueta , @idColaborador)"
        );

      return data;
    })
    .then((data) => {
      if (data.rowsAffected.length > 0) {
        sendJsonResponse(res, 200, data.rowsAffected);
        return cnn.sql.close();
      } else {
        sendJsonResponse(res, 404, {});
        return cnn.sql.close();
      }
    })
    .catch((err) => {
      sendJsonResponse(res, 500, "error 4");
      console.log(err);
      return cnn.sql.close();
    });
};

module.exports.recebimento = (req, res) => {
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
        .input("latitude", cnn.sql.VarChar(50), req.body.latitude)
        .input("longitude", cnn.sql.VarChar(50), req.body.longitude)
        .input("peso", cnn.sql.VarChar(50), req.body.peso)
        .input("tipo", cnn.sql.VarChar(50), req.body.tipo)
        .input("idColaborador", cnn.sql.Int, req.body.idColaborador)
        .input("idRecebedor", cnn.sql.Int, req.body.idRecebedor)
        .query(
          "INSERT INTO Recebimento([latitude], [longitude], [peso], [tipo], [idColaborador], [IdRecebedor]) VALUES (@latitude, @longitude, @peso, @tipo, @idColaborador, @idRecebedor)"
        );

      return data;
    })
    .then((data) => {
      if (data.rowsAffected.length > 0) {
        sendJsonResponse(res, 200, data.rowsAffected);
        return cnn.sql.close();
      } else {
        sendJsonResponse(res, 404, {});
        return cnn.sql.close();
      }
    })
    .catch((err) => {
      sendJsonResponse(res, 500, "error 4");
      console.log(err);
      return cnn.sql.close();
    });
};

module.exports.etiquetasPorEmpresa = (req, res) => {
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
        .input("id", cnn.sql.Int, req.body.id)
        .query(
          "select CONCAT('Etiqueta: ', b.identificacao, '  as  ', FORMAT( DATEADD(HOUR, -3, a.data), 'dd/MM/yyyy hh:mm:ss', 'en-US' )) leitura from Leitura a inner join Etiquetas b on a.idEtiqueta = b.id inner join Empresas c on b.idEmpresa = c.id where c.id = @id"
        );

      return data;
    })
    .then((data) => {
      if (data.recordset.length > 0) {
        sendJsonResponse(res, 200, data.recordset);
        return cnn.sql.close();
      } else {
        sendJsonResponse(res, 200, {leitura: ''});
        return cnn.sql.close();
      }
    })
    .catch((err) => {
      sendJsonResponse(res, 500, "error 4");
      console.log(err);
      return cnn.sql.close();
    });
};
