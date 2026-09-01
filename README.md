# CHAT BOT PROCON

<p align="left">
  Sistema inteligente de interação com o usuário com orientações e serviços prestados pelo órgão PROCON  
</p>

# VISÃO DO PROJETO

O **Chatbot PROCON** é uma solução de orientação ao consumidor integrada ao WhatsApp, desenvolvida para esclarecer dúvidas, conduzir o cidadão por fluxos decisórios baseados nas diretrizes do PROCON 
e apresentar orientações iniciais sobre seus direitos e próximos passos.
Quando a dúvida não puder ser solucionada pelo chatbot, o sistema deverá possibilitar o encaminhamento para atendimento presencial, incluindo o agendamento e a orientação sobre os documentos necessários.

O sistema é composto por:

- API integrada com WhatsApp
- chatbot 
- Aplicação para agendamentos 
- Módulo de Inteligência Artificial para análise dos casos apresentados
  

![Status](https://img.shields.io/badge/Status-Em_Desenvolvimento-yellow?style=for-the-badge)
![Sprint](https://img.shields.io/badge/Sprint-1-blue?style=for-the-badge)
![FATEC](https://img.shields.io/badge/FATEC-6º_DSM-red?style=for-the-badge)
![Version](https://img.shields.io/badge/Version-0.0.1-purple?style=for-the-badge)

---

### Ferramentas
<p>
  <img src="https://skillicons.dev/icons?i=git,github,vscode,docker" />
</p>

---
# REQUISITOS DO PROJETO

## Requisitos funcionais

| ID   | Requisito                         | Descrição                                                                                                                                         |
|------|-----------------------------------|---------------------------------------------------------------------------------------------------------------------------------------------------|
| RF01 | Atendimento via WhatsApp          | Permitir que o consumidor inicie e realize o atendimento exclusivamente por meio do WhatsApp.                                                     |
| RF02 | Identificação e sessão            | Identificar o consumidor e manter o contexto da sessão durante o atendimento.                                                                     |
| RF03 | Menus e categorias de atendimento | Apresentar menus e categorias de problemas para direcionar o consumidor ao atendimento adequado.                                                  |
| RF04 | Fluxos decisórios                 | Conduzir o consumidor por perguntas e alternativas sequenciais de acordo com os fluxos fornecidos pelo PROCON.                                    |
| RF05 | Orientação ao consumidor          | Apresentar uma orientação consolidada e os próximos passos recomendados ao final do fluxo.                                                        |
| RF06 | Registro das interações           | Registrar as mensagens, respostas e etapas realizadas durante o atendimento.                                                                      |
| RF07 | Encaminhamento presencial         | Identificar quando a orientação não solucionou o problema e oferecer encaminhamento para atendimento presencial.                                  |
| RF08 | Agendamento via WhatsApp          | Permitir que o consumidor consulte horários disponíveis e realize o agendamento diretamente pelo WhatsApp.                                        |
| RF09 | Documentos necessários            | Informar os documentos recomendados para o atendimento presencial de acordo com o caso apresentado.                                               |
| RF10 | Gestão de atendimentos	           | Permitir que os funcionários do PROCON consultem os atendimentos presenciais sob sua responsabilidade.                                            |
| RF11 | Contexto da conversa	             | Permitir que o funcionário visualize o histórico e o contexto do atendimento realizado pelo chatbot antes do atendimento presencial.              |
| RF12 | Lembretes de atendimento	         | Enviar lembretes ao consumidor quando a data do atendimento presencial estiver próxima.                                                           |
| RF13 | Base de conhecimento	             | Utilizar informações e documentos oficiais fornecidos pelo PROCON como fonte para as respostas e orientações do chatbot.                          |
| RF14 | Casos fora do escopo	             | Identificar e informar quando o problema apresentado não estiver dentro do escopo de atuação do PROCON.                                           |
| RF15 | Aprendizado contínuo	             | Registrar e analisar atendimentos para identificar novos casos e oportunidades de aprimoramento da base de conhecimento.                          |  
| RF16 | Validação de conhecimento         | Garantir que novos conhecimentos identificados durante os atendimentos sejam validados antes de serem incorporados à base utilizada pelo chatbot. |

## Requisitos não funcionais

| ID    | Requisito             | Descrição                                                                                                                          |
|-------|-----------------------|------------------------------------------------------------------------------------------------------------------------------------|
| RNF01	| Usabilidade	          | As mensagens enviadas pelo chatbot devem utilizar linguagem clara, objetiva e compreensível.                                       |
| RNF02	| Desempenho            | O sistema deve apresentar tempo de resposta adequado durante as conversas e operações de agendamento.                              |
| RNF03	| Segurança e LGPD      | Os dados dos consumidores e funcionários devem ser tratados de acordo com as práticas de segurança e com a LGPD.                   |
| RNF04	| Caráter orientativo	  | O chatbot deve informar claramente que suas respostas possuem caráter orientativo e não substituem o atendimento formal do PROCON. |
| RNF05	| Transparência da IA	  | O consumidor deve ser informado quando houver utilização de recursos de IA ou modelos de linguagem na elaboração de uma resposta.  |
| RNF06	| Containerização	      | O sistema deve poder ser executado utilizando Docker.                                                                              |
| RNF07	| Documentação          | O projeto deve possuir documentação sobre instalação, configuração, arquitetura e utilização.                                      |
| RNF08	| Qualidade de software	| O projeto deve utilizar versionamento, testes, revisão de código e integração contínua.                                            |
| RNF09	| Disponibilidade	      | Os serviços responsáveis pelo atendimento devem possuir disponibilidade adequada para permitir o funcionamento das conversas.      |

## Restrições do projeto

| ID   | Requisito                     | Descrição                                                                                                                        |
|------|-------------------------------|----------------------------------------------------------------------------------------------------------------------------------|
| RP01 | Integração WhatsApp           | Utilizar uma API compatível com WhatsApp para envio e recebimento das mensagens.                                                 |
| RP02 | Backend Web                   | Utilizar uma tecnologia compatível com aplicações web modernas para o desenvolvimento do backend.                                |
| RP03 | Arquitetura modular           | Separar os módulos de integração com WhatsApp, chatbot, fluxos decisórios, conhecimento, agendamento e demais regras de negócio. |
| RP04 | MVP                           | Priorizar funcionalidades essenciais compatíveis com o prazo disponível durante o semestre.                                      |
| RP05 | IA sem API externa de LLM     | Não utilizar APIs externas de LLM como mecanismo principal de processamento das orientações do sistema.                          |
| RP06 | WhatsApp como canal principal | Todo o atendimento do consumidor, incluindo orientação e agendamento, deverá ocorrer por meio do WhatsApp.                       |
| RP07 | Base oficial	                 | Utilizar os documentos e informações fornecidos pelo PROCON como fonte inicial da base de conhecimento.                          |
| RP08 | Painel Web do funcionário     | Desenvolver uma interface Web destinada aos funcionários do PROCON para consulta dos atendimentos agendados.                     |
| RP09 | Aprendizado supervisionado	   | Os atendimentos poderão gerar novos conhecimentos, porém sua incorporação à base deverá passar por validação.                    |
| RP10 | Contexto do atendimento       | O funcionário deverá ter acesso ao contexto da conversa relacionada ao atendimento presencial agendado.                          |

---

# PRODUCT BACKLOG

|ID    | Requisito  | User Story                                                                                                                                         | Prioridade |
|------|------------|----------------------------------------------------------------------------------------------------------------------------------------------------|------------|
| PB01 | RF01       | Como consumidor, quero iniciar um atendimento pelo WhatsApp para obter orientação do PROCON sem precisar me deslocar inicialmente até uma unidade. | Alta       |
| PB02 | RF01	      | Como consumidor, quero interagir com o chatbot utilizando mensagens e menus para receber orientação sobre meu problema.                            | Alta       |
| PB03 | RF02	      | Como sistema, quero identificar o consumidor para associar suas mensagens ao atendimento correto.	                                                 | Alta       |
| PB04 | RF02	      | Como sistema, quero manter o contexto da sessão para garantir a continuidade correta da conversa.	                                                 | Alta       |
| PB05 | RP01	      | Como sistema, quero receber mensagens enviadas pelo consumidor através da integração com a API do WhatsApp.	                                       | Alta       |
| PB06 | RP01	      | Como sistema, quero enviar respostas ao consumidor através da integração com a API do WhatsApp.	                                                   | Alta       |
| PB07 | RF03	      | Como consumidor, quero visualizar opções de atendimento para identificar a categoria relacionada ao meu problema.	                                 | Alta       |
| PB08 | RF03	      | Como consumidor, quero selecionar uma categoria para iniciar o fluxo correspondente ao meu problema.                                               | Alta       |
| PB09 | RF04	      | Como consumidor, quero responder perguntas sequenciais para que o chatbot compreenda melhor minha situação.	                                       | Alta       |
| PB10 | RF04	      | Como sistema, quero controlar a etapa atual do fluxo para manter o consumidor no caminho correto do atendimento.                                   | Alta       |
| PB11 | RF04	      | Como consumidor, quero receber perguntas e alternativas relacionadas às respostas que forneci anteriormente.                                       | Alta       |
| PB12 | RF04	      | Como sistema, quero determinar a próxima pergunta de acordo com a resposta selecionada pelo consumidor.                                            | Alta       |
| PB13 | RF05	      | Como consumidor, quero receber uma orientação consolidada ao final do atendimento para compreender minha situação.                                 | Alta       |
| PB14 | RF05	      | Como consumidor, quero receber os próximos passos recomendados para saber como proceder após a orientação.                                         | Alta       |
| PB15 | RF14	      | Como consumidor, quero ser informado quando meu problema não estiver dentro do escopo de atuação do PROCON.	                                       | Alta       |
| PB16 | RNF01      | Como consumidor, quero receber mensagens claras e objetivas para compreender facilmente as orientações.	                                           | Alta       |
| PB17 | RNF04      | Como consumidor, quero ser informado de que as orientações fornecidas possuem caráter orientativo.                                                 | Alta       |
| PB18 | RNF05      | Como consumidor, quero saber quando uma resposta utilizar recursos de IA ou modelo de linguagem.                                                   | Média      |
| PB19 | RF13	      | Como PROCON, quero utilizar informações oficiais para garantir que o chatbot forneça orientações baseadas em fontes confiáveis.	                   | Alta       |
| PB20 | RF13	      | Como sistema, quero armazenar perguntas, respostas e informações utilizadas pelo chatbot.	                                                         | Alta       |
| PB21 | RF13	      | Como administrador, quero atualizar a base de conhecimento sem precisar alterar diretamente o código do chatbot.                                   | Média      |
| PB22 | RP07	      | Como equipe, quero estruturar o documento de Dúvidas Frequentes como fonte inicial da base de conhecimento.	                                       | Alta       |
| PB23 | RF07	      | Como consumidor, quero ser encaminhado para atendimento presencial quando o chatbot não conseguir solucionar meu problema.                         | Alta       |
| PB24 | RF08	      | Como consumidor, quero visualizar datas disponíveis para escolher quando desejo realizar meu atendimento presencial.                               | Alta       |
| PB25 | RF08	      | Como consumidor, quero visualizar horários disponíveis para escolher um horário adequado para meu atendimento.                                     | Alta       |
| PB26 | RF08	      | Como consumidor, quero realizar o agendamento diretamente pelo WhatsApp para não precisar acessar outro sistema.                                   | Alta       |
| PB27 | RF08	      | Como consumidor, quero receber uma confirmação do meu agendamento pelo WhatsApp.                                                                   | Alta       |
| PB28 | RF09	      | Como consumidor, quero saber quais documentos devo levar ao atendimento presencial de acordo com meu caso.                                         | Alta       |
| PB29 | RF12	      | Como consumidor, quero receber um lembrete quando meu atendimento estiver próximo para não esquecer a data agendada.                               | Média      |
| PB30 | RF10	      | Como funcionário do PROCON, quero visualizar os atendimentos agendados sob minha responsabilidade.                                                 | Alta       |
| PB31 | RF10	      | Como funcionário do PROCON, quero visualizar os dados do consumidor que irei atender.	                                                             | Alta       |
| PB32 | RF10	      | Como funcionário do PROCON, quero visualizar a data e o horário dos meus atendimentos.                                                             | Alta       |
| PB33 | RF11	      | Como funcionário do PROCON, quero visualizar o contexto da conversa realizada pelo chatbot antes do atendimento presencial.                        | Alta       |
| PB34 | RF11	      | Como funcionário do PROCON, quero visualizar as respostas fornecidas pelo consumidor durante o fluxo para compreender previamente o caso.	         | Alta       |
| PB35 | RF11	      | Como funcionário do PROCON, quero visualizar o motivo do encaminhamento para atendimento presencial.                                               | Alta       |
| PB36 | RF06	      | Como PROCON, quero registrar as interações realizadas para analisar os atendimentos e os fluxos mais utilizados.                                   | Alta       |
| PB37 | RF06	      | Como sistema, quero registrar o resultado de cada atendimento para identificar se o problema foi solucionado ou encaminhado.                       | Alta       |
| PB38 | RF15	      | Como sistema, quero identificar casos relevantes nos atendimentos para analisar possíveis melhorias na base de conhecimento.                       | Média      |
| PB39 | RF15	      | Como equipe do PROCON, quero analisar casos não solucionados para identificar novas dúvidas e necessidades de orientação.	                         | Média      |
| PB40 | RF16	      | Como responsável pela base de conhecimento, quero validar novos conhecimentos antes que sejam utilizados pelo chatbot.                             | Alta       |
| PB41 | RP09	      | Como sistema, quero impedir que novos conhecimentos sejam incorporados automaticamente sem validação.	                                             | Alta       |
| PB42 | RNF03      | Como consumidor, quero que meus dados sejam tratados adequadamente para proteger minhas informações pessoais.	                                     | Alta       |
| PB43 | RNF02      | Como consumidor, quero receber respostas em tempo adequado para ter uma experiência satisfatória durante o atendimento.	                           | Alta       |
| PB44 | RNF06      | Como desenvolvedor, quero executar o sistema utilizando Docker para facilitar a configuração do ambiente.	                                         | Alta       |
| PB45 | RNF07      | Como desenvolvedor, quero possuir documentação de instalação e configuração para facilitar a execução do projeto.	                                 | Alta       |
| PB46 | RNF08      | Como equipe, quero utilizar versionamento de código para controlar o desenvolvimento do projeto.                                                   | Alta       |
| PB47 | RNF08      | Como equipe, quero possuir testes automatizados para validar as principais funcionalidades do sistema.                                             | Alta       |
| PB48 | RNF08      | Como equipe, quero realizar revisão de código para manter a qualidade da aplicação.	                                                               | Média      |
| PB49 | RNF08      | Como equipe, quero utilizar integração contínua para automatizar a validação do projeto.	                                                         | Média      |
| PB50 | RP02	      | Como equipe, quero definir uma tecnologia web adequada para implementar o backend da aplicação.	                                                   | Alta       |
| PB51 | RP03	      | Como desenvolvedor, quero separar os módulos do sistema para facilitar manutenção e evolução da aplicação.                                       	 | Alta       |
| PB52 | RP03	      | Como desenvolvedor, quero separar a integração do WhatsApp da lógica do chatbot para reduzir o acoplamento entre os componentes.	                 | Alta       |
| PB53 | RP04	      | Como equipe, quero priorizar as funcionalidades essenciais para garantir a entrega de um MVP funcional dentro do semestre.	                       | Alta       |
| PB54 | RP05	      | Como equipe, quero garantir que nenhuma API externa de LLM seja utilizada como dependência principal do sistema.	                                 | Alta       |
| PB55 | RP06	      | Como consumidor, quero realizar todo o atendimento e agendamento pelo WhatsApp para não precisar utilizar outra aplicação.	                       | Alta       |
| PB56 | RP08	      | Como funcionário do PROCON, quero utilizar uma interface Web para consultar os atendimentos presenciais.	                                         | Alta       |
| PB57 | RP10  	    | Como funcionário do PROCON, quero acessar o contexto da conversa associado ao agendamento para me preparar antes do atendimento.	                 | Alta       |
---

# USER STORIES

## US01 — Iniciar atendimento

**Como** consumidor

**Quero** iniciar uma conversa pelo WhatsApp

**Para** obter orientação sobre um problema de consumo sem precisar comparecer inicialmente ao PROCON.

### Critérios de aceitação
-  O usuário consegue iniciar uma conversa pelo canal oficial do WhatsApp.
- O sistema recebe a mensagem enviada pelo usuário.
- O sistema identifica uma nova sessão de atendimento quando necessário.
- O chatbot apresenta uma mensagem inicial.
- O chatbot informa que o atendimento possui caráter orientativo.
- O usuário consegue iniciar o fluxo de atendimento.

## US02 — Identificar usuário e sessão

**Como** consumidor

**Quero** que o sistema reconheça minha sessão de atendimento

**Para** continuar a conversa sem perder o contexto do meu problema.

### Critérios de aceitação
- O sistema identifica o consumidor associado à conversa.
- O sistema verifica se existe uma sessão de atendimento ativa.
- Uma nova sessão é criada quando necessário.
- Uma sessão existente é recuperada quando aplicável.
- As mensagens ficam associadas à sessão correta.
- O contexto do atendimento é mantido durante a conversa.

## US03 — Selecionar categoria do problema

**Como** consumidor

**Quero** selecionar uma categoria que represente meu problema

**Para** ser direcionado ao fluxo de atendimento adequado.

### Critérios de aceitação
- O chatbot apresenta as categorias disponíveis.
- As categorias são baseadas nas informações oficiais utilizadas pelo projeto.
- O usuário consegue selecionar uma categoria por meio do WhatsApp.
- A categoria selecionada é associada à sessão.
- O sistema direciona o usuário ao fluxo correspondente.

## US04 — Navegar pelo fluxo decisório

**Como** consumidor

**Quero** responder perguntas apresentadas pelo chatbot

**Para** fornecer informações sobre meu problema e receber uma orientação adequada.

### Critérios de aceitação
- O chatbot apresenta uma pergunta ao consumidor.
- O usuário recebe opções de resposta quando aplicável.
- Cada resposta direciona o atendimento para a próxima etapa correta.
- O sistema mantém o estado atual do fluxo.
- O fluxo é concluído com uma orientação, encaminhamento ou identificação de caso fora do escopo.

## US05 — Responder perguntas condicionais

**Como** consumidor

**Quero** receber perguntas específicas de acordo com minhas respostas anteriores

**Para** fornecer somente as informações necessárias para analisar meu caso.

### Critérios de aceitação
- O sistema considera as respostas anteriores do consumidor.
- O sistema identifica a próxima pergunta de acordo com as regras do fluxo.
- Perguntas diferentes podem ser apresentadas dependendo das respostas anteriores.
- O sistema evita apresentar perguntas desnecessárias.
- O contexto do fluxo é mantido até sua conclusão.

## US06 — Receber orientação

**Como** consumidor

**Quero** receber uma orientação consolidada

**Para** entender quais medidas posso tomar em relação ao meu problema.

### Critérios de aceitação
- O sistema identifica o resultado do fluxo realizado.
- O chatbot apresenta uma orientação correspondente ao caso.
- O sistema apresenta os próximos passos recomendados.
- A linguagem utilizada é clara e objetiva.
- A resposta informa que possui caráter orientativo.
- O sistema identifica quando é necessário encaminhar o consumidor para atendimento presencial.

## US07 — Consultar informações da base de conhecimento

**Como** consumidor

**Quero** receber respostas baseadas nas informações oficiais do PROCON

**Para** obter orientações confiáveis sobre meu problema.

### Critérios de aceitação
- O chatbot consulta a base de conhecimento quando necessário.
- As informações utilizadas possuem origem em fontes oficiais definidas pelo projeto.
- As respostas apresentadas são relacionadas ao problema informado.
- O conteúdo da base pode ser atualizado pela equipe responsável.
- Informações não validadas não são apresentadas como orientação oficial.

## US08 — Identificar caso fora do escopo

**Como** consumidor

**Quero** saber quando meu problema não está dentro da atuação do PROCON

**Para** não receber uma orientação inadequada.

### Critérios de aceitação
- O sistema identifica situações que não correspondem aos fluxos ou categorias disponíveis.
- O chatbot informa claramente quando não possui uma orientação aplicável ao caso.
- O sistema não apresenta informações como orientação oficial quando não houver base validada.
- Quando possível, o consumidor recebe uma indicação sobre os próximos passos.

## US09 — Solicitar atendimento presencial

**Como** consumidor

**Quero** solicitar atendimento presencial

**Para** buscar ajuda quando meu problema não puder ser solucionado pelo chatbot.

### Critérios de aceitação
- O chatbot identifica situações que necessitam de atendimento presencial.
- O consumidor recebe a opção de realizar um agendamento.
- O agendamento é iniciado diretamente pelo WhatsApp.
- O contexto necessário do atendimento é associado ao agendamento.
- O consumidor não precisa acessar outra aplicação para realizar o agendamento.

## US10 — Consultar datas e horários disponíveis

**Como** consumidor

**Quero** visualizar as datas e horários disponíveis

**Para** escolher um momento adequado para meu atendimento presencial.

### Critérios de aceitação
- O chatbot apresenta as datas disponíveis.
- O consumidor consegue selecionar uma data.
- O sistema apresenta os horários disponíveis para a data selecionada.
- Horários indisponíveis não podem ser selecionados.
- A disponibilidade é atualizada conforme novos agendamentos são realizados.

## US11 — Realizar agendamento

**Como** consumidor

**Quero** realizar meu agendamento pelo WhatsApp

**Para** garantir um horário para meu atendimento presencial no PROCON.

### Critérios de aceitação
- O consumidor consegue selecionar uma data disponível.
- O consumidor consegue selecionar um horário disponível.
- O sistema solicita os dados necessários para o agendamento.
- Os dados informados são validados.
- O agendamento é registrado no sistema.
- O horário selecionado deixa de ficar disponível.
- O consumidor recebe uma confirmação pelo WhatsApp.
- Após a confirmação, o fluxo de atendimento é encerrado.

## US12 — Consultar documentos necessários

**Como** consumidor

**Quero** saber quais documentos devo apresentar

**Para** comparecer ao atendimento presencial com a documentação adequada.

### Critérios de aceitação
- O sistema identifica os documentos relacionados ao caso.
- Os documentos são apresentados de maneira organizada.
- O consumidor recebe a informação pelo WhatsApp.
- O sistema informa que documentos adicionais podem ser solicitados.
- As informações sobre documentação ficam associadas ao contexto do atendimento.

## US13 — Receber lembrete do atendimento

**Como** consumidor

**Quero** receber um lembrete antes do meu atendimento

**Para** não esquecer a data e o horário agendados.

### Critérios de aceitação
- O sistema identifica atendimentos próximos.
- O sistema envia um lembrete pelo WhatsApp.
- O lembrete informa a data do atendimento.
- O lembrete informa o horário.
- O lembrete pode apresentar informações relevantes sobre o atendimento.
- O sistema evita o envio duplicado do mesmo lembrete.

## US14 — Visualizar meus agendamentos

**Como** funcionário do PROCON

**Quero** visualizar os atendimentos agendados sob minha responsabilidade

**Para** organizar os atendimentos que realizarei.

### Critérios de aceitação
- O funcionário consegue acessar o painel Web.
- O sistema apresenta os atendimentos associados ao funcionário.
- Os agendamentos podem ser visualizados por data.
- É possível visualizar o horário do atendimento.
- É possível visualizar o consumidor associado.
- É possível visualizar o status do atendimento.
- O funcionário não visualiza atendimentos que não estejam sob sua responsabilidade, conforme as regras definidas pelo sistema.

## US15 — Consultar dados do atendimento

**Como** funcionário do PROCON

**Quero** consultar os dados do consumidor e do agendamento

**Para** me preparar para o atendimento presencial.

### Critérios de aceitação
- O funcionário consegue visualizar os dados necessários do consumidor.
- O funcionário consegue visualizar a data e o horário do atendimento.
- O caso associado ao agendamento é identificado.
- Os documentos necessários podem ser consultados.
- Os dados apresentados respeitam as regras de acesso e proteção de dados.

## US16 — Visualizar contexto da conversa

**Como** funcionário do PROCON

**Quero** visualizar o contexto da conversa realizada pelo consumidor com o chatbot

**Para** compreender o problema antes de iniciar o atendimento presencial.

### Critérios de aceitação
- O funcionário consegue acessar o contexto associado ao agendamento.
- As perguntas realizadas pelo chatbot podem ser consultadas.
- As respostas fornecidas pelo consumidor podem ser consultadas.
- A categoria selecionada pelo consumidor pode ser visualizada.
- O fluxo percorrido durante o atendimento pode ser identificado.
- A orientação fornecida pelo chatbot pode ser consultada.
- O motivo do encaminhamento para atendimento presencial é apresentado.
- O acesso ao contexto respeita as regras de segurança e privacidade.

## US17 — Registrar atendimentos

**Como** responsável pelo sistema

**Quero** registrar os atendimentos realizados

**Para** analisar os casos e identificar oportunidades de melhoria do chatbot.

### Critérios de aceitação
- As interações realizadas durante o atendimento podem ser registradas.
- Perguntas e respostas podem ser armazenadas.
- O fluxo percorrido pelo consumidor pode ser identificado.
- O resultado do atendimento pode ser registrado.
- É possível identificar se o caso foi solucionado ou encaminhado.
- O registro respeita as regras de proteção de dados.

## US18 — Analisar casos para aprimoramento

**Como** responsável pelo sistema

**Quero** analisar os atendimentos realizados

**Para** identificar novos padrões, dúvidas e situações que não estavam contempladas na base de conhecimento.

### Critérios de aceitação
- Os atendimentos podem ser consultados para análise.
- É possível identificar casos semelhantes.
- É possível identificar dúvidas que não foram solucionadas.
- É possível identificar casos que resultaram em atendimento presencial.
- Casos relevantes podem ser selecionados para avaliação.
- Os dados utilizados na análise respeitam as regras de privacidade definidas pelo projeto.

## US19 — Selecionar casos relevantes

**Como** responsável pela base de conhecimento

**Quero** selecionar atendimentos relevantes para avaliação

**Para** identificar conhecimentos que possam melhorar os atendimentos futuros.

### Critérios de aceitação
- Existem critérios definidos para identificar casos relevantes.
- Casos não solucionados podem ser identificados.
- Casos recorrentes podem ser identificados.
- Casos fora dos fluxos existentes podem ser identificados.
- Casos selecionados ficam disponíveis para avaliação.
- A seleção não incorpora automaticamente o conhecimento à base.

## US20 — Validar novos conhecimentos

**Como** responsável pela base de conhecimento

**Quero** validar novos conhecimentos antes de incorporá-los ao chatbot

**Para** garantir que apenas informações corretas e confiáveis sejam utilizadas nas orientações.

### Critérios de aceitação
- Um novo conhecimento pode ser submetido para validação.
- O conhecimento possui uma origem identificável.
- O conteúdo pode ser aprovado ou rejeitado.
- Apenas conteúdos aprovados podem ser incorporados à base.
- O processo de validação fica registrado.
- Informações não validadas não são utilizadas como orientação oficial.

## US21 — Incorporar novos conhecimentos à base

**Como** responsável pela base de conhecimento

**Quero** incorporar conhecimentos validados à base do chatbot

**Para** melhorar a capacidade do sistema de orientar futuros consumidores.

### Critérios de aceitação
- Um conhecimento validado pode ser incorporado à base.
- O conhecimento pode ser associado a uma categoria.
- O conhecimento pode ser associado a um fluxo ou situação.
- É possível identificar a origem do conhecimento.
- A atualização fica registrada.
- O chatbot passa a utilizar apenas a versão validada do conhecimento.

## US22 — Identificar utilização de IA

**Como** consumidor

**Quero** saber quando uma resposta recebeu auxílio de IA

**Para** ter transparência sobre a forma como a resposta foi produzida.

### Critérios de aceitação
- O sistema identifica quando recursos de IA foram utilizados.
- O consumidor é informado conforme as regras definidas pelo projeto.
- A informação é apresentada de maneira clara.
- A transparência não prejudica a compreensão da orientação.

## US23 — Proteger os dados do consumidor

**Como** consumidor

**Quero** que meus dados sejam tratados de forma segura

**Para** proteger minhas informações pessoais durante o atendimento.

### Critérios de aceitação
- O sistema coleta apenas os dados necessários para o atendimento.
- O acesso aos dados é controlado conforme o perfil do usuário.
- Dados pessoais não são utilizados indevidamente.
- Informações sensíveis possuem proteção adequada.
- Os registros respeitam as regras de privacidade definidas pelo projeto.

---

# DEFINITION OF DONE

Uma User Story será considerada Entregue quando:

- A implementação for concluída.
- O código estiver versionado no GitHub.
- O código seguir o padrão definido pela equipe.
- A funcionalidade for testada.
- Os critérios de aceitação forem atendidos.
- Não existirem erros críticos conhecidos.
- For realizada revisão de código/Code Review.
- A funcionalidade for integrada à aplicação.
- A documentação necessária for atualizada.
- A funcionalidade for demonstrada na Sprint Review.
- Os testes automatizados foram executados com sucesso.

---

# SPRINTS

| Sprint | Data de Início | Data de Entrega | Status        |
|--------|----------------|-----------------|---------------|
|  1     | (10/08/2026)   | (14/09/2026)    |  Em Andamento |
|  2     | (15/09/2026)   | (19/10/2026)    |  Não Inciado  |
|  3     | (20/10/2026)   | (23/11/2026)    |  Não Iniciado |

---

# SPRINT BACKLOG

## Sprint 1 — Fundação do projeto

| ID      | Requisito | User Story | Tarefa                                                    | Prioridade |
|---------|-----------|------------|-----------------------------------------------------------|------------|
| ABP-001	| RP02/RP03	| —	         | Definir arquitetura geral da aplicação	                   | Alta       |
| ABP-002	| RP02	    | —	         | Definir tecnologias do backend	                           | Alta       |
| ABP-003	| RP03	    | —	         | Definir separação entre módulos do sistema	               | Alta       |
| ABP-004	| RP03	    | —	         | Definir comunicação entre os módulos	                     | Alta       |
| ABP-005	| RNF06	    | —	         | Configurar ambiente Docker	                               | Alta       |
| ABP-006	| RNF08	    | —	         | Configurar repositório do projeto	                       | Alta       |
| ABP-007	| RNF08	    | —	         | Definir estratégia de versionamento	                     | Alta       |
| ABP-008	| RNF08	    | —	         | Definir padrão de branches e GitHub Flow	                 | Alta       |
| ABP-009	| RNF08	    | —	         | Configurar integração contínua inicial	                   | Média      |
| ABP-010	| RP02	    | —	         | Criar estrutura inicial do backend	                       | Alta       |
| ABP-011	| RP02	    | —	         | Configurar variáveis de ambiente	                         | Alta       |
| ABP-012	| RP02	    | —	         | Configurar conexão com banco de dados SQL	               | Alta       |
| ABP-013	| RP01	    | US01	     | Definir estratégia de integração com a API do WhatsApp	   | Alta       |
| ABP-014	| RP01	    | US01	     | Configurar ambiente de testes da API do WhatsApp	         | Alta       |
| ABP-015	| RP01	    | US01	     | Implementar recebimento de mensagens	                     | Alta       |
| ABP-016	| RP01	    | US01	     | Implementar envio de mensagens	                           | Alta       |
| ABP-017	| RP01	    | US01	     | Implementar tratamento de mensagens recebidas	           | Alta       |
| ABP-018	| RF01	    | US01	     | Criar mensagem inicial do chatbot	                       | Alta       |
| ABP-019	| RNF04	    | US01	     | Implementar aviso de caráter orientativo	                 | Alta       |
| ABP-020	| RF02	    | US02	     | Criar modelo de consumidor	                               | Alta       |
| ABP-021	| RF02	    | US02	     | Criar modelo de sessão	                                   | Alta       |
| ABP-022	| RF02	    | US02	     | Implementar criação de sessão	                           | Alta       |
| ABP-023	| RF02	    | US02	     | Implementar recuperação de sessão	                       | Alta       |
| ABP-024	| RF02	    | US02	     | Associar mensagens à sessão	                             | Alta       |
| ABP-025	| RF03	    | US03	     | Definir categorias iniciais de problemas	                 | Alta       |
| ABP-026	| RF03	    | US03	     | Criar estrutura de categorias	                           | Alta       |
| ABP-027	| RF03	    | US03	     | Implementar consulta de categorias	                       | Alta       |
| ABP-028	| RF03	    | US03	     | Implementar apresentação das categorias no WhatsApp	     | Alta       |
| ABP-029	| RF04	    | US04	     | Definir estrutura dos fluxos decisórios	                 | Alta       |
| ABP-030	| RF04	    | US04	     | Criar modelo de perguntas	                               | Alta       |
| ABP-031	| RF04	    | US04	     | Criar modelo de alternativas	                             | Alta       |
| ABP-032	| RF04	    | US04	     | Implementar transição entre etapas	                       | Alta       |
| ABP-033	| RF04	    | US04	     | Implementar controle de estado do fluxo	                 | Alta       |
| ABP-034	| RF04	    | US05	     | Implementar perguntas condicionais	                       | Alta       |
| ABP-035	| RF04	    | US05	     | Implementar seleção da próxima pergunta	                 | Alta       |
| ABP-036	| RF09/RP07	| US07	     | Analisar documento de Dúvidas Frequentes	                 | Alta       |
| ABP-037	| RF09/RP07	| US07	     | Identificar categorias existentes na documentação	       | Alta       |
| ABP-038	| RF09/RP07	| US07	     | Estruturar perguntas e respostas da documentação	         | Alta       |
| ABP-039	| RF09/RP07	| US07	     | Estruturar informações sobre documentos necessários	     | Alta       |
| ABP-040	| RF09	    | US07	     | Criar estrutura da base de conhecimento	                 | Alta       |
| ABP-041	| RF09	    | US07	     | Inserir conteúdo inicial na base	                         | Alta       |
| ABP-042	| RF09	    | US07	     | Validar conteúdo importado	                               | Alta       |
| ABP-043	| RF01–RF04	| US01–US05	 | Integrar WhatsApp, chatbot e fluxos decisórios	           | Alta       |
| ABP-044	| RNF01	    | US01–US07	 | Revisar linguagem das mensagens	                         | Alta       |
| ABP-045	| RNF08	    | US01–US05	 | Criar testes do fluxo inicial	                           | Alta       |
| ABP-046	| RNF08	    | US01–US05	 | Realizar teste integrado do atendimento inicial	         | Alta       |

---

## Sprint 2 — Orientação e atendimento presencial

| ID      | Requisito | User Story | Tarefa                                                             | Prioridade |
|---------|-----------|------------|--------------------------------------------------------------------|------------|
| ABP-047	| RF05	    | US06	     | Definir estrutura da orientação final	                            | Alta
| ABP-048	| RF05	    | US06	     | Criar modelo de orientação	                                        | Alta
| ABP-049	| RF05	    | US06	     | Associar orientações aos fluxos	                                  | Alta
| ABP-050	| RF05	    | US06	     | Implementar geração da orientação consolidada	                    | Alta
| ABP-051	| RF05	    | US06	     | Implementar apresentação dos próximos passos	                      | Alta
| ABP-052	| RF10	    | US08	     | Definir critérios para casos fora do escopo	                      | Alta
| ABP-053	| RF10	    | US08	     | Implementar identificação de casos fora do escopo	                | Alta
| ABP-054	| RF10	    | US08	     | Criar mensagens de encaminhamento	                                | Alta
| ABP-055	| RF07	    | US09	     | Definir critérios para atendimento presencial	                    | Alta
| ABP-056	| RF07	    | US09	     | Implementar identificação da necessidade de atendimento presencial	| Alta
| ABP-057	| RF07	    | US09	     | Criar fluxo conversacional de encaminhamento	                      | Alta
| ABP-058	| RF11	    | US12	     | Criar modelo de documentos necessários	                            | Alta
| ABP-059	| RF11	    | US12	     | Associar documentos aos tipos de atendimento	                      | Alta
| ABP-060	| RF11	    | US12	     | Implementar apresentação de documentos pelo WhatsApp	              | Alta
| ABP-061	| RF08	    | US10	     | Criar modelo de disponibilidade	                                  | Alta
| ABP-062	| RF08	    | US10	     | Implementar cadastro de datas disponíveis	                        | Alta
| ABP-063	| RF08	    | US10	     | Implementar cadastro de horários disponíveis	                      | Alta
| ABP-064	| RF08	    | US10	     | Implementar consulta de disponibilidade	                          | Alta
| ABP-065	| RF07	    | US10	     | Implementar seleção de data pelo WhatsApp	                        | Alta
| ABP-066	| RF07	    | US10	     | Implementar seleção de horário pelo WhatsApp	                      | Alta
| ABP-067	| RF07	    | US11	     | Criar modelo de agendamento	                                      | Alta
| ABP-068	| RF07	    | US11	     | Implementar registro do agendamento	                              |Alta
| ABP-069	| RF07	    | US11	     | Implementar validação da disponibilidade	                          |Alta
| ABP-070	| RF07	    | US11	     | Implementar prevenção de conflitos de horário	                    |Alta
| ABP-071	| RF07	    | US11	     | Implementar confirmação do agendamento pelo WhatsApp	              |Alta
| ABP-072	| RF07	    | US11	     | Implementar encerramento da sessão após o agendamento	            |Alta
| ABP-073	| RF07	    | US11	     | Definir estratégia de lembrete do atendimento	                    |Média
| ABP-074	| RF07	    | US11	     | Implementar envio de lembrete próximo ao atendimento	              |Média
| ABP-075	| RF06	    | US15	     | Definir estrutura de registro das interações	                      |Alta
| ABP-076	| RF06	    | US15	     | Criar modelo de interação	                                        |Alta
| ABP-077	| RF06	    | US15	     | Registrar mensagens da conversa	                                  |Alta
| ABP-078	| RF06	    | US15	     | Registrar fluxo percorrido	                                        |Alta
| ABP-079	| RF06	    | US15	     | Registrar resultado do atendimento                                 |	Alta
| ABP-080	| RF06	    | US15	     | Registrar encaminhamento presencial	                              |Alta
| ABP-081	| RF06	    | US15	     | Implementar consulta básica dos registros	                        |Média
| ABP-082	| RNF01	    | US01–US12	 | Revisar usabilidade do fluxo conversacional	                      |Alta
| ABP-083	| RNF02	    | US01–US12	 | Avaliar tempo de resposta do chatbot	                              |Alta
| ABP-084	| RNF08	    | US06–US12	 | Criar testes dos fluxos de orientação	                            |Alta
| ABP-085	| RNF08	    | US09–US12	 | Criar testes do fluxo de agendamento	                              |Alta
| ABP-086	| RF01–RF11	| US01–US12	 | Realizar teste integrado completo pelo WhatsApp                    |Alta

---

## Sprint 3 — Administração, segurança e entrega

| ID      | Requisito | User Story | Tarefa                                                   | Prioridade |
|---------|-----------|----------- |----------------------------------------------------------|------------|
| ABP-091 | RF08      | US24	     | Definir layout da interface administrativa	              | Alta       |
| ABP-092 | RF08	    | US24	     | Criar tela de atendimentos agendados	                    | Alta       |
| ABP-093 | RF08	    | US24	     | Criar endpoint de consulta de atendimentos	              | Alta       |
| ABP-094 | RF08	    | US24	     | Implementar listagem de atendimentos	                    | Alta       |
| ABP-095 | RF08	    | US24	     | Implementar filtros de atendimento	                      | Média      |
| ABP-096 | RF08	    | US25	     | Criar tela de detalhes do atendimento	                  | Alta       |
| ABP-097 | RF08      | US25	     | Implementar consulta dos dados do atendimento	          | Alta       |
| ABP-098 | RF08	    | US26	     | Criar tela de gerenciamento de disponibilidade	          | Alta       |
| ABP-099 | RF08	    | US26	     | Implementar cadastro de horários	                        | Alta       |
| ABP-100 | RF08	    | US26	     | Implementar bloqueio de horários	                        | Alta       |
| ABP-101 | RF08      | US27	     | Criar estados do agendamento	                            | Média      |
| ABP-102 | RF08	    | US27       | Implementar atualização do status	                      | Média      |
| ABP-103 | RF05	    | US14	     | Definir arquitetura do módulo de geração textual	        | Alta       |
| ABP-104 | RP03/RP05 | US14	     | Definir modelo de LLM local permitido	                  | Alta       |
| ABP-105 | RP05      | US14	     | Configurar modelo local sem API externa	                | Alta       |
| ABP-106 | RF05	    | US14	     | Implementar geração de explicação textual	              | Alta       |
| ABP-107 | RF05	    | US15	     | Implementar identificação de respostas com auxílio de IA	| Alta       |
| ABP-108 | RF05	    | US14	     | Garantir que a IA não altere a orientação do fluxo	      | Alta       |
| ABP-109 | RF05	    | US15	     | Criar aviso de transparência sobre uso de IA	            | Média      |
| ABP-110 | RNF03	    | US28	     | Mapear dados pessoais armazenados	                      | Alta       |
| ABP-111 | RNF03	    | US28	     | Revisar armazenamento de dados do consumidor	            | Alta       |
| ABP-112 | RNF03     | US24–US28	 | Implementar controle de acesso administrativo	          | Alta       |
| ABP-113 | RNF03	    | US24–US28	 | Revisar exposição de dados pessoais	                    | Alta       |
| ABP-114 | RNF03	    | US01–US30	 | Realizar revisão de conformidade com LGPD	              | Alta       |
| ABP-115 | RNF02	    | US01–US30	 | Realizar testes de desempenho	                          | Alta       |
| ABP-116 | RNF02     | US01–US30	 | Avaliar disponibilidade do sistema	                      | Média      |
| ABP-117 | RNF08	    | US01–US30	 | Ampliar cobertura de testes automatizados	              | Alta       |
| ABP-118 | RNF08	    | US01–US30	 | Criar testes de integração	                              | Alta       |
| ABP-119 | RNF08	    | US01–US30	 | Criar testes do fluxo completo	                          | Alta       |
| ABP-120 | RNF08	    | —	         | Configurar pipeline de CI/CD	                            | Média      |
| ABP-121 | RNF08	    | —	         | Automatizar execução dos testes no CI	                  | Média      |
| ABP-122 | RNF06     | —	         | Revisar configuração Docker	                            | Alta       |
| ABP-123 | RNF06	    | —	         | Validar execução completa via Docker	                    | Alta       |
| ABP-124 | RNF07	    | —	         | Documentar instalação do sistema	                        | Alta       |
| ABP-125 | RNF07     | —	         | Documentar requisitos de hardware e software	            | Alta       |
| ABP-126 | RNF07	    | —	         | Documentar arquitetura da aplicação	                    | Alta       |
| ABP-127 | RNF07	    | —	         | Documentar configuração da API WhatsApp	                | Alta       |
| ABP-128 | RNF07     | —	         | Documentar configuração da base de conhecimento	        | Média      |
| ABP-129 | RNF08	    | —	         | Atualizar README do projeto	                            | Alta       |
| ABP-130 | RNF08	    | —	         | Revisar documentação técnica	                            | Alta       |
| ABP-131 | RP04	    | —	         | Revisar escopo final do MVP	                            | Alta       |
| ABP-132 | RNF08     | —	         | Realizar revisão geral do código	                        | Alta       |
| ABP-133 | RNF08     | —	         | Corrigir bugs encontrados nos testes finais	            | Alta       |
| ABP-134 | RNF08     | —	         | Realizar teste de aceitação do sistema  	                | Alta       |
| ABP-135 | RNF08     | —	         | Preparar ambiente para demonstração	                    | Alta       |
| ABP-136 | RNF08     | —	         | Preparar apresentação da Sprint Review	                  | Alta       |
| ABP-137 | RNF08     | —	         | Preparar documentação da entrega final	                  | Alta       |

---

# 🔗 LINKS

### BACKLOG DO PRODUTO 
[Clique Aqui]()


### Protótipo do aplicativo
[Clique Aqui]()

### Protótipo chatbot
[Clique Aqui]()

### Protótipo da IA
[Clique Aqui]()

---

# :computer: EQUIPE

|CARGO                | NOME                 | SOCIAL MEDIA                                                                                                           |
|---------------------|----------------------|:----------------------------------------------------------------------------------------------------------------------:|
| P.O (Product Owner) |   André Ventura      | <a target="_blank" href="https://github.com/AndreHVentura"><img  src="https://skillicons.dev/icons?i=github"></a>      |
| S.M (Scrum Master)  |   André Michel       | <a target="_blank" href="https://github.com/andremc331"><img  src="https://skillicons.dev/icons?i=github"></a>         |
| DEV. (Developer)    |   Bruno Henrique     | <a target="_blank" href="https://github.com/BrunoHenrique258"><img  src="https://skillicons.dev/icons?i=github"></a>   |
| DEV. (Developer)    |   Edlaine Souza      | <a target="_blank" href="https://github.com/edlaine-souza"><img  src="https://skillicons.dev/icons?i=github"></a>      |
| DEV. (Developer)    |   Luana Pinheiro     | <a target="_blank" href="https://github.com/Luana873"><img  src="https://skillicons.dev/icons?i=github"></a>           |
| DEV. (Developer)    |   Rodrigo de Andrade | <a target="_blank" href="https://github.com/RodrigodeAndrade90"><img  src="https://skillicons.dev/icons?i=github"></a> |
| DEV. (Developer)    |   Nicolas            | <a target="_blank" href="https://github.com/NICOLAShsdo"><img src="https://skillicons.dev/icons?i=github"></a>         |
