select B.IDJogador, C.NomeInscrito, B.IDMesa, A.Vidas from Jogadores as A inner join JogadorMesa as B on A.IDJogador = B.IDJogador inner join Inscritos as C on A.IDInscrito = C.IDInscrito order by A.IDJogador;