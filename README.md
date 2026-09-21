# Muralix

O **Muralix** é uma aplicação web Full Stack para divulgação e gerenciamento de eventos através de um mural virtual.

Os usuários podem cadastrar eventos, que passam por um processo de moderação antes de serem disponibilizados publicamente.

## Como usar

Acesse a aplicação:

**https://muralix.com.br**

### Acesso de demonstração — Administrador

```text
E-mail: admin@muralix.com.br
Senha: Admin@Mural12
```

### Cadastro de usuário

Para criar uma nova conta, utilize o código de cadastro:

```text
mural-eventos-2026
```

Após o cadastro, é necessário verificar o endereço de e-mail para acessar a conta.

> **Observação:** o backend está hospedado no plano gratuito do Render e pode entrar em modo de inatividade após um período sem uso. Por isso, o primeiro acesso pode levar alguns segundos enquanto o serviço é iniciado.

## O que é

O Muralix funciona como um mural virtual para publicação de eventos.

A aplicação possui dois tipos de usuário:

* **USER:** pode criar e gerenciar seus próprios eventos.
* **ADMIN:** analisa os eventos enviados e decide se serão aprovados ou rejeitados.

Somente eventos aprovados são exibidos no mural público.

## Funcionalidades

* Cadastro e autenticação de usuários
* Verificação de e-mail
* Recuperação e redefinição de senha
* Criação, edição e exclusão de eventos
* Moderação de eventos por administradores
* Visualização do status das publicações
* Exibição do motivo de rejeição
* Reenvio de eventos rejeitados para nova análise
* Proteção contra requisições automatizadas com Cloudflare Turnstile

## Regras de negócio

Todo evento criado por um usuário recebe inicialmente o status **PENDING** e precisa ser analisado por um administrador.

O administrador pode:

* **Aprovar:** o evento passa a ser exibido no mural público.
* **Rejeitar:** o evento não é publicado e o administrador informa o motivo da rejeição.

Eventos rejeitados continuam disponíveis para o autor, que pode editá-los e enviá-los novamente para análise.

Usuários podem editar ou excluir apenas os próprios eventos.

Eventos encerrados deixam de ser exibidos entre os eventos atuais do mural.

## Tecnologias utilizadas

### Frontend

* React
* TypeScript
* Vite
* Tailwind CSS

### Backend

* NestJS
* TypeScript
* Prisma ORM
* JWT

### Banco de dados

* PostgreSQL

### Outros

* Docker
* Resend
* Cloudflare Turnstile

## Hospedagem

A aplicação utiliza serviços diferentes para cada parte da infraestrutura:

* **Frontend:** Cloudflare Workers com Static Assets
* **Backend:** Render
* **Banco de dados:** PostgreSQL gerenciado pelo Render
* **DNS:** Cloudflare

O frontend se comunica com a API através do domínio:

```text
https://api.muralix.com.br
```
