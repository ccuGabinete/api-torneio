const axios = require('axios');

var sendJsonResponse = function (res, status, content) {
    res.status(status);
    res.json(content);
}

module.exports.buscarCEP = (req, res, next) => {
    axios.get('https://viacep.com.br/ws/' + req.body.cep + '/json')
        .then(function (response) {
            sendJsonResponse(res, 200, response.data);
        })       
        .catch(function (error) {
            sendJsonResponse(res, 401, {error: error});
        })
}

