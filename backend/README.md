Mural Virtual — Backend
API REST desenvolvida com NestJS para gerenciamento de um mural virtual de eventos, com sistema de autenticação JWT e validação de posts por administradores.

Tecnologias

NestJS — framework Node.js
Prisma — ORM para banco de dados
PostgreSQL — banco de dados relacional
JWT + Passport — autenticação
Docker — containerização


Estrutura do Projeto
src/
├── auth/
│   ├── decorators/
│   │   ├── current-user.decorator.ts
│   │   └── roles.decorator.ts
│   ├── dto/
│   │   ├── login.dto.ts
│   │   └── register.dto.ts
│   ├── guards/
│   │   ├── jwt.guard.ts
│   │   └── roles.guard.ts
│   ├── strategies/
│   │   └── jwt.strategy.ts
│   ├── types/
│   │   └── jwt-payload.type.ts
│   ├── auth.controller.ts
│   ├── auth.module.ts
│   └── auth.service.ts
├── posts/
│   ├── dto/
│   │   ├── create-post.dto.ts
│   │   ├── update-post.dto.ts
│   │   └── review-post.dto.ts
│   ├── posts.controller.ts
│   ├── posts.module.ts
│   └── posts.service.ts
├── users/
│   ├── dto/
│   │   └── update-user.dto.ts
│   ├── users.controller.ts
│   ├── users.module.ts
│   └── users.service.ts
├── prisma/
│   ├── prisma.module.ts
│   └── prisma.service.ts
├── app.module.ts
└── main.ts

Banco de Dados
Models
User
CampoTipoDescriçãoidIntIdentificador úniconameStringNome do usuárioemailStringEmail únicopasswordStringSenha com hash bcryptroleRoleUSER ou ADMINavatarString?URL do avatar (opcional)
Post
CampoTipoDescriçãoidIntIdentificador únicotitleStringTítulo do postcontentStringConteúdo do posteventTypeEventTypeTipo do eventostatusPostStatusStatus de validaçãorejectedReasonString?Motivo da rejeição (opcional)authorIdIntReferência ao usuário autor
Enums
Role       →  USER, ADMIN
EventType  →  ANNOUNCEMENT, EVENT, CELEBRATION
PostStatus →  PENDING, APPROVED, REJECTED

Variáveis de Ambiente
Crie um arquivo .env na raiz do projeto:
envDATABASE_URL=postgresql://usuario:senha@localhost:5432/mural_db
JWT_SECRET=sua_chave_secreta
JWT_EXPIRES_IN=7d
POSTGRES_USER=usuario
POSTGRES_PASSWORD=senha
POSTGRES_DB=mural_db

Rodando o Projeto
Com Docker
bashdocker compose up --build
A API estará disponível em http://localhost:3000.
Migrations
bash# Rodar migrations
docker compose exec backend npx prisma migrate dev

# Visualizar banco de dados
npx prisma studio

Endpoints
Auth
MétodoRotaDescriçãoAuthPOST/auth/registerRegistrar usuárioNãoPOST/auth/loginFazer loginNão
Posts
MétodoRotaDescriçãoAuthPOST/postsCriar postUSERGET/postsListar posts aprovadosUSER/ADMINGET/posts/mineListar meus postsUSERGET/posts/pendingListar posts pendentesADMINPATCH/posts/:idEditar postUSER (dono)DELETE/posts/:idDeletar postUSER (dono)PATCH/posts/:id/reviewAprovar ou rejeitar postADMIN
Users
MétodoRotaDescriçãoAuthPATCH/users/:idEditar perfilUSER (dono)DELETE/users/:idDeletar usuárioUSER (dono) / ADMIN

Regras de Negócio

Todo post criado começa com status PENDING
Posts editados voltam para status PENDING automaticamente
Apenas posts APPROVED aparecem na listagem principal
Ao rejeitar um post, o motivo da rejeição é obrigatório
Ao aprovar um post previamente rejeitado, o motivo é limpo automaticamente
Usuários só podem editar e deletar o próprio perfil
Admin pode deletar qualquer usuário
Ao deletar um usuário, todos os seus posts são deletados automaticamente


Autenticação
A API utiliza JWT Bearer Token. Após o login ou registro, utilize o access_token retornado no header de todas as requisições autenticadas:
Authorization: Bearer seu_token_aqui
