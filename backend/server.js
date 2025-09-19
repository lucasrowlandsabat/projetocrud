const express = require("express"); //IMPORTA O MÓDULO EXPRESSO PARA CONSTRUIR O SERVIDOR
const cors = require("cors"); //PERMITE QUE ACESSE ROTAS DIFERENTES(DOMÍNIOS)
const bodyParser = require("body-parser");// MIDDLEWARE QUE ANALISA OS DADOS DO CORPO DA PÁGINA DA REQUISIÇÃO(EX. DADOS QUE VEM DO FORMULARIOS)
const {v4:uuid} = require("uuid");//FUNÇÃO RESPONSAVEL POR GERAR OS CÓDIGOS ÚNICOS
const path = require("path"); // CAMINHO DOS DADOS DO SEU PROJETO
const fs = require("fs"); //MANIPULA OS ARQUIVOS DO JSON

const app = express(); // INSTANCIANDO O EXPRESS
const port = 5001; //DEFINE A PORTA DO SERVIDOR
app.use(cors()); //HABILITA O CORS PARA ACEITAR AS REQUISIÇÕES 
app.use(bodyParser.json()); //USANDO O BODY-PARSER PARA RECEBER AS REQUISIÇÕES E CONVERTER PARA JSON NO CORPO DA PÁGINA

// LOCAL AONDE ESTA O ARQUIVO DO SEU BANCO DE DADOS
const caminho = path.join(__dirname,"produtos.json");

// FUNÇÃO PARA LER OS DADOS DO ARQUIVO JSON
const lerProdutos =()=>{
    try{
        const data = fs.readFileSync(caminho, "utf-8")
        return JSON.parse(data);
    }catch(error){
        console.error("Erro ao ler o arquivos produtos.json",error)
        return [];

    }
}

// FUNÇÃO PARA GRAVAR OS DADOS NO ARQUIVO JSON
const salvarProdutos =(data)=>{
    try{
        fs.writeFileSync(caminho, JSON.stringify(data,null,2),"utf-8")
    }catch(error){
        console.error("Erro ao salvaf dados no arquivo",error)
    }
}

// VARIAVEL QUE RECEBE OS DADOS DO ARQUIVO 
let produtos =lerProdutos();



// CRIANDO A ROTA CADASTRAR PRODUTO (post)
app.post("/produto",(req,res)=>{
    //DESTRUCT- REQUISIÇÃO DAS VARIAVEIS QUE SERÃO MANIPULADAS NO CORPO DA PÁGINA
    const {nome, descricao} = req.body 
    // VALIDANDO OS CAMPOS DAS VARIAVEIS
    if(!nome || !descricao){
        res.status(400).json({error: "Campos inválidos"});
    }
    // REALIZA O NOVO CADASTRO DO PRODUTO COM ID, NOME E DESCRICAO
    const novoItem ={id:uuid(),nome, descricao}
    // PEGA O QUE FOI CADASTRADO E ADICIONA NO ARRAY PRODUTOS
    produtos.push(novoItem);
    // SALVA OS DADOS NO ARQUIVO JSON
    salvarProdutos(produtos)
    // RETORNA A MENSAGEM DE SUCESSO
    res.status(201).json({message: "Cadastro efetuado com sucesso"})
})

// CRIANDO A ROTA CONSULTAR PRODUTOS (get)
app.get("/produto",(req,res)=>{
    res.json(produtos);
});

// CRIANDO A ROTA PARA CONSULTA PERSONALIZADA (get)

app.get("/produto/search",(req,res)=>{
    // //OBTÉM O PARAMETRO DE PESQUISA NA URL
    const { pesquisa } = req.query;
    // VALIDANDO PESQUISA
    if(!pesquisa){
        return res.status(400).json({error:"Pesquisa não encontrada"})
    }
    // CONVERT O TERMO DE PESQUISA PARA MINUSCULAS
    const termoPesquisa = pesquisa.toLowerCase();
    // FILTRA OS PRODUTOS QUE CONTEM O TERMO DE PESQUISA NO NOME OU DESCRICAO
    const resultado = produtos.filter(item =>item.nome.toLowerCase().includes(termoPesquisa) || item.descricao.toLowerCase().includes(termoPesquisa)
    );
    res.json(resultado)
})




// CRIANDO A ROTA ALTERAR PRODUTOS (put)
app.put("/produto/:id", (req,res)=>{
    const produtoId = req.params.id; //OBTÉM O ID DO PRODUTO NA URL
    const {nome,descricao} = req.body; // VARIAVEIS QUE SERÃO MANIPULADAS NA REQUISIÇÃO
    // VALIDAÇÃO DOS CAMPOS
    if(!nome || !descricao){
        res.status(400).json({error:"Campos inválidos"})
    }
    // VERIFICA SE O PRODUTO FOI ALTERADO
    const produtoIndex = produtos.findIndex(item =>item.id === produtoId);

    // VERIFICA SE O PRODUTO FOI ALTERADO COMPARANDO
    if(produtoIndex === -1){
        return res.status(404).json({error:"Produto não encontrado"});
    }
    // CONFIRMA A ALTERAÇÃO DO PRODUTO
    produtos[produtoIndex]={id:produtoId,nome,descricao};
    // RETORNA NO ARRAY COM A ALTERAÇÃO FEITA
    // SALVA AS ALTERAÇÃOES NO ARQUIVO JSON
    salvarProdutos(produtos)
    res.json(produtos[produtoIndex])
})


// CRIANDO A ROTA EXCLUIR PRODUTOS (delete)

app.delete("/produto/:id", (req,res)=>{
    const produtoId = req.params.id;  //OBTÉM O ID DO PRODUTO NA URL

    // ARMAZENA O TAMANHO INICIAL DO ARRAY DE PRODUTOS
    const inicioProduto =produtos.length;

    // FILTRA O ARRAY, REMOVENDO O PRODUTO COM O ID ESCOLHIDO
    produtos = produtos.filter(item =>item.id !== produtoId);

    // VERIFICA SE O PRODUTO FOI REMOVIDO
    if(produtos.length == inicioProduto){
        return res.status(404).json({error:"Produto não encontrado"})
    }
    // SALVA AS ALTERAÇÕES DE DELETAR NO ARQUIVO JSON
    salvarProdutos(produtos)
    // MENSAGEM QUE CONFIRMA QUE O PRODUTO FOI REMOVIDO
    res.status(201).send("Produto removido com sucesso")
})


// EXECUTANDO A ESCUTA DO SERVIDOR
app.listen(port, ()=>{
    console.log(`Servidor rodando na porta http://localhost:${port}`);
})
