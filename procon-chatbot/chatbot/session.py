from dataclasses import dataclass, field
from typing import Optional


@dataclass
class Session:
    session_id: str
    categoria: Optional[str] = None
    pergunta_atual: Optional[str] = None
    finalizada: bool = False
    historico: list = field(default_factory=list)

    def adicionar_mensagem(self, tipo: str, mensagem: str):
        if tipo not in ('sistema', 'usuario', 'assistente'):
            raise ValueError('Tipo de mensagem inválido.')
        if not isinstance(mensagem, str):
            raise ValueError('A mensagem deve ser texto.')
        self.historico.append({'tipo': tipo, 'mensagem': mensagem})

    def obter_historico(self):
        return list(self.historico)
