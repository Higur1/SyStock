# Documentação da API


## Endpoints
### POST /auth
Esse endpoint é responsável por realizar a autenticação do usuario no sistema.
#### Parametros
user_login: Nome do usuário cadastrado no sistema.

user_password: Senha do usuário cadastrado, com o determinado user_login.

Exemplo de requisição:
```
{
	"user_login": "teste",
	"user_password": "teste"
}
```
#### Respostas
##### Ok! 200
Caso essa resposta aconteça você vai receber o token JWT de autenticação para acesso as demais rotas da API.

Exemplo de resposta: 
```
{
	"token": "eyJhbGciOiJIUzI6W1ha1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NCwiZW1haWwiOiJ0ZXN0ZSIsImlhdCI6MTY4OTI5MzQ3NiwiZXhwIjoxNjg5NDY2Mjc2fQ.Idv2KZox4TSZc77fcy-s9-VQMdKqtTJJ_9D-HEocvCQ"
}
```
##### Not Found! 404
Caso essa resposta aconteça, significa que houve um erro na autenticação do usuario.

Motivos: usuario não cadastrado.

Exemplo de resposta:
```
{
	message: "Not Found"
}
```
##### Unauthorized! 401
Caso essa resposta aconteça, significa que houve um erro na autenticação do usuario.

Motivos: senha incorreta.

Exemplo de resposta:
```
{
	"message": "Unauthorized"
}
```
##### Erro interno do servidor! 500
Caso essa resposta aconteça, isso significa que houve um erro na conversa com o servidor.

Motivos: problemas de arquivo, sistema fora do ar, problema com banco de dados.

Exemplo de resposta:
```
{
	message: "An error has occurred"
}
```
### POST /user
Esse endpoint é responsável por cadastrar um usuário no sistema.
#### Parâmetros
name: Nome do usuário

user_login: Login escolhido pelo usuario para autenticação

user_password: Senha do usuário

email: E-mail do usuário

user_type_id: Tipo de usuário do sistema (Administrador ou Funcionário)

Exemplo de requisição:
```
{
	"name": "teste",
	"user_login": "teste",
	"user_password": "teste",
	"email": "teste",
	"user_type_id": 1
}
```
#### Repostas
##### Created! 201
Caso essa resposta aconteça o usuário foi criado com sucesso.

Exemplo de resposta:
```
{
	"user": {
		"id": 1,
		"user_login": "teste",
		"email": "teste",
		"type": 1
	}
}
```
##### Conflited! 409
Caso essa resposta aconteça, significa que houve conflito na criação do usuário.

Motivos: E-mail ou user_login já cadastrado no sistema.

Exemplo de resposta:
```
{
  message:"an operation could not be performed email or login already exists"
}  
```
##### Internal Server Error! 500 
Caso essa resposta aconteça, isso significa que houve um erro na conversa com o servidor.

Motivos: problemas de arquivo, sistema fora do ar, problema com banco de dados.

Exemplo de resposta:
```
{
	message: "An error has occurred"
}
```
### GET /users
Esse endpoint é responsável por retornar os usuários cadastrados no sistema. 
#### Parâmetros
Sem parâmetros
#### Repostas
##### Ok! 200
Caso essa resposta aconteça, você irá receber uma lista dos usuarios cadastrados no sistema.

Exemplo de resposta:
```
[
	{
		"id": 1,
		"name": "Teste",
		"email": "Teste@gmail.com",
		"user_type_id": 1
	},
	{
		"id": 2,
		"name": "Teste1",
		"email": "Teste1@gmail.com",
		"user_type_id": 2
	}
]
```
##### No content! 204

Caso essa resposta aconteça, significa que a lista de usuarios está vazia.

Motivo: nenhum usuario cadastrado no sistema.

Exemplo de resposta:
```
{
	"message": "Empty"
}
```
##### Internal Server Error! 500 
Caso essa resposta aconteça, isso significa que houve um erro na conversa com o servidor.

Motivos: problemas de arquivo, sistema fora do ar, problema com banco de dados.

Exemplo de resposta:
```
{
	message: "An error has occurred"
}
```
### GET /user/name/:name
Esse endpoint é responsável por retornar todos os usuário a partir de uma busca
#### Parâmetros
name: Nome do usuário.
#### Respostas
##### Ok! 200
Caso essa resposta aconteça será retornado o usuário.

Exemplo de resposta:

```
[
	{
		"id": 5,
		"name": "testee",
		"email": "testee",
		"user_type_id": 1
	}
]
```
##### Not Found! 404
Caso essa resposta aconteça, significa que não foi encontrado nenhum usuário.

Motivo: Nenhum usuário começa com os caracteres solicitados.

Exemplo de resposta:
```
{
  message: "Not Found"
}
```
##### Internal Server Error! 500 
Caso essa resposta aconteça, isso significa que houve um erro na conversa com o servidor.

Motivos: problemas de arquivo, sistema fora do ar, problema com banco de dados.

Exemplo de resposta:
```
{
	message: "An error has occurred"
}
```
### GET /user/:id
Esse endpoint é responsável por retornar um usuário pelo id
#### Parâmetros
id: id do usuário.
#### Respostas
##### Ok! 200
Caso essa resposta aconteça, você irá receber informações sobrre o usuário

Exemplo de resposta:
```
{
	"id": 3,
	"name": "Teste",
	"email": "Teste@gmail.com",
	"user_type_id": 2
}
```
##### Not Found! 404
Caso essa resposta aconteça, o usuário não foi encontrado.

Motivo: o id não existe no sistema.

Exemplo de resposta:
```
{
	"message": "Not found"
}
```
##### Internal Server Error! 500 
Caso essa resposta aconteça, isso significa que houve um erro na conversa com o servidor.

Motivos: problemas de arquivo, sistema fora do ar, problema com banco de dados.

Exemplo de resposta:
```
{
	message: "An error has occurred"
}
```
### GET /users/:type_id
Esse endpoint é responsável por retornar os usuários do mesmo tipo, exemplo administrador ou funcionário.
#### Parâmetros
type_id: id do tipo de usuario buscado.
#### Respostas
##### Ok! 200
Caso essa resposta aconteça será retornado uma lista de todos os usuários pertencentes ao mesmo tipo de usuário.

Exemplo de resposta:
```
[
	{
		"id": 2,
		"name": "Teste",
		"email": "Teste@gmail.com",
		"user_type_id": 1
	},
	{
		"id": 4,
		"name": "Teste1",
		"email": "Teste2@gmail.com",
		"user_type_id": 1
	},
	{
		"id": 5,
		"name": "Teste2",
		"email": "Teste3@gmail.com",
		"user_type_id": 1
	}
]
```
##### No Content! 204
Caso essa resposta aconteça, significa que a lista de usuários está vazia.

Motivo: id do tipo de usuário não possui usuários cadastrados.

Exemplo de resposta:
```
{
  message: "Empty"
}
```
##### Internal Server Error! 500 
Caso essa resposta aconteça, isso significa que houve um erro na conversa com o servidor.

Motivos: problemas de arquivo, sistema fora do ar, problema com banco de dados.

Exemplo de resposta:
```
{
	message: "An error has occurred"
}
```
### UPDATE /user
Esse endpoint é responsável por atualizar informações de um usuário.
#### Parâmetros
id: id do usuário.
name: (String) nome do usuário.
user_type_id: (number) tipo do usuário.
#### Respostas
##### Ok!
Caso essa resposta aconteça, significa que o usuário foi atualizado com sucesso.

Exemplo de resposta:
```
{
	"message": "Success"
}
```
##### Not Found! 404
Caso essa resposta aconteça, significa que houve um problema durante a busca do usuário.

Motivo: Usuário não cadastrado, id inválido, usuário já cadastrado no sistema.

Exemplo de resposta:
```
{
	"message": "Not found"
}
```
##### Internal Server Error! 500 
Caso essa resposta aconteça, isso significa que houve um erro na conversa com o servidor.

Motivos: problemas de arquivo, sistema fora do ar, problema com banco de dados.

Exemplo de resposta:
```
{
	message: "An error has occurred"
}
```
### DELETE /user
Esse endpoint é responsável por excluir um usuário do sistema.
#### Parâmetros
id: id do usuário a ser excluído.
#### Respostas
##### Ok! 200
Caso essa resposta aconteça, o usuário foi excluido do sistema.

Exemplo de resposta:
```
{
	"message": "Success"
}
```
##### Not Found! 404
Caso essa resposta aconteça, significa que houve um problema durante a busca do usuário.

Motivo: Usuário não cadastrado, id inválido.

Exemplo de resposta:
```
{
	"message": "Not found"
}
```
##### Internal Server Error! 500 
Caso essa resposta aconteça, isso significa que houve um erro na conversa com o servidor.

Motivos: problemas de arquivo, sistema fora do ar, problema com banco de dados.

Exemplo de resposta:
```
{
	message: "An error has occurred"
}
```
