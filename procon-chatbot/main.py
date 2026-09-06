import json

from fastapi import FastAPI

from chatbot.engine import ChatbotEngine
from api.routes import router, configurar_engine


def carregar_dados():

    with open(
        "data/flows.json",
        "r",
        encoding="utf-8"
    ) as arquivo:

        return json.load(arquivo)


app = FastAPI(
    title="PROCON Chatbot API",
    description="API do chatbot inteligente do projeto ABP",
    version="0.1.0"
)


dados = carregar_dados()

engine = ChatbotEngine(dados)

configurar_engine(engine)

app.include_router(router)


@app.get("/")
def raiz():

    return {
        "mensagem": "PROCON Chatbot API funcionando!",
        "versao": "0.1.0"
    }