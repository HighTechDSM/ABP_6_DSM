
import json
import os
from pathlib import Path

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from chatbot.engine import ChatbotEngine
from chatbot.ia.classificador import ClassificadorIntencoes
from chatbot.ia.busca_conhecimento import BuscaConhecimento
from chatbot.ia.assistente_local import AssistenteLocal

from api.routes import (
    router,
    configurar_engine,
    configurar_classificador,
    configurar_busca_conhecimento,
    configurar_assistente_local,
)


RAIZ_PROJETO = Path(__file__).resolve().parent


def carregar_dados():
    arquivo_fluxos = RAIZ_PROJETO / "data" / "flows.json"

    with open(arquivo_fluxos, "r", encoding="utf-8") as arquivo:
        return json.load(arquivo)


app = FastAPI(
    title="PROCON Chatbot API",
    description="API do chatbot inteligente do projeto ABP",
    version="0.4.0",
)


# Origens autorizadas para a interface web (separadas por vírgula).
# Não use * em produção: configure os domínios reais do frontend.
origens = [
    origem.strip()
    for origem in os.getenv(
        "FRONTEND_ORIGINS",
        "http://localhost:5173,http://127.0.0.1:5173",
    ).split(",")
    if origem.strip()
]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origens,
    allow_credentials=False,
    allow_methods=["GET", "POST"],
    allow_headers=["Content-Type"],
)


# 1. Carrega os fluxos do chatbot
dados = carregar_dados()
engine = ChatbotEngine(dados)
configurar_engine(engine)


# 2. Configura o classificador de intenções
classificador = ClassificadorIntencoes()
configurar_classificador(classificador)


# 3. Configura a busca na base de conhecimento
busca = BuscaConhecimento()
configurar_busca_conhecimento(busca)


# 4. Configura o assistente com IA local
assistente = AssistenteLocal(buscador_conhecimento=busca)
configurar_assistente_local(assistente)


# 5. Registra as rotas
app.include_router(router)


@app.get("/")
def raiz():
    return {
        "mensagem": "PROCON Chatbot API funcionando!",
        "versao": "0.4.0",
        "servicos": {
            "chatbot": "configurado",
            "classificador_ia": "configurado",
            "busca_conhecimento": "configurada",
            "assistente_local": "configurado",
        },
    }


@app.get("/ia/status")
def status_ia():
    return {
        "assistente": "configurado",
        "modelo": assistente.modelo,
        "provedor": "Ollama local",
        "observacao": (
            "Este status confirma a configuração da API, "
            "mas não verifica se o Ollama está em execução."
        ),
    }
