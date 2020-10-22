const mesas = [1, 2, 3];
const tamanho = mesas.length;
const jogadores = ['a', 'b', 'c', 'd', 'e', 'f', 'g'];
const f = console.log;
var response = [];



for (let i = 0; i < tamanho; i++) {
    for (let j = 0; j < jogadores.length; j++) {
        if ((j - i) % tamanho === 0) {
            let res = `insert into JogadorMesa (IDJogador, IDMesa) values (${i}, ${j})`;
            response.push(res);
        } else {
            continue;
        }
    }
}

var lg = response.length;

var insertora = setInterval(() => {
    f(response[lg - 1]);
    lg--;
    if(lg === 0){
        clearInterval(insertora);
    }
}, 200);





