
import express from 'express';
import { FastifyReply, FastifyRequest } from 'fastify';

let ordens_e_servicos = [
  {
    "Categoria":"Iluminação",
    "Local":"Av.J.Lopes Pedroza",
    "Problema":"Aqui na minha rua caiu um raio e queimou o poste.",
    "Data de Solicitação":"20/05/25",
    "Data de Conclusão":"12/07/25",
    "Estado":"Em Andamento",
  }
  ,
  {
    "Categoria":"Iluminação2222",
    "Local":"Av.J.Lopes Pedroza2",
    "Problema":"Aqui na minha rua caiu um raio e queimou o poste.2",
    "Data de Solicitação":"20/04/25",
    "Data de Conclusão":"12/07/25",
    "Estado":"Concluido",
  }
  ,
  {
    "Categoria":"Iluminação2222",
    "Local":"Av.J.Lopes Pedroza2",
    "Problema":"Aqui na minha rua caiu um raio e queimou o poste.2",
    "Data de Solicitação":"10/05/25",
    "Data de Conclusão":"12/07/25",
    "Estado":"Em Andamento",
  }
  ,
  {
    "Categoria":"Iluminação2222",
    "Local":"Av.J.Lopes Pedroza2",
    "Problema":"Aqui na minha rua caiu um raio e queimou o poste.2",
    "Data de Solicitação":"20/02/25",
    "Data de Conclusão":"12/07/25",
    "Estado":"Em Andamento",
  }
  ,
  {
    "Categoria":"Iluminação2222",
    "Local":"Av.J.Lopes Pedroza2",
    "Problema":"Aqui na minha rua caiu um raio e queimou o poste.2",
    "Data de Solicitação":"10/01/25",
    "Data de Conclusão":"12/07/25",
    "Estado":"Concluido",
  }
  ,
  {
    "Categoria":"Iluminação2222",
    "Local":"Av.J.Lopes Pedroza2",
    "Problema":"Aqui na minha rua caiu um raio e queimou o poste.2",
    "Data de Solicitação":"20/05/24",
    "Data de Conclusão":"12/07/25",
    "Estado":"Concluido",
  }
  ,
  {
    "Categoria":"Iluminação2222",
    "Local":"Av.J.Lopes Pedroza2",
    "Problema":"Aqui na minha rua caiu um raio e queimou o poste.2",
    "Data de Solicitação":"20/05/23",
    "Data de Conclusão":"12/07/25",
    "Estado":"Em Andamento",
  }
  ,
  {
    "Categoria":"Iluminação3333",
    "Local":"Av.J.Lopes 5555",
    "Problema":"o muro quebrou aqui",
    "Data de Solicitação":"20/05/21",
    "Data de Conclusão":"12/07/25",
    "Estado":"Concluido",
  }
  ,
]

//USO: recente/pendente/concluido no Value

export const SolicitarOrdersInfo = async(
  request: FastifyRequest,
  reply: FastifyReply,
) => {
  const info = request.query as { mensagem?: string }

  if (info) {
    if (info.mensagem == "recente") {

      const parseData = (dataStr: string) => {
        const [dia, mes, ano] = dataStr.split("/");
        return new Date(`20${ano}-${mes}-${dia}`); // yyyy-mm-dd
      };

      ordens_e_servicos.sort((a, b) =>
        parseData(b["Data de Solicitação"]).getTime() -
        parseData(a["Data de Solicitação"]).getTime()
      );

      reply.send(ordens_e_servicos);
    }
    else if (info.mensagem == 'pendente') {
      reply.send(ordens_e_servicos.filter(ordem => ordem.Estado === "Em Andamento"))
    }
    else if (info.mensagem == 'concluido') {
      reply.send(ordens_e_servicos.filter(ordem => ordem.Estado === "Concluido"))
    }
    else {
      console.log('não recebí nada, tente "{mensagem:concluido}", "mensagem:recente" ou "mensagem:pendente"');
    }
  }
}


//const app = express();

// Isso faz o servidor entender JSON
//app.use(express.json());

//app.get('/ordens_retrieve', (req, res) => {
  //const info = req.body;

  // Mostra no terminal o que recebeu 
  //console.log('Recebi:', info);

  
  
//});

// Liga o servidor na porta 3000
//app.listen(3000, () => {
  //console.log('http://localhost:3000');
//});

