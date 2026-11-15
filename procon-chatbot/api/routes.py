from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

from chatbot.engine import ChatbotEngine
from chatbot.ia.classificador import ClassificadorIntencoes
from chatbot.ia.busca_conhecimento import BuscaConhecimento
from chatbot.ia.assistente_local import AssistenteLocal

router = APIRouter()
engine = None
classificador = None
buscador_conhecimento = None
assistente_local = None
sessoes = {}


class IniciarConversaRequest(BaseModel):
    session_id: str


class CategoriaRequest(BaseModel):
    session_id: str
    categoria: str


class MensagemRequest(BaseModel):
    session_id: str
    mensagem: str


class ClassificarTextoRequest(BaseModel):
    texto: str


class BuscarConhecimentoRequest(BaseModel):
    texto: str


class AtendimentoRequest(BaseModel):
    texto: str


def configurar_engine(instancia: ChatbotEngine):
    global engine
    engine = instancia


def configurar_classificador(instancia: ClassificadorIntencoes):
    global classificador
    classificador = instancia


def configurar_busca_conhecimento(instancia: BuscaConhecimento):
    global buscador_conhecimento
    buscador_conhecimento = instancia


def configurar_assistente_local(instancia: AssistenteLocal):
    global assistente_local
    assistente_local = instancia


def obter_sessao(session_id: str):
    if not session_id or not session_id.strip():
        raise HTTPException(status_code=400, detail='O identificador da sessão não pode estar vazio.')
    sessao = sessoes.get(session_id)
    if sessao is None:
        raise HTTPException(status_code=404, detail='Sessão não encontrada. Inicie uma conversa primeiro.')
    return sessao


@router.post('/chat/iniciar')
def iniciar_conversa(dados: IniciarConversaRequest):
    if engine is None:
        raise HTTPException(status_code=500, detail='Chatbot não configurado.')
    if not dados.session_id.strip():
        raise HTTPException(status_code=400, detail='O identificador da sessão não pode estar vazio.')
    sessao = engine.criar_sessao(dados.session_id)
    sessoes[dados.session_id] = sessao
    return engine.obter_mensagem_inicial(sessao)


@router.post('/chat/categoria')
def selecionar_categoria(dados: CategoriaRequest):
    if engine is None:
        raise HTTPException(status_code=500, detail='Chatbot não configurado.')
    sessao = obter_sessao(dados.session_id)
    try:
        return engine.selecionar_categoria(sessao, dados.categoria)
    except ValueError as erro:
        raise HTTPException(status_code=400, detail=str(erro)) from erro


@router.post('/chat/mensagem')
def enviar_mensagem(dados: MensagemRequest):
    """Entrada unificada: opções do fluxo ou pergunta livre para a IA."""
    if engine is None:
        raise HTTPException(status_code=500, detail='Chatbot não configurado.')

    sessao = obter_sessao(dados.session_id)
    mensagem = dados.mensagem.strip()
    if not mensagem:
        raise HTTPException(status_code=400, detail='A mensagem não pode estar vazia.')

    # Sem categoria: números do menu inicial selecionam o fluxo correspondente.
    if not sessao.categoria and not sessao.finalizada:
        categorias = list(engine.categorias.keys())
        if mensagem.isdecimal() and 1 <= int(mensagem) <= len(categorias):
            try:
                sessao.adicionar_mensagem('usuario', mensagem)
                resultado = engine.selecionar_categoria(sessao, categorias[int(mensagem) - 1])
                return {'session_id': sessao.session_id, 'modo': 'fluxo', **resultado}
            except ValueError as erro:
                raise HTTPException(status_code=400, detail=str(erro)) from erro

    # Com categoria ativa: apenas opções existentes avançam no fluxo.
    if sessao.categoria and not sessao.finalizada:
        categoria = engine.categorias[sessao.categoria]
        pergunta = categoria['perguntas'].get(sessao.pergunta_atual)
        if pergunta and mensagem in pergunta['opcoes']:
            try:
                resultado = engine.processar_resposta(sessao, mensagem)
                return {'session_id': sessao.session_id, 'modo': 'fluxo', **resultado}
            except ValueError as erro:
                raise HTTPException(status_code=400, detail=str(erro)) from erro

    # Uma opção numérica inválida não deve ser interpretada como dúvida jurídica.
    if mensagem.isdecimal():
        return {
            'session_id': sessao.session_id,
            'modo': 'fluxo',
            'tipo': 'erro',
            'mensagem': 'Opção inválida. Escolha uma opção disponível ou escreva sua dúvida.',
        }

    if assistente_local is None:
        raise HTTPException(status_code=503, detail='Assistente local não configurado.')

    try:
        resultado = assistente_local.responder(mensagem)
    except ValueError as erro:
        raise HTTPException(status_code=400, detail=str(erro)) from erro
    except RuntimeError as erro:
        raise HTTPException(status_code=503, detail=str(erro)) from erro

    # Perguntas livres não alteram categoria/pergunta_atual; o fluxo pode continuar.
    sessao.adicionar_mensagem('usuario', mensagem)
    sessao.adicionar_mensagem('assistente', resultado['resposta'])
    return {'session_id': sessao.session_id, 'modo': 'ia', 'tipo': 'atendimento', **resultado}


@router.post('/ia/classificar')
def classificar_mensagem(dados: ClassificarTextoRequest):
    if classificador is None:
        raise HTTPException(status_code=500, detail='Classificador de IA não configurado.')
    try:
        resultado = classificador.classificar(dados.texto)
        return {'mensagem': 'Classificação realizada.', 'intencao': resultado['intencao'], 'confianca': resultado['confianca']}
    except ValueError as erro:
        raise HTTPException(status_code=400, detail=str(erro)) from erro


@router.post('/ia/buscar-conhecimento')
def buscar_conhecimento_endpoint(dados: BuscarConhecimentoRequest):
    if buscador_conhecimento is None:
        raise HTTPException(status_code=500, detail='Busca de conhecimento não configurada.')
    try:
        return buscador_conhecimento.buscar(dados.texto)
    except ValueError as erro:
        raise HTTPException(status_code=400, detail=str(erro)) from erro


@router.post('/ia/atendimento')
def atendimento_com_ia(dados: AtendimentoRequest):
    if assistente_local is None:
        raise HTTPException(status_code=503, detail='Assistente local não configurado. Verifique a inicialização da aplicação.')
    try:
        return assistente_local.responder(dados.texto)
    except ValueError as erro:
        raise HTTPException(status_code=400, detail=str(erro)) from erro
    except RuntimeError as erro:
        raise HTTPException(status_code=503, detail=str(erro)) from erro


@router.post('/chat/atendimento')
def atendimento_por_sessao(dados: MensagemRequest):
    sessao = obter_sessao(dados.session_id)
    if assistente_local is None:
        raise HTTPException(status_code=503, detail='Assistente local não configurado.')
    if not dados.mensagem or not dados.mensagem.strip():
        raise HTTPException(status_code=400, detail='A mensagem não pode estar vazia.')
    try:
        resultado = assistente_local.responder(dados.mensagem)
    except ValueError as erro:
        raise HTTPException(status_code=400, detail=str(erro)) from erro
    except RuntimeError as erro:
        raise HTTPException(status_code=503, detail=str(erro)) from erro
    # Registra apenas após atendimento bem-sucedido; não altera o estado do fluxo guiado.
    sessao.adicionar_mensagem('usuario', dados.mensagem.strip())
    sessao.adicionar_mensagem('assistente', resultado['resposta'])
    return {'session_id': sessao.session_id, **resultado}


@router.get('/chat/historico/{session_id}')
def consultar_historico(session_id: str):
    sessao = obter_sessao(session_id)
    return {
        'session_id': sessao.session_id,
        'categoria': sessao.categoria,
        'finalizada': sessao.finalizada,
        'historico': sessao.obter_historico(),
    }
