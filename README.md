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
  <img src="https://skillicons.dev/icons?i=git,github,figma,vscode,docker" />
</p>

---
# REQUISITOS DO PROJETO

## Requisitos funcionais

| ID   | Requisito                 | Descrição                                                                                          |
|------|---------------------------|----------------------------------------------------------------------------------------------------|
| RF01 | Atendimento inicial       | Permitir que o consumidor inicie um atendimento através do WhatsApp.                               |
| RF02 | Identificação e sessão    | Identificar o consumidor e manter o contexto de sua sessão de atendimento.                         |
| RF03 | Categorias de atendimento | Apresentar categorias de problemas para direcionar o consumidor ao fluxo adequado.                 |
| RF04 | Fluxos decisórios         | Conduzir o consumidor por perguntas e alternativas de acordo com seu problema.                     |
| RF05 | Orientação ao consumidor  | Apresentar uma orientação consolidada e os próximos passos recomendados.                           |
| RF06 | Registro de atendimentos  | Registrar as interações realizadas durante os atendimentos.                                        |
| RF07 | Atendimento presencial	   | Permitir o encaminhamento para atendimento presencial quando o chatbot não solucionar o problema.  |
| RF08 | Gestão de agendamentos	   | Permitir que funcionários consultem e gerenciem os atendimentos agendados.                         |
| RF09 | Base de conhecimento	     | Utilizar informações oficiais do PROCON para alimentar as respostas do chatbot.                    |
| RF10 | Casos fora do escopo	     | Identificar quando o problema apresentado não está dentro do escopo de atuação do PROCON.          |
| RF11 | Documentos necessários	   | Informar os documentos necessários para o atendimento presencial.                                  |
| RF12 | Aprendizado contínuo	     | Registrar e analisar atendimentos para identificar novos casos e aprimorar a base de conhecimento. |

## Requisitos não funcionais

| ID    | Requisito                 | Descrição                                                                                                  |
|-------|---------------------------|------------------------------------------------------------------------------------------------------------|
| RNF01 | Usabilidade               | As mensagens devem ser claras, objetivas e compreensíveis.                                                 |
| RNF02 | Desempenho                | O sistema deve apresentar tempo de resposta adequado durante o atendimento.                                |
| RNF03 | Segurança e LGPD          | Os dados dos consumidores devem ser tratados de acordo com a LGPD.                                         |
| RNF04 | Caráter orientativo       | O sistema deve informar que as respostas possuem caráter orientativo.                                      |
| RNF05 | Transparência da IA       | O consumidor deve ser informado quando houver utilização de modelo de linguagem/IA na geração da resposta. |
| RNF06 | Containerização           | O sistema deve poder ser executado utilizando Docker.                                                      |
| RNF07 | Documentação              | O projeto deve possuir documentação de instalação, configuração e utilização.                              |
| RNF08 | Qualidade e versionamento | O projeto deve utilizar controle de versão, testes automatizados, revisão de código e integração contínua. |

## Restrições do projeto

| ID   | Requisito                  | Descrição                                                                                                 |
|------|----------------------------|-----------------------------------------------------------------------------------------------------------|
| RP01 | Integração WhatsApp        | Utilizar uma API do WhatsApp para envio e recebimento de mensagens.                                       |
| RP02 | Backend                    | Utilizar uma tecnologia web para desenvolvimento do backend.                                              |
| RP03 | Arquitetura modular        | Separar chatbot, fluxos decisórios, base de conhecimento, IA e integrações.                               |
| RP04 | MVP                        | Priorizar funcionalidades essenciais compatíveis com o prazo do semestre.                                 |
| RP05 | IA sem API externa de LLM  | O projeto não deverá utilizar uma API externa de LLM para o processamento principal da IA.                |
| RP06 | Interface simulada         | Desenvolver uma interface própria que simule a experiência de conversa do WhatsApp.                       |
| RP07 | Base oficial               | Utilizar o documento de Dúvidas Frequentes fornecido pelo PROCON como fonte inicial de conhecimento.      |
| RP08 | Agendamento                | Desenvolver a interface própria para encaminhamento e agendamento do atendimento presencial.              |
| RP09 | Aprendizado supervisionado | Os atendimentos poderão gerar novos conhecimentos, mas a incorporação à base deverá passar por validação. | 

---

# PRODUCT BACKLOG

|ID     | Requisito      | User Story                                                                                                          | Prioridade |
|-------|----------------|---------------------------------------------------------------------------------------------------------------------|------------|
| PB01	| RF01	         | Como consumidor, quero iniciar uma conversa pelo WhatsApp para obter orientação do PROCON.	                         | Alta       |
| PB02	| RF01	         | Como sistema, quero identificar o usuário e controlar sua sessão de atendimento.	                                   | Alta	      |
| PB03	| RF02	         | Como consumidor, quero receber opções de atendimento para identificar meu problema.	                               | Alta       |	
| PB04  | RF02	         | Como administrador, quero cadastrar os fluxos decisórios do PROCON para que o chatbot utilize informações oficiais. | Alta       |	
| PB05	| RF03	         | Como consumidor, quero responder perguntas sequenciais para chegar ao fluxo adequado ao meu problema.               | Alta	      |
| PB06	| RF03	         | Como sistema, quero controlar o estado da conversa para manter o usuário no fluxo correto.                          | Alta       |
| PB07	| RF04	         | Como consumidor, quero receber uma orientação consolidada ao final do fluxo.	                                       | Alta       |
| PB08	| RF04	         | Como consumidor, quero saber quais são os próximos passos recomendados para meu caso.                               | Alta       |
| PB09	| RF05	         | Como consumidor, quero receber uma explicação textual clara sobre a orientação apresentada.                         | Média      |
| PB10	| RF06	         | Como PROCON, quero registrar as interações para identificar os fluxos mais utilizados.	                             | Alta	      |
| PB11	| RF07	         | Como consumidor, quero solicitar atendimento presencial quando o chatbot não solucionar minha dúvida.               | Alta       |
| PB12	| RF07	         | Como consumidor, quero visualizar os horários disponíveis para atendimento presencial.                              | Alta	      |
| PB13	| RF07	         | Como consumidor, quero realizar o agendamento pelo chatbot.                                                         | Alta       |
| PB14	| RF07	         | Como consumidor, quero saber quais documentos devo levar ao atendimento.	                                           | Alta       |
| PB15	| RF08	         | Como funcionário do PROCON, quero visualizar os atendimentos agendados.                                             | Alta	      |
| PB16	| RF08	         | Como funcionário do PROCON, quero consultar os dados necessários para o atendimento agendado.                       | Alta	      |
| PB17	| RNF01	         | Como consumidor, quero receber mensagens claras e objetivas para compreender facilmente as orientações.             | Alta       |
| PB18	| RNF03	         | Como PROCON, quero que os dados dos usuários sejam tratados de acordo com a LGPD.                                   | Alta	      |
| PB19	| RNF04	         | Como consumidor, quero saber que a resposta do chatbot possui caráter orientativo.	                                 | Alta       |
| PB20	| RNF05	         | Como consumidor, quero saber quando uma resposta recebeu auxílio de um modelo de linguagem.                         | Média      |
| PB21	| RNF06	         | Como desenvolvedor, quero executar o sistema através de Docker.                                                     | Alta	      |
| PB22	| RNF07	         | Como desenvolvedor, quero documentar a instalação e os requisitos do sistema.                                       | Alta       |
| PB23	| RNF08	         | Como equipe, quero utilizar versionamento e GitHub Flow para controlar o desenvolvimento.                           | Alta       |
| PB24	| RNF08	         | Como equipe, quero possuir testes automatizados para validar o sistema.                                             | Alta       |
| PB25	| RNF08	         | Como equipe, quero utilizar CI/CD para automatizar validações e entregas.                                           | Média      |
| PB26	| RP01	         | Como sistema, quero receber e enviar mensagens através da integração com WhatsApp.                                  | Alta       |
| PB27	| RP02	         | Como desenvolvedor, quero implementar o backend com uma tecnologia web moderna.                                     | Alta       |
| PB28	| RP03	         | Como desenvolvedor, quero separar a lógica do chatbot, fluxos decisórios e integração com IA.                       | Alta       |
| PB29	| RP04	         | Como equipe, quero priorizar um MVP compatível com o prazo do semestre.                                             | Alta       |
| PB30	| RP05	         | Como equipe, quero garantir que nenhuma API externa de LLM seja utilizada.                                          | Alta       |
| PB31	| RF02/RF03      | Como consumidor, quero selecionar uma categoria de problema para iniciar meu atendimento.                           | Alta       |
| PB32	| RP03           | Como consumidor, quero receber perguntas específicas para a categoria selecionada.                                  | Alta       |
| PB33	| RF02/RF03      | Como sistema, quero armazenar as perguntas e respostas da base de conhecimento.                                     | Alta       |
| PB34	| RF02/RF03/RF08 | Como administrador, quero atualizar as perguntas e respostas sem alterar o código do chatbot.                       | Média      |
| PB35	| RF04/RF07      | Como consumidor, quero saber quando meu caso não está dentro do escopo de atuação do PROCON.                        | Alta       |
| PB36	| RF07           | Como consumidor, quero receber a lista de documentos necessários para meu caso.                                     | Alta       |

---

# USER STORIES

## US01 — Iniciar atendimento

**Como** consumidor

**Quero** iniciar uma conversa pelo WhatsApp

**Para** obter orientação sobre um problema de consumo sem precisar comparecer inicialmente ao PROCON.

### Critérios de aceitação:

- O usuário consegue enviar uma mensagem ao chatbot.
  
- O sistema identifica uma nova sessão.
  
- O chatbot apresenta uma mensagem inicial.
  
- O chatbot informa que possui caráter orientativo.
  
- O usuário consegue iniciar o fluxo de atendimento.

## US02 — Identificar usuário e sessão

**Como** consumidor

**Quero** que o sistema reconheça minha sessão de atendimento

**Para** continuar a conversa sem perder o contexto do meu problema.

### Critérios de aceitação:

- O sistema identifica o usuário.

- O sistema verifica se existe uma sessão ativa.
  
- Uma nova sessão é criada quando necessário.
  
- O sistema recupera uma sessão existente quando aplicável.
  
- As mensagens ficam associadas à sessão correta.

## US03 — Selecionar categoria do problema

**Como** consumidor

**Quero** selecionar uma categoria que represente meu problema

**Para** ser direcionado ao fluxo de atendimento adequado.

### Critérios de aceitação:

- O sistema apresenta categorias disponíveis.
  
- As categorias são baseadas na documentação do PROCON.
  
- O usuário consegue selecionar uma categoria.
  
- A categoria selecionada é associada à sessão.
  
- O sistema direciona o usuário ao fluxo correspondente.
  
## US04 — Navegar pelo fluxo decisório

**Como** consumidor

**Quero** responder perguntas apresentadas pelo chatbot

**Para** identificar o fluxo correspondente ao meu problema.

### Critérios de aceitação:

- O sistema apresenta uma pergunta.

- O usuário recebe opções de resposta.
  
- Cada opção direciona para o próximo passo correto.
  
- O sistema mantém o estado da conversa.
  
- O fluxo termina em uma orientação ou encaminhamento.
  
## US05 — Responder perguntas condicionais

**Como** consumidor

**Quero** receber perguntas específicas de acordo com minhas respostas anteriores

**Para** fornecer somente as informações necessárias para analisar meu caso.

### Critérios de aceitação:

- O sistema considera respostas anteriores.
  
- O sistema identifica a próxima pergunta.
  
- Perguntas diferentes podem ser apresentadas de acordo com as respostas.
  
- O sistema não apresenta perguntas desnecessárias quando uma condição já foi satisfeita.
  
- O fluxo mantém o contexto até sua conclusão.

## US06 — Receber orientação

**Como** consumidor

**Quero** receber uma orientação consolidada

**Para** entender quais medidas posso tomar.

### Critérios de aceitação:

- O sistema apresenta um resumo do problema identificado.
  
- Apresenta a orientação correspondente.
  
- Apresenta os próximos passos.
  
- Informa quando o caso necessita de atendimento presencial.
  
- A resposta deixa claro que possui caráter orientativo.

## US07 — Consultar informações da base de conhecimento

**Como** consumidor

**Quero** receber respostas baseadas nas informações oficiais do PROCON

**Para** obter orientações confiáveis sobre meu problema.

### Critérios de aceitação:

- O chatbot consulta a base de conhecimento.
  
- As informações utilizadas têm origem na documentação oficial definida para o projeto.
  
- As respostas são relacionadas ao problema apresentado.
  
- O conteúdo utilizado pode ser atualizado pela equipe responsável.
  
- O sistema não deve apresentar informações não validadas como orientação oficial.

## US08 — Identificar caso fora do escopo

**Como** consumidor

**Quero** saber quando meu problema não está dentro da atuação do PROCON

**Para** não receber uma orientação inadequada.

### Critérios de aceitação:

- O sistema identifica casos fora do escopo conhecido.
  
- O chatbot informa que o caso não está dentro de sua área de atuação.
  
- O sistema evita apresentar uma orientação como se fosse aplicável.
  
- Quando possível, o usuário recebe orientação sobre o próximo passo.

## US09 — Solicitar atendimento presencial

**Como** consumidor

**Quero** solicitar atendimento presencial

**Para** resolver problemas que não foram solucionados pelo chatbot.

### Critérios de aceitação:

- O chatbot identifica a necessidade de atendimento presencial.
  
- O usuário recebe a opção de realizar o agendamento.
  
- O usuário é direcionado para a interface de agendamento.
  
- O contexto necessário do atendimento é encaminhado para o agendamento.

## US10 — Consultar horários disponíveis

**Como** consumidor

**Quero** visualizar os horários disponíveis

**Para** escolher uma data e horário para meu atendimento.

### Critérios de aceitação:
 
- O sistema apresenta datas disponíveis.

- O sistema apresenta horários disponíveis.
  
- Horários indisponíveis não podem ser selecionados.
  
- Os horários são atualizados conforme os agendamentos realizados.

## US11 — Realizar agendamento

**Como** consumidor

**Quero** realizar meu agendamento

**Para** garantir um horário de atendimento presencial no PROCON.

### Critérios de aceitação:

- O usuário consegue selecionar data e horário.

- O sistema solicita os dados necessários.

- O sistema valida os dados informados.

- O agendamento é registrado.

- O usuário recebe confirmação do agendamento.

## US12 — Consultar documentos necessários

**Como** consumidor

**Quero** saber quais documentos devo apresentar

**Para** chegar ao atendimento presencial com a documentação adequada.

Critérios de aceitação:

- O sistema identifica os documentos associados ao caso.

- Apresenta os documentos de maneira organizada.

- Informa que documentos adicionais podem ser solicitados.

- Permite continuar para o agendamento.

## US13 — Visualizar agendamentos

**Como** funcionário do PROCON

**Quero** visualizar os atendimentos agendados

**Para** organizar os atendimentos presenciais.

### Critérios de aceitação:

- O funcionário consegue consultar os agendamentos.
  
- Os agendamentos são apresentados por data.
  
- É possível visualizar o horário.
  
- É possível visualizar o status do atendimento.

## US14 — Consultar dados do atendimento

**Como** funcionário do PROCON

**Quero** consultar os dados fornecidos pelo consumidor

**Para** preparar o atendimento presencial.

### Critérios de aceitação:

- O funcionário consegue consultar os dados necessários.

- O caso associado ao agendamento é identificado.

- Os documentos necessários podem ser consultados.

- Dados sensíveis são protegidos conforme as regras definidas.

## US15 — Registrar atendimentos para aprendizado

**Como** responsável pelo sistema

**Quero** registrar os atendimentos realizados

**Para** analisar os casos e identificar oportunidades de melhoria do chatbot.

### Critérios de aceitação:

- As interações podem ser registradas.
  
- Perguntas e respostas podem ser armazenadas.
  
- O fluxo percorrido pode ser identificado.
  
- O resultado do atendimento pode ser registrado.
  
- O registro respeita as regras de proteção de dados.

## US16 — Analisar casos para aprimoramento

**Como** responsável pelo sistema

**Quero** analisar os atendimentos realizados

**Para** identificar novos padrões, dúvidas e situações que não estavam contempladas na base.

### Critérios de aceitação:

- Os atendimentos podem ser consultados para análise.

- É possível identificar casos semelhantes.

- É possível identificar perguntas que não foram solucionadas.

- É possível identificar casos que exigiram atendimento presencial.

- Casos relevantes podem ser selecionados para avaliação.

## US17 — Incorporar novos conhecimentos à base

**Como** responsável pelo sistema

**Quero** incorporar novos conhecimentos validados à base

**Para** melhorar a capacidade do chatbot de solucionar problemas futuros.

### Critérios de aceitação:

- Um caso pode ser selecionado para incorporação.
  
- O conteúdo passa por validação antes de ser utilizado.
  
- O novo conhecimento pode ser associado a uma categoria.
  
- O novo conhecimento pode ser associado a um fluxo.
  
- É possível identificar a origem do conhecimento incorporado.
  
- Informações não validadas não são utilizadas como orientação oficial.

## US18 — Identificar utilização de IA

**Como** consumidor

**Quero** saber quando uma resposta recebeu auxílio de IA

**Para** ter transparência sobre a forma como a resposta foi produzida.

### Critérios de aceitação:

- O sistema identifica quando IA foi utilizada.
  
- O consumidor é informado conforme a regra definida pelo projeto.
  
- A informação não interfere na compreensão da orientação.

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

| ID      | Requisito       | User Story | Tarefa                                                    | Prioridade |
|---------|-----------------|------------|-----------------------------------------------------------|------------|
| ABP-001 | RP02/RP03       | —	         | Definir arquitetura geral da aplicação	                   | Alta       |
| ABP-002	| RP02            |	—	         | Definir tecnologia e estrutura do backend                 | Alta       |
| ABP-003	| RP03            | —	         | Definir separação entre chatbot, fluxos e integração	     | Alta       |
| ABP-004	| RNF06	          | —	         | Configurar ambiente Docker	                               | Alta       |
| ABP-005	| RNF08	          | —	         | Configurar repositório e estratégia de versionamento	     | Alta       |
| ABP-006	| RNF08	          | —	         | Definir padrão de branches e GitHub Flow	                 | Alta       |
| ABP-007	| RNF08	          | —	         | Configurar estrutura inicial de CI	                       | Média      |
| ABP-008	| RP03	          | —	         | Criar estrutura inicial do backend	                       | Alta       |
| ABP-009	| —	              | —	         | Configurar variáveis de ambiente	                         | Alta       |
| ABP-010	| —	              | —	         | Configurar banco de dados                                 | Alta       |
| ABP-011	| —	              | —	         | Criar estrutura inicial do frontend                       | Alta       |
| ABP-012	| RF01	          | US01	     | Definir layout da interface simulada do WhatsApp	         | Alta       |
| ABP-013	| RF01	          | US01	     | Criar cabeçalho da interface de conversa	                 | Média      |
| ABP-014	| RF01	          | US01	     | Criar componente de mensagens enviadas	                   | Alta       |
| ABP-015	| RF01	          | US01	     | Criar componente de mensagens recebidas                   | Alta       |
| ABP-016	| RF01	          | US01	     | Criar campo de entrada de mensagens                       | Alta       |
| ABP-017	| RF01	          | US01	     | Criar botão de envio de mensagens                         | Alta       |
| ABP-018	| RF01	          | US01	     | Implementar histórico visual da conversa	                 | Média      |
| ABP-019	| RF01	          | US01	     | Implementar comunicação da interface com o backend	       | Alta       |
| ABP-020	| RP01	          | US03	     | Definir estratégia de integração com a API do WhatsApp	   | Alta       |
| ABP-021	| RP01	          | US03	     | Configurar ambiente de testes da API do WhatsApp	         | Alta       |
| ABP-022	| RP01	          | US03	     | Configurar recebimento de mensagens                       | Alta       |
| ABP-023	| RP01	          | US03	     | Configurar envio de mensagens                             | Alta       |
| ABP-024	| RP01	          | US03	     | Criar tratamento de mensagens recebidas                   | Alta       |
| ABP-025	| RF01	          | US02	     | Criar modelo de usuário                                   | Alta       |
| ABP-026	| RF01	          | US02	     | Criar modelo de sessão	                                   | Alta       |
| ABP-027	| RF01	          | US02	     | Implementar criação de sessão                             | Alta       |
| ABP-028	| RF01	          | US02	     | Implementar recuperação de sessão                         | Alta       |
| ABP-029	| RF01	          | US02	     | Associar mensagens às sessões                             | Alta       |
| ABP-030	| RF02	          | US03	     | Definir categorias iniciais de problemas	                 | Alta       |
| ABP-031	| RF02	          | US03	     | Criar estrutura de categorias no banco	                   | Alta       |
| ABP-032	| RF02	          | US03	     | Implementar consulta de categorias	                       | Alta       |
| ABP-033	| RF02	          | US03	     | Implementar apresentação das categorias no chatbot	       | Alta       |
| ABP-034	| RF02/RF03	      | US04	     | Definir estrutura dos fluxos decisórios                   | Alta       |
| ABP-035	| RF02/RF03	      | US04	     | Criar modelo de perguntas                                 | Alta       |
| ABP-036	| RF02/RF03	      | US04	     | Criar modelo de alternativas	                             | Alta       |
| ABP-037	| RF03	          | US04	     | Implementar transição entre etapas do fluxo               | Alta       |
| ABP-038	| RF03	          | US04	     | Implementar controle do estado do fluxo                   | Alta       |
| ABP-039	| RF03	          | US05	     | Implementar perguntas condicionais	                       | Alta       |
| ABP-040	| RF03	          | US05	     | Implementar seleção da próxima pergunta                   | Alta       |
| ABP-041	| RF02	          | US07	     | Analisar documento de Dúvidas Frequentes	                 | Alta       |
| ABP-042	| RF02	          | US07	     | Identificar categorias existentes no documento	           | Alta       |
| ABP-043	| RF02	          | US07	     | Estruturar perguntas e respostas do documento             | Alta       |
| ABP-044	| RF02	          | US07	     | Estruturar documentos necessários                         | Alta       |
| ABP-045	| RF02/RF03	      | US07	     | Inserir conteúdo inicial na base de conhecimento	         | Alta       |
| ABP-046	| RF02/RF03	      | US07	     | Validar conteúdo importado da base	                       | Alta       |
| ABP-047	| RF01/RF02/RF03	| US01–US05	 | Integrar interface, backend e chatbot                     | Alta       |
| ABP-048	| RNF01	          | US01–US05	 | Revisar linguagem das mensagens do chatbot	               | Alta       |
| ABP-049	| RNF04	          | US01	     | Implementar aviso de caráter orientativo	                 | Alta       |
| ABP-050	| RNF08	          | US01–US05	 | Criar testes do primeiro fluxo	                           | Alta       |
| ABP-051	| RF12/RP09	      | US15–US17	 | Definir estratégia de aprendizado com os atendimentos     | Média      |
| ABP-052	| RF12	          | US15	     | Definir estrutura de dados para registro dos atendimentos | Média      |
| ABP-053	| RF12	          | US16	     | Definir critérios para seleção de casos relevantes        | Média      |
| ABP-054	| RF12/RNF03	    | US17	     | Definir processo de validação de novos conhecimentos      | Média      |

---

## Sprint 2 — Orientação e atendimento presencial

| ID      | Requisito         | User Story | Tarefa                                                             | Prioridade |
|---------|-------------------|------------|--------------------------------------------------------------------|------------|
| ABP-051	| RF04	            | US12	     | Definir estrutura da orientação final                              |	Alta       |
| ABP-052	| RF04	            | US12	     | Criar modelo de orientação	                                        | Alta       |
| ABP-053	| RF04	            | US12	     | Associar orientação aos fluxos	                                    | Alta       |
| ABP-054	| RF04	            | US12	     | Implementar geração da orientação consolidada	                    | Alta       |
| ABP-055	| RF04	            | US13	     | Criar estrutura dos próximos passos	                              | Alta       |
| ABP-056	| RF04	            | US13	     | Associar próximos passos aos fluxos	                              | Alta       |
| ABP-057	| RF04	            | US13	     | Implementar apresentação dos próximos passos	                      | Alta       |
| ABP-058	| RF04	            | US11	     | Implementar identificação de casos fora do escopo	                | Alta       |
| ABP-059	| RF04	            | US11	     | Criar mensagens para casos fora do escopo	                        | Alta       |
| ABP-060	| RF07	            | US18	     | Implementar identificação de necessidade de atendimento presencial	| Alta       |
| ABP-061	| RF07	            | US18	     | Criar fluxo de encaminhamento para agendamento	                    | Alta       |
| ABP-062	| RF07	            | US17	     | Criar modelo de documentos necessários	                            | Alta       |
| ABP-063	| RF07	            | US17	     | Associar documentos aos fluxos	                                    | Alta       |
| ABP-064	| RF07	            | US17	     | Implementar apresentação dos documentos no chatbot	                | Alta       |
| ABP-065	| RF07	            | US19	     | Criar página de agendamento	                                      | Alta       |
| ABP-066	| RF07	            | US19	     | Criar formulário de atendimento	                                  | Alta       |
| ABP-067	| RF07	            | US20	     | Criar modelo de disponibilidade	                                  | Alta       |
| ABP-068	| RF07	            | US20	     | Criar cadastro de horários disponíveis  	                          | Alta       |
| ABP-069	| RF07	            | US20	     | Implementar consulta de horários disponíveis	                      | Alta       |
| ABP-070	| RF07	            | US20	     | Implementar seleção de data	                                      | Alta       |
| ABP-071	| RF07	            | US20	     | Implementar seleção de horário	                                    | Alta       |
| ABP-072	| RF07	            | US21	     | Criar modelo de agendamento	                                      | Alta       |
| ABP-073	| RF07	            | US21	     | Implementar registro do agendamento	                              | Alta       |
| ABP-074	| RF07	            | US21	     | Implementar validação de disponibilidade	                          | Alta       |
| ABP-075	| RF07	            | US21	     | Impedir conflitos de horário	                                      | Alta       |
| ABP-076	| RF07	            | US22	     | Implementar confirmação do agendamento	                            | Alta       |
| ABP-077	| RF07	            | US22	     | Exibir documentos na confirmação	                                  | Alta       |
| ABP-078	| RF07	            | US23	     | Implementar consulta do agendamento	                              | Média      |
| ABP-079	| RF06	            | US28	     | Definir estrutura de registro das interações	                      | Alta       |
| ABP-080	| RF06	            | US28	     | Criar modelo de interação	                                        | Alta       |
| ABP-081	| RF06	            | US28	     | Registrar mensagens da conversa	                                  | Alta       |
| ABP-082	| RF06	            | US28	     | Registrar fluxo percorrido	                                        | Alta       |
| ABP-083	| RF06	            | US28	     | Registrar encaminhamentos	                                        | Alta       |
| ABP-084	| RF06	            | US29	     | Criar contagem dos fluxos utilizados	                              | Média      |
| ABP-085	| RF06	            | US30	     | Criar contagem dos encaminhamentos	                                | Média      |
| ABP-086	| RNF01             | US12–US23	 | Revisar usabilidade do fluxo de atendimento	                      | Alta       |
| ABP-087	| RNF02             | US01–US23	 | Avaliar tempo de resposta das conversas	                          | Alta       |
| ABP-088	| RNF08             | US12–US23	 | Criar testes dos fluxos de orientação	                            | Alta       |
| ABP-089	| RNF08             | US19–US23	 | Criar testes do módulo de agendamento	                            | Alta       |
| ABP-090	| RF01–RF07         | US01–US23	 | Realizar teste integrado do fluxo completo	                        | Alta       |

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
