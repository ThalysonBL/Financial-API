const express = require('express')
const { v4: uuidv4 } = require("uuid") //v4 gera números randomicos de ID//renomeou a função para uuidv4

const app = express() //post para criar
//const id = uuidv4() //instânciei a uuidv4

app.use(express.json()) //usado para requisitar informações json do insomnia

const customers = []; //array de dados


  //MIDDLEWARE 
  function verifyIfExistsAccountCPF(request, response, next){ //3 params para usar o Middleware
    const {cpf} = request.headers; //Vou receber no HEADERS

    const customer = customers.find((customer) => customer.cpf === cpf); 
    //Verifica o CPF e retorna o CPF // O find() retorna o dado
      // o ! == NÃO
      if(!customer){
        return response.status(400).json({error: "Customer not found"})
      }
      request.customer = customer;
      return next();
  }

  app.post("/account", verifyIfExistsAccountCPF, (request, response) =>{
    const {cpf, name} = request.body;

//teste uma função para saber se é verdadeiro ou falso
    const customerAlreadyExists = customers.some((customer) => customer.cpf ==  cpf );

      if(customerAlreadyExists){
        return response.status(400).json({error: "Customer Already exists"})
      }

    customers.push({ //método --- push --- insere dados dentro de um array
      cpf,
      name,
      id: uuidv4(),
      statement: [],
    });
    
    return response.status(201).send();
  })
  //app.use(verifyIfExistsAccountCPF) //Tudo que estiviver abaixo deste elemento passará pelo MIDDLEWARE


  //Conferir extrato bancário
  app.get("/statement", verifyIfExistsAccountCPF, (request, response) => {  //:cpf é um ROUTE PARAMS
   const { customer} = request;
    return response.json(customer.statement);
  }); 

  //DEPOSITO
  app.post("/deposit",verifyIfExistsAccountCPF, (request, response) =>{
    const {description, amount} = request.body;
    const {customer} = request;

    const statementOperation = {
      description,
      amount,
      created_at: new Date(),
      type: "Credit"
    }
    customer.statement.push(statementOperation)
    return response.status(201).send();

  })


app.listen(3333)


//INSTALE A BIBLI ---- uuid ---