
import json
from pathlib import Path

import joblib
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import classification_report
from sklearn.model_selection import train_test_split
from sklearn.pipeline import Pipeline


# Raiz da pasta procon-chatbot
RAIZ_PROJETO = Path(__file__).resolve().parents[2]

ARQUIVO_DADOS = (
    RAIZ_PROJETO / "data" / "exemplos_intencoes.json"
)

PASTA_MODELOS = RAIZ_PROJETO / "models"

ARQUIVO_MODELO = (
    PASTA_MODELOS / "classificador_intencoes.joblib"
)


def carregar_exemplos():
    with open(ARQUIVO_DADOS, "r", encoding="utf-8") as arquivo:
        dados = json.load(arquivo)

    textos = [item["texto"] for item in dados]
    intencoes = [item["intencao"] for item in dados]

    if not textos:
        raise ValueError("O arquivo de treinamento está vazio.")

    if len(set(intencoes)) < 2:
        raise ValueError(
            "São necessárias pelo menos duas categorias."
        )

    return textos, intencoes


def treinar():
    textos, intencoes = carregar_exemplos()

    # Separar exemplos para avaliar o modelo com frases
    # que ele não usou diretamente durante o treinamento.
    X_treino, X_teste, y_treino, y_teste = train_test_split(
        textos,
        intencoes,
        test_size=0.25,
        random_state=42,
        stratify=intencoes
    )

    modelo = Pipeline([
        (
            "tfidf",
            TfidfVectorizer(
                lowercase=True,
                strip_accents="unicode",
                ngram_range=(1, 2)
            )
        ),
        (
            "classificador",
            LogisticRegression(
                max_iter=1000,
                class_weight="balanced",
                random_state=42
            )
        )
    ])

    modelo.fit(X_treino, y_treino)

    previsoes = modelo.predict(X_teste)

    print("\n=== Avaliação inicial do modelo ===")
    print(
        classification_report(
            y_teste,
            previsoes,
            zero_division=0
        )
    )

    PASTA_MODELOS.mkdir(parents=True, exist_ok=True)
    joblib.dump(modelo, ARQUIVO_MODELO)

    print(f"\nModelo salvo em: {ARQUIVO_MODELO}")
    print(f"Exemplos usados no treinamento: {len(X_treino)}")
    print(f"Exemplos usados na avaliação: {len(X_teste)}")


if __name__ == "__main__":
    treinar()
