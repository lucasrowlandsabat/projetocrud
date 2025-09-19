import { useState, useEffect } from "react";
import axios from "axios";

const Produto = () => {
  // DECLARANDO A URL DA API QUE SERÁ CONSUMIDA
  const API_URL = "http://localhost:5001/produto";

  // HOOK- MANIPULA O ESTADO DA VARIÁVEL
  const [produto, setProduto] = useState([]);
  const [novoProduto, setNovoProduto] = useState({ nome: "", descricao: "" });
  const [editar, setEditar] = useState(false);
  const [pesquisar,setPesquisar]= useState("");

  // CADASTRAR PRODUTO (POST)
  //função assincrona para cadastrar um novo produto,
  const cadastrarProduto = async() => {
    // validar campos
    if (!novoProduto.nome || !novoProduto.descricao) {
      alert("Campos Obrigatórios");
      return;
    }
    // TRATAMENTO DE ERROS
    try {
      // envia os dados do novoProduto para api usando uma requisição POST
      const response = await axios.post(API_URL, novoProduto);
      // se a requisição for bem-sucedida, atualiza o estado do produto
      setProduto([...produto, response.data]);
      // limpa os campos do formulario redefinindo o estado novoProduto
      setNovoProduto({ nome: "", descricao: "" });
      // define o estado editar como false indicando que a botão editar não esta ativo
      setEditar(false);
    } catch (error) {
      console.log("erro ao cadatrar o protudo", error);
    }
  };

  // CONSULTANDO PRODUTOS (GET)

  const consultarProdutos = async()=> {
    try {
      //VERIFICA SE TROUXER UMA PESQUISA ESPECIFICA SENÃO DEVOLVE A LISTA COM TODOS 
      const url = pesquisar ? `${API_URL}/search?pesquisa=${pesquisar}`: API_URL;
      const response = await axios.get(url);
      setProduto(response.data);

    } catch (error) {
      console.log("error ao consultar produto", error);
    }
  };

  // HOOK - useEffect - efeito apra carregar a lista de todos os produtos cadastrados

  useEffect(()=>{
    const timer=setTimeout(()=>{
       consultarProdutos();
    },300) //resposta em 3 segundos
    return ()=> clearTimeout(timer)
  },[pesquisar]);

  // ALTERANDO PRODUTOS (PUT)

  const alterarProduto = async () => {
    if (!novoProduto.nome || !novoProduto.descricao) {
      alert("Campos obrigatórios");
      return;
    }
    // TRATAMENTO DE ERROS
    try {
      // Envia uma requisição PUT para api , a url adiciona o ID do produto a ser alterado
      //o objeto novoProduto contem os dado atualizados para requisição
      const response = await axios.put(`${API_URL}/${novoProduto.id}`,novoProduto
      );
      // se a requisição for bem sucedidaa , atualizao estado do produto
      //mapeia a lista de produtos,substituindo o item com o id correspondente pelos dados retornos pela apli(response.data)
      setProduto(
        produto.map((produto) =>
          produto.id === novoProduto.id ? response.data : produto
        )
      );
      // limpa os campos do formulario
      setNovoProduto({ nome: "", descricao: "" });
      // define o estado do editar como false indicando que a edição foi concluida
      setEditar(false);
    } catch (error) {
      console.log("erro ao alterar produto", error);
    }
  };

  // DELETAR PRODUTO (DELETE)
  const deletarProduto = async (id) => {
    if (window.confirm("Tem certeza que deseja deletar este produto"))
      try {
        // envia uma requisição delete para a api usando o id do produto na url
        await axios.delete(`${API_URL}/${id}`);
        // filtra a lista de produto removendo o produto que possui o id correspondente
        setProduto(produto.filter((produto)=>produto.id !== id));
      } catch (error) {
        console.log("Erro ao deletar produto", error);
      }
    else {
      console.log("Exlusão de produto cancelada");
    }
  };
  // MÉTODO ALTERAR
  const handleAterar=(produto)=> {
    setNovoProduto(produto);
    setEditar(true);
  };

  // METODO SUBMIT QUE VAI ATUALIZAR O BOTÃO NO FORMULARIO

  const handleSubimit = () => {
    if (editar) {
      alterarProduto();
    } else {
      cadastrarProduto();
    }
  };

  return (
    <div className="mx-auto p-4">
      <h1 className="text-2xl font-bold mb-8 text-center">Cadastro de Produto</h1>
      <form className="mb-8">
        <div>
          <input
            type="text"
            placeholder="Pesquisar Produtos..."
            value={pesquisar}
            onChange={(e)=>setPesquisar(e.target.value)}
            className="w-[300px] pl-4 pr-4 py-2 border border-gray-500 rounded-full"
          />
        </div>
        <div className="mb-4">
          <label className="block text-xl font-medium text-gray-700">Nome do Produto</label>
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
            className="mt-4 rounded border w-[400px]"
          />
        </div>
        <div>
          <label className="block text-xl font-medium text-gray-700">Descrição do Produto</label>
          <input
            type="text"
            id="descricao"
            placeholder="Digite a descrição do produto"
            value={novoProduto.descricao}
            onChange={(e) =>
              setNovoProduto({ ...novoProduto, descricao: e.target.value })
            }
            className="mt-4 rounded border w-[400px]"
          />
        </div>

        <button onClick={handleSubimit}
          className="bg-blue-600 hover:bg-blue-800 text-white font-bold py-2 px-4 mt-4 rounded"
        >
          {editar ? "Alterar" : "Cadastrar"}
        </button>
      </form>
      <ul>
        {produto.map(produto => (
          <li key={produto.id} className="border p-4 mb-4 rounded flex items-center justify-between">
            <div>
              <strong>{produto.nome}</strong>{produto.descricao}
            </div>
            <div>
              <button onClick={()=>handleAterar(produto)}
              className="bg-amber-300 hover:bg-amber-500 text-black font-bold py-4 px-4 rounded mr-4"
                >Editar
                </button>
              <button onClick={()=>deletarProduto(produto.id)}
                className="bg-red-300 hover:bg-red-500 text-black font-bold py-4 px-4 rounded mr-4"
                >Deletar</button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Produto;
