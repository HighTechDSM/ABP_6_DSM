from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

from chatbot.engine import ChatbotEngine


router = APIRouter()


class IniciarConversaRequest(BaseModel):
    session_id: str


class MensagemRequest(BaseModel):
    session_id: str
    mensagem: str


sessoes = {}

engine = None


def configurar_engine(chatbot_engine: ChatbotEngine):
    global engine
    engine = chatbot_engine


@router.post("/chat/iniciar")
def iniciar_conversa(
    dados: IniciarConversaRequest
):

    if engine is None:
        raise HTTPException(
            status_code=500,
            detail="Chatbot não configurado."
        )

    sessao = engine.criar_sessao(
        dados.session_id
    )

    resposta = engine.obter_mensagem_inicial(
        sessao
    )

    sessoes[dados.session_id] = sessao

    return resposta


@router.post("/chat/categoria")
def selecionar_categoria(
    dados: MensagemRequest
):

    if engine is None:
        raise HTTPException(
            status_code=500,
            detail="Chatbot não configurado."
        )

    sessao = sessoes.get(
        dados.session_id
    )

    if sessao is None:
        raise HTTPException(
            status_code=404,
            detail="Sessão não encontrada."
        )

    # Converte a opção numérica escolhida pelo usuário
    # para a categoria correspondente.
    categorias = list(engine.categorias.items())

    indice = dados.mensagem

    try:
        indice = int(indice)
    except ValueError:
        raise HTTPException(
            status_code=400,
            detail="A categoria deve ser escolhida através de um número."
        )

    if indice < 1 or indice > len(categorias):
        raise HTTPException(
            status_code=400,
            detail="Opção de categoria inválida."
        )

    categoria = categorias[indice - 1][0]

    try:

        resposta = engine.selecionar_categoria(
            sessao,
            categoria
        )

        return resposta

    except ValueError as erro:

        raise HTTPException(
            status_code=400,
            detail=str(erro)
        )


@router.post("/chat/mensagem")
def enviar_mensagem(
    dados: MensagemRequest
):

    if engine is None:
        raise HTTPException(
            status_code=500,
            detail="Chatbot não configurado."
        )

    sessao = sessoes.get(
        dados.session_id
    )

    if sessao is None:
        raise HTTPException(
            status_code=404,
            detail="Sessão não encontrada."
        )

    resposta = engine.processar_resposta(
        sessao,
        dados.mensagem
    )

    return resposta