
from chatbot.ia.classificador import ClassificadorIntencoes


classificador = ClassificadorIntencoes()

mensagens = [
    "Meu celular veio quebrado",
    "A encomenda está atrasada",
    "Estão cobrando uma conta que não reconheço",
    "Quero falar sobre outra coisa"
]

for mensagem in mensagens:
    resultado = classificador.classificar(mensagem)

    print(f"\nMensagem: {resultado['texto']}")
    print(f"Intenção: {resultado['intencao']}")
    print(f"Confiança: {resultado['confianca']}")
