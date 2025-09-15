import{ useState, useEffect} from "react"
import axios from 'axios'

const Produto = () => {

// DECLARANDO A URL DA API QUE SERÁ CONSUMIDA
const API_URL ="http://localhost:5001/produto";

// HOOK- MANIPULA O ESTADO DA VARIÁVEL
const [produto,setProduto]=useState([]);
const [novoProduto,setNovoProduto]=useState({nome:"",descricao:""});
const [editar,setEditar]=useState(false);

// CADASTRAR PRODUTO (POST)
//função assincrona para cadastrar um novo produto, 
const cadastrarProduto =async ()=>{
    // validar campos
    if(!novoProduto.nome || !novoProduto.descricao){
        alert("Campos Obrigatórios")
        return;
    }
    // TRATAMENTO DE ERROS
    try{
        // envia os dados do novoProduto para api usando uma requisição POST
        const response = await axios.post(API_URL,novoProduto);
        // se a requisição for bem-sucedida, atualiza o estado do produto
        setProduto([...produto, response.data]);
        // limpa os campos do formulario redefinindo o estado novoProduto
        setNovoProduto({nome:"", descricao:""})
        // define o estado editar como false indicando que a botão editar não esta ativo
        setEditar(false);
    }catch(error){
        console.log("erro ao cadatrar o protudo",error)
    }
}

// CONSULTANDO PRODUTOS (GET)

const consultarProdutos =async()=>{
    try{
        const response = await axios.get(API_URL);
        setProduto(response.data)

    }catch(error){
        console.log("error ao consultar produto", error)
    }
}

// HOOK - useEffect - efeito apra carregar a lista de todos os produtos cadastrados

useEffect(()=>{
    consultarProdutos();
})

// ALTERANDO PRODUTOS (PUT)

const alterarProduto =async()=>{
    if(!novoProduto.nome || novoProduto.descricao){
        alert("Campos obrigatórios")
        return;
    }
    // TRATAMENTO DE ERROS
    try{
        // Envia uma requisição PUT para api , a url adiciona o ID do produto a ser alterado
        //o objeto novoProduto contem os dado atualizados para requisição
        const response = await axios.put(`${API_URL}/${novoProduto.id}`,novoProduto);
        //se a requisição for bem-sucedida, atualizacao estado do produto
        //mapeia a lista de produtos,substituindo o item com o id correspondente pelos dados retornos pela apli(response.data)
        setProduto(produto.map(produto =>produto.id === novoProduto.id ? response.data: produto))
        setNovoProduto({nome:"",descricao:""})
        //define o estado do editar como false indicando que a edição foi concluida
        setEditar(false)

    }catch(error){
        console.log("erro ao alterar produto",error)
    }
}

// DELETAR PRODUTO (DELETE)
const deletarProduto  =async(id)=>{
    if(window.confirm("Tem certeza que deseja deletar este produto"))
        try{
    // envia uma requisição delete para a api usando o id do produto na url
        await axios.delete(`${API_URL}/${id}`)
    // filtra a lista de produto removendo o produto que possui o id correspondente
        setProduto(produto.filter((produto)=> produto.id !== id));
    }catch(error){
        console.log("Erro ao deletar produto",error)
    }
    else{
        console.log("Exlusão de produto cancelada")
    }
}
// METODO ALTERAR
const handleAlterar= (produto)=>{
    setNovoProduto(produto);
    setEditar(true)
}

// METODO SUBMIT QUE VAI ATUALIZAR O BOTÃO NO FORMULARIO

const handleSubmit=()=>{
    if(editar){
        alterarProduto();
    }else{
        cadastrarProduto();
    }
}


  return (
    <div>
      <h1>Cadastro de Produto</h1>
      <form>
        <div>
          <label>Nome do Produto</label>
          <input
            type="text"
            id="nome"
            placeholder="Digite o nome do Produto"
            value={novoProduto.nome}
            // onchange é um evento que escuta cada entrada (input) , e o (e) é objeto
            //de evento que contem as informações vão ser alteradas
            //setProduto(...) - é a função de atualização do estado,
            //o spread(...) copia todos as propriedades e valor do estado atual para novo
            //objeto e o target.value - sobreescreve com um novo valor.
            onChange={(e) =>
              setNovoProduto({ ...novoProduto, nome: e.target.value })
            }
          />
        </div>
        <div>
          <label>Descrição do Produto</label>
          <input
            type="text"
            id="descricao"
            placeholder="Digite a descrição do produto"
            value={novoProduto.descricao}
            onChange={(e) =>
              setNovoProduto({ ...novoProduto, descricao: e.target.value })
            }
          />
        </div>

        <button onClick={handleSubmit}>
          {editar ? "Alterar" : "Cadastrar"}
        </button>
      </form>
      <ul>
        {produto.map(produto => (
          <li key={produto.id}>
            <div>
              <strong>{produto.nome}</strong>{produto.descricao}
            </div>
            <div>
              <button onClick={()=>handleAlterar(produto)}>Editar</button>
              <button onClick={()=>deletarProduto(produto.id)}>Deletar</button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Produto;
