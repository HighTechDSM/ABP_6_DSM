from chatbot.session import Session


class ChatbotEngine:

    def __init__(self, dados):
        self.dados = dados
        self.categorias = dados["categorias"]

    def criar_sessao(self, session_id: str):
        return Session(session_id=session_id)

    def obter_mensagem_inicial(self, sessao: Session):

        mensagem = self.dados["mensagem_inicial"]["texto"]

        sessao.adicionar_mensagem(
            "sistema",
            mensagem
        )

        aviso = self.dados["aviso"]["texto"]

        sessao.adicionar_mensagem(
            "sistema",
            aviso
        )

        opcoes = {}

        categorias = list(self.categorias.items())

        for indice, (chave, categoria) in enumerate(categorias, start=1):
            opcoes[str(indice)] = {
                "categoria": chave,
                "texto": categoria["nome"]
            }

        return {
            "tipo": "inicio",
            "mensagem": mensagem,
            "aviso": aviso,
            "opcoes": opcoes
        }

    def selecionar_categoria(
        self,
        sessao: Session,
        categoria: str
    ):

        if categoria not in self.categorias:
            raise ValueError("Categoria inválida.")

        dados_categoria = self.categorias[categoria]

        sessao.categoria = categoria
        sessao.pergunta_atual = dados_categoria["pergunta_inicial"]
        sessao.finalizada = False

        sessao.adicionar_mensagem(
            "sistema",
            f"Assunto selecionado: {dados_categoria['nome']}"
        )

        return self.obter_pergunta_atual(sessao)

    def obter_pergunta_atual(self, sessao: Session):

        if sessao.finalizada:
            return {
                "tipo": "final",
                "mensagem": "Esta conversa já foi finalizada."
            }

        if not sessao.categoria:
            return self.obter_mensagem_inicial(sessao)

        categoria = self.categorias[sessao.categoria]

        # Verifica se chegamos a um resultado final
        if sessao.pergunta_atual in categoria["resultados"]:

            resultado = categoria["resultados"][
                sessao.pergunta_atual
            ]

            sessao.finalizada = True

            sessao.adicionar_mensagem(
                "sistema",
                resultado["mensagem"]
            )

            return {
                "tipo": "final",
                "mensagem": resultado["mensagem"]
            }

        pergunta = categoria["perguntas"].get(
            sessao.pergunta_atual
        )

        if not pergunta:
            raise ValueError(
                "Pergunta atual não encontrada."
            )

        sessao.adicionar_mensagem(
            "sistema",
            pergunta["texto"]
        )

        return {
            "tipo": "pergunta",
            "id": sessao.pergunta_atual,
            "mensagem": pergunta["texto"],
            "opcoes": {
                chave: opcao["texto"]
                for chave, opcao in pergunta["opcoes"].items()
            }
        }

    def processar_resposta(
        self,
        sessao: Session,
        resposta: str
    ):

        if sessao.finalizada:
            return {
                "tipo": "final",
                "mensagem": "Esta conversa já foi finalizada."
            }

        if not sessao.categoria:
            raise ValueError(
                "É necessário selecionar uma categoria antes de responder."
            )

        categoria = self.categorias[sessao.categoria]

        pergunta = categoria["perguntas"].get(
            sessao.pergunta_atual
        )

        if not pergunta:
            raise ValueError(
                "Pergunta atual não encontrada."
            )

        if resposta not in pergunta["opcoes"]:
            return {
                "tipo": "erro",
                "mensagem": "Opção inválida. Escolha uma das opções disponíveis."
            }

        opcao = pergunta["opcoes"][resposta]

        sessao.adicionar_mensagem(
            "usuario",
            opcao["texto"]
        )

        sessao.pergunta_atual = opcao["proximo"]

        return self.obter_pergunta_atual(sessao)