
from chatbot.ia.busca_conhecimento import BuscaConhecimento

busca = BuscaConhecimento()

perguntas_teste = [
    "Estão cobrando um seguro que nunca contratei",
    "Quite meu empréstimo, mas continuam descontando do salário",
    "Comprei pela internet e meu produto veio com problema",
    "Quero saber a previsão do tempo"
]

for pergunta in perguntas_teste:
    resultado = busca.buscar(pergunta)

    print("\nPergunta:", pergunta)
    print("Encontrado:", resultado["encontrado"])
    print("Similaridade:", resultado["similaridade"])

    if resultado["encontrado"]:
        print("FAQ:", resultado["id"])
        print("Resposta:", resultado["resposta"])
    else:
        print("Mensagem:", resultado["mensagem"])
