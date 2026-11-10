# Muralix

O **Muralix** é uma aplicação web Full Stack para divulgação e gerenciamento de eventos através de um mural virtual.

Os usuários podem cadastrar eventos, que passam por um processo de moderação antes de serem disponibilizados publicamente. Além disso, a aplicação conta com uma **busca inteligente integrada a um LLM (Large Language Model)**, permitindo que os usuários encontrem eventos relevantes por meio de consultas em linguagem natural.

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

O Muralix funciona como um mural virtual para publicação e descoberta de eventos.

A aplicação possui dois tipos de usuário:

* **USER:** pode criar e gerenciar seus próprios eventos.
* **ADMIN:** analisa os eventos enviados e decide se serão aprovados ou rejeitados.

Somente eventos aprovados são exibidos no mural público.

Além da navegação tradicional, o Muralix oferece uma experiência de busca inteligente utilizando inteligência artificial, permitindo localizar eventos de acordo com a intenção e o contexto da pesquisa.

## Funcionalidades

* Cadastro e autenticação de usuários
* Verificação de e-mail
* Recuperação e redefinição de senha
* Criação, edição e exclusão de eventos
* Moderação de eventos por administradores
* Visualização do status das publicações
* Exibição do motivo de rejeição
* Reenvio de eventos rejeitados para nova análise
* Busca inteligente de eventos utilizando LLM
* Interpretação de consultas em linguagem natural
* Identificação e filtragem de eventos relevantes conforme a pesquisa
* Exibição de respostas contextualizadas com os resultados encontrados
* Proteção contra requisições automatizadas com Cloudflare Turnstile

## Busca inteligente com IA

O Muralix utiliza um **LLM (Large Language Model)** para proporcionar uma experiência de busca mais intuitiva.

Diferentemente de uma busca tradicional baseada exclusivamente em palavras-chave, o usuário pode pesquisar eventos utilizando linguagem natural, descrevendo o que procura.

A integração com o modelo de linguagem permite:

* Interpretar a intenção da pesquisa.
* Identificar eventos relacionados à consulta.
* Filtrar publicações relevantes.
* Apresentar uma resposta contextualizada juntamente com os eventos encontrados.

O objetivo é facilitar a descoberta de eventos e tornar a navegação pelo mural mais eficiente.

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

### Inteligência Artificial

* LLM (Large Language Model)
* Integração com modelo de linguagem para interpretação de consultas e busca inteligente de eventos

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