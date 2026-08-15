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
  <img src="https://skillicons.dev/icons?i=git,github,figma,vscode" />
</p>

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
**Como**: consumidor

**Quero**: iniciar uma conversa pelo WhatsApp

**Para**: obter orientação sobre um problema de consumo sem precisar comparecer inicialmente ao PROCON.

### Critérios de aceitação
- O usuário consegue enviar uma mensagem ao chatbot.
- O sistema identifica uma nova sessão de atendimento.
- O chatbot apresenta uma mensagem inicial.
- O chatbot informa que possui caráter orientativo.
- O usuário consegue iniciar o fluxo de atendimento.

## US02 — Identificar usuário e sessão

**Como**: consumidor

**Quero**: que o sistema reconheça minha sessão de atendimento

**Para**: continuar minha conversa sem perder o contexto das informações já fornecidas.

### Critérios de aceitação
- O sistema identifica o usuário através da integração com o WhatsApp.
- O sistema cria uma sessão para um novo atendimento.
- O sistema associa as mensagens à sessão correspondente.
- O sistema mantém o estado atual do fluxo.
- Uma nova sessão pode ser iniciada quando o atendimento anterior for encerrado.

## US03 — Apresentar opções de atendimento
**Como**: consumidor

**Quero**: visualizar opções de problemas de consumo

**Para**: identificar o assunto que mais se aproxima da minha situação.

### Critérios de aceitação
- O chatbot apresenta opções de atendimento.
- As opções são apresentadas em linguagem clara.
- As opções estão relacionadas aos fluxos cadastrados.
- O usuário consegue selecionar uma das opções.
- A seleção direciona o usuário para o fluxo correspondente.

## US04 — Navegar pelo fluxo decisório
**Como**: consumidor

**Quero**: responder perguntas apresentadas pelo chatbot

**Para**: identificar o fluxo correspondente ao meu problema.

### Critérios de aceitação
- O sistema apresenta uma pergunta.
- O usuário recebe opções de resposta.
- Cada opção direciona para o próximo passo correto.
- O sistema mantém o estado da conversa.
- O fluxo termina em uma orientação ou encaminhamento.

## US05 — Apresentar perguntas condicionais
**Como**: consumidor

**Quero**: receber perguntas relacionadas às minhas respostas anteriores

**Para**: que o atendimento seja direcionado especificamente ao meu problema.

### Critérios de aceitação
- O sistema considera a resposta fornecida pelo usuário.
- A próxima pergunta é determinada pelo fluxo decisório.
- Perguntas irrelevantes para o caso não são apresentadas.
- O sistema consegue percorrer diferentes caminhos dentro de um mesmo fluxo.
- O fluxo chega ao encaminhamento correspondente à combinação de respostas.

## US06 — Reiniciar ou corrigir o fluxo
**Como**: consumidor

**Quero**: corrigir uma resposta ou reiniciar meu atendimento

**Para**: continuar o atendimento caso tenha selecionado uma opção incorretamente.

### Critérios de aceitação

- O usuário consegue solicitar o reinício do atendimento.
- O sistema retorna ao início do fluxo quando solicitado.
- O usuário consegue iniciar uma nova consulta.
- O reinício não interfere nas demais sessões de outros usuários.
- O sistema informa ao usuário que o fluxo foi reiniciado.

## US07 — Cadastrar categorias de atendimento
**Como**: administrador

**Quero**: cadastrar categorias de problemas de consumo

**Para**: organizar os assuntos que poderão ser consultados pelo chatbot.

### Critérios de aceitação

- O administrador consegue cadastrar uma categoria.
- O administrador consegue alterar uma categoria.
- O administrador consegue desativar uma categoria.
- As categorias disponíveis são apresentadas ao consumidor.
- Categorias desativadas não aparecem para novos atendimentos.

## US08 — Cadastrar perguntas e respostas

**Como**: administrador

**Quero**: cadastrar perguntas e respostas na base de conhecimento

**Para**: fornecer ao chatbot informações previamente definidas pelo PROCON.

### Critérios de aceitação

- O administrador consegue cadastrar uma pergunta.
- O administrador consegue cadastrar a resposta correspondente.
- A pergunta pode ser associada a uma categoria.
- A informação cadastrada pode ser utilizada pelo chatbot.
- O sistema impede o cadastro de informações obrigatórias incompletas.

## US09 — Cadastrar fluxos decisórios

**Como**: administrador

**Quero**: cadastrar os fluxos decisórios do PROCON

**Para**: permitir que o chatbot conduza o consumidor por diferentes caminhos de atendimento.

### Critérios de aceitação

- O administrador consegue criar um fluxo.
- O fluxo possui perguntas e alternativas.
- Cada alternativa pode direcionar para outra etapa.
- O fluxo pode terminar em uma orientação.
- O fluxo pode terminar em um encaminhamento para atendimento presencial.
- O fluxo pode ser ativado ou desativado.

## US10 — Atualizar a base de conhecimento

**Como**: administrador

**Quero**: atualizar perguntas, respostas e orientações

**Para**: manter as informações utilizadas pelo chatbot atualizadas sem alterar o código da aplicação.

### Critérios de aceitação

- O administrador consegue editar informações cadastradas.
- As alterações ficam disponíveis para novos atendimentos.
- O sistema mantém as informações organizadas por categoria.
- Informações desativadas deixam de ser utilizadas nos novos fluxos.
- A alteração da base não exige alteração no código-fonte.

## US11 — Identificar casos fora do escopo

**Como**: consumidor

**Quero**: ser informado quando meu problema não estiver dentro do escopo de atuação do PROCON

**Para**: saber que o chatbot não poderá fornecer uma orientação sobre aquele caso.

### Critérios de aceitação
- O fluxo consegue identificar situações fora do escopo.
- O sistema informa claramente que o caso não está dentro do escopo.
- O sistema não apresenta uma orientação como se fosse aplicável ao caso.
- Quando apropriado, o sistema apresenta uma orientação sobre o próximo caminho a seguir.

US12 — Receber orientação consolidada
Como: consumidor
Quero: receber uma orientação consolidada ao final do fluxo
Para: entender quais medidas posso tomar em relação ao meu problema.

Critérios de aceitação
O sistema apresenta um resumo do problema identificado.
Apresenta a orientação correspondente.
Apresenta os próximos passos.
A orientação é baseada no fluxo percorrido.
O sistema informa quando o caso necessita de atendimento presencial.

US13 — Receber próximos passos
Como: consumidor
Quero: saber quais são os próximos passos recomendados
Para: saber o que devo fazer depois de receber a orientação.

Critérios de aceitação
O sistema apresenta uma sequência clara de próximos passos.
Os passos estão relacionados ao fluxo percorrido.
A orientação não apresenta ações incompatíveis com o fluxo.
Quando necessário, o sistema orienta o usuário a procurar atendimento presencial.

US14 — Receber explicação textual
Como: consumidor
Quero: receber uma explicação clara sobre a orientação apresentada
Para: compreender melhor o resultado do meu atendimento.

Critérios de aceitação
A explicação utiliza linguagem acessível.
A explicação mantém o significado da orientação oficial.
A explicação não cria novas recomendações fora do fluxo definido.
A resposta não possui caráter jurídico vinculante.
O usuário consegue compreender a relação entre seu problema e a orientação apresentada.

US15 — Identificar utilização de IA
Como: consumidor
Quero: saber quando uma resposta recebeu auxílio de um modelo de linguagem
Para: ter transparência sobre a forma como a resposta foi produzida.

Critérios de aceitação
O sistema identifica quando a resposta recebeu auxílio de IA.
A identificação é apresentada de maneira clara.
A informação não é confundida com uma validação jurídica.
A utilização da IA não altera os limites definidos pelo fluxo decisório.

US16 — Informar caráter orientativo
Como: consumidor
Quero: ser informado de que as respostas possuem caráter orientativo
Para: compreender que o chatbot não substitui o atendimento formal do PROCON.

Critérios de aceitação
O chatbot informa seu caráter orientativo.
A informação é apresentada de maneira compreensível.
O sistema não apresenta a resposta como decisão jurídica.
O usuário é orientado a procurar atendimento formal quando necessário.

US17 — Consultar documentos necessários
Como: consumidor
Quero: saber quais documentos devo apresentar
Para: chegar ao atendimento presencial com a documentação adequada.

Critérios de aceitação
O sistema identifica os documentos associados ao fluxo.
Apresenta os documentos de maneira organizada.
Informa que documentos adicionais podem ser solicitados.
Permite continuar para o agendamento.


US18 — Identificar necessidade de atendimento presencial
Como: consumidor
Quero: saber quando preciso comparecer ao PROCON
Para: entender quando a orientação pelo chatbot não é suficiente.

Critérios de aceitação
O fluxo pode indicar necessidade de atendimento presencial.
O chatbot explica o motivo do encaminhamento quando possível.
O sistema apresenta a opção de agendamento.
O usuário recebe orientação sobre os documentos necessários.
Agendamento

US19 — Solicitar atendimento presencial
Como: consumidor
Quero: solicitar atendimento presencial
Para: resolver um problema que não foi solucionado pelo chatbot.

Critérios de aceitação
O usuário consegue escolher a opção de atendimento presencial.
O sistema identifica o motivo do encaminhamento.
O sistema inicia o processo de agendamento.
O usuário recebe as orientações necessárias para prosseguir.

US20 — Consultar horários disponíveis
Como: consumidor
Quero: visualizar os horários disponíveis
Para: escolher uma data e horário para meu atendimento.

Critérios de aceitação
O sistema apresenta datas disponíveis.
O sistema apresenta horários disponíveis.
Horários já ocupados não podem ser selecionados.
O sistema permite selecionar uma opção disponível.

US21 — Realizar agendamento
Como: consumidor
Quero: escolher uma data e horário para atendimento
Para: agendar meu atendimento presencial no PROCON.

Critérios de aceitação
O usuário consegue selecionar um horário disponível.
O sistema registra o agendamento.
O sistema associa o agendamento ao usuário.
O sistema impede dois agendamentos para o mesmo horário quando não houver disponibilidade.
O sistema apresenta confirmação do agendamento.

US22 — Confirmar agendamento
Como: consumidor
Quero: receber a confirmação do meu agendamento
Para: ter certeza de que meu atendimento foi registrado.

Critérios de aceitação
O sistema informa que o agendamento foi realizado.
Apresenta data e horário.
Apresenta as informações necessárias para o comparecimento.
Apresenta os documentos necessários quando disponíveis.
O usuário consegue identificar seu agendamento posteriormente.

US23 — Consultar agendamento
Como: consumidor
Quero: consultar as informações do meu agendamento
Para: verificar data, horário e orientações antes do atendimento.

Critérios de aceitação
O usuário consegue consultar seu agendamento.
O sistema apresenta data e horário.
O sistema apresenta as orientações relacionadas ao atendimento.
O sistema apresenta os documentos necessários quando aplicável.

US24 — Visualizar atendimentos agendados
Como: funcionário do PROCON
Quero: visualizar os atendimentos agendados
Para: organizar e acompanhar os atendimentos presenciais.

Critérios de aceitação
O funcionário consegue acessar a lista de atendimentos.
Os atendimentos apresentam data e horário.
É possível identificar o consumidor associado.
Os atendimentos são organizados de maneira compreensível.
O funcionário consegue consultar os detalhes de um atendimento.

US25 — Consultar dados do atendimento
Como: funcionário do PROCON
Quero: consultar os dados relacionados ao atendimento
Para: compreender previamente a situação apresentada pelo consumidor.

Critérios de aceitação
O funcionário consegue selecionar um atendimento.
O sistema apresenta os dados necessários para o atendimento.
O sistema apresenta o motivo do encaminhamento.
O sistema apresenta as informações permitidas sobre o fluxo percorrido.
Dados não autorizados não são apresentados.

US26 — Gerenciar disponibilidade
Como: funcionário do PROCON
Quero: gerenciar os horários disponíveis para atendimento
Para: disponibilizar horários adequados aos consumidores.

Critérios de aceitação
O funcionário consegue cadastrar disponibilidade.
O funcionário consegue bloquear horários.
Horários indisponíveis não aparecem para o consumidor.
O sistema evita conflito de horários.
Alterações de disponibilidade refletem nos novos agendamentos.

US27 — Acompanhar situação do agendamento
Como: funcionário do PROCON
Quero: visualizar a situação dos atendimentos agendados
Para: acompanhar os atendimentos previstos.

Critérios de aceitação
O sistema apresenta os agendamentos.
Cada agendamento possui uma situação.
O funcionário consegue identificar atendimentos futuros.
O funcionário consegue atualizar a situação quando permitido.

US28 — Registrar interação
Como: sistema
Quero: registrar as interações realizadas durante o atendimento
Para: manter informações necessárias para análise posterior dos fluxos utilizados.

Critérios de aceitação
As interações são registradas.
As interações são associadas à sessão correspondente.
O registro identifica o fluxo utilizado.
O sistema registra as etapas necessárias para análise.
O armazenamento respeita as regras de proteção de dados.

US29 — Identificar fluxos mais utilizados
Como: PROCON
Quero: identificar quais fluxos são mais utilizados pelos consumidores
Para: compreender quais tipos de dúvidas possuem maior demanda.

Critérios de aceitação
O sistema contabiliza os fluxos utilizados.
É possível identificar os fluxos mais acessados.
Os dados podem ser consultados pela equipe autorizada.
As informações são apresentadas de forma compreensível.

US30 — Identificar encaminhamentos presenciais
Como: PROCON
Quero: identificar quais fluxos geram mais encaminhamentos presenciais
Para: compreender quais situações não estão sendo solucionadas pelo atendimento automatizado.

Critérios de aceitação
O sistema registra quando um fluxo termina em encaminhamento.
O encaminhamento é associado ao fluxo correspondente.
É possível contabilizar os encaminhamentos.
Os dados podem ser utilizados para análise posterior.

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

| ID   | Requisito | User Story                              | Prioridade | Pontos |
|------|-----------|-----------------------------------------|------------|--------|
| US01 |	RF01	   | Iniciar atendimento pelo WhatsApp       |	Alta	    |        |
| US02 |	RF01     |	Identificar usuário e sessão           |	Alta	    |        |
| US03 |	RF02     |	Apresentar opções de atendimento       |	Alta	    |        | 
| US04 |	RF02     |	Cadastrar fluxo decisório              |	Alta	    |        |
| US05 |	RF03     |	Navegar pelo fluxo decisório           |	Alta	    |        |
| US06 |	RP03     |	Separar chatbot e fluxo decisório      |	Alta	    |        |
| US07 |	RNF06    |	Configurar Docker                      |	Alta	    |        |
| US08 |	RNF08    |	Configurar GitHub Flow/CI inicial      |	Alta	    |        |
| US09 |	RNF01    |	Definir padrão de linguagem do chatbot |	Alta	    |        |

---

## Sprint 2 — Orientação e atendimento presencial

| ID   | Requisito | User Story                                  | Prioridade | Pontos |
|------|-----------|---------------------------------------------|------------|--------|
| US10  |	RF04     |	Gerar orientação consolidada	             |  Alta      |        |
| US11 |	RF04     |	Apresentar próximos passos                 |  Alta      |	       |
| US12 |	RF06     |	Registrar interações                       |  Alta      |	       |
| US13 |	RF07     |	Encaminhar para atendimento presencial     |  Alta      |	       |
| US14 |	RF07     |	Consultar horários disponíveis             |	Alta      |	       |
| US15 |	RF07     |	Realizar agendamento                       |	Alta      |        |
| US16 |	RF07     |	Apresentar documentos necessários          |	Alta      |	       |
| US17 |	Base     |	Cadastrar perguntas e respostas frequentes |	Alta      |	       |
| US18 |	Base     |	Identificar casos fora do escopo do PROCON |	Alta      |        |

---

## Sprint 3 — Administração, segurança e entrega

| ID   | Requisito | User Story                                  | Prioridade | Pontos |
|------|-----------|---------------------------------------------|------------|--------|
| US19 |	RF08	   |  Visualizar agendamentos                    |	Alta      |	       |
| US20 |	RF08     |	Consultar dados do atendimento             |	Alta      |	       |
| US21 |	RNF03    |	Adequar tratamento de dados à LGPD         |	Alta      |	       |
| US22 |	RNF04    |	Informar caráter orientativo               |	Alta      |	       |
| US23 |	RNF05    |	Identificar uso de LLM                     |	Média     |	       |
| US24 |	RNF08    |	Implementar testes automatizados           |	Alta      |	       |
| US25 |	RNF08    |	Configurar CI/CD                           |	Média     |	       |
| US26 |	RNF07    |	Documentar instalação                      |	Alta      |	       |
| US27 |	RNF07    |	Documentar requisitos de hardware/software |	Alta      |	       |
| US28 |	RNF02    |	Avaliar tempo de resposta                  |	Alta      |	       |
| US29 |	RP01     |	Consolidar integração WhatsApp             |	Alta      |	       |
| US30 |	RNF08    |	Preparar documentação técnica final        |	Alta      |        |

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

|CARGO                | NOME                 | SOCIAL MEDIA                                                                                                          |
|---------------------|----------------------|:---------------------------------------------------------------------------------------------------------------------:|
| P.O (Product Owner) |   André Ventura      | <a target="_blank" href="https://github.com/AndreHVentura"><img  src="https://skillicons.dev/icons?i=github"></a>     |
| S.M (Scrum Master)  |   André Michel       | <a target="_blank" href="https://github.com/andremc331"><img  src="https://skillicons.dev/icons?i=github"></a>        |
| DEV. (Developer)    |   Bruno Henrique     | <a target="_blank" href="https://github.com/BrunoHenrique258"><img  src="https://skillicons.dev/icons?i=github"></a>  |
| DEV. (Developer)    |   Edlaine Souza      | <a target="_blank" href="https://github.com/edlaine-souza"><img  src="https://skillicons.dev/icons?i=github"></a>     |
| DEV. (Developer)    |   Luana Pinheiro     | <a target="_blank" href="https://github.com/Luana873"><img  src="https://skillicons.dev/icons?i=github"></a>          |
| DEV. (Developer)    |   Rodrigo de Andrade | <a target="_blank" href="https://github.com/RodrigodeAndrade90"><img  src="https://skillicons.dev/icons?i=github"></a>|
