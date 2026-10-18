
from pathlib import Path

import joblib


RAIZ_PROJETO = Path(__file__).resolve().parents[2]

ARQUIVO_MODELO = (
    RAIZ_PROJETO / "models" / "classificador_intencoes.joblib"
)


class ClassificadorIntencoes:

    def __init__(self):
        if not ARQUIVO_MODELO.exists():
            raise FileNotFoundError(
                "Modelo não encontrado. Execute primeiro "
                "chatbot/ia/treinar_modelo.py."
            )

        self.modelo = joblib.load(ARQUIVO_MODELO)

    def classificar(self, texto: str):
        if not texto or not texto.strip():
            raise ValueError("A mensagem não pode estar vazia.")

        texto = texto.strip()

        intencao = self.modelo.predict([texto])[0]

        probabilidades = self.modelo.predict_proba([texto])[0]

        confianca = float(max(probabilidades))

        return {
            "texto": texto,
            "intencao": intencao,
            "confianca": round(confianca, 4)
        }
