"""

Lista de Funcionalidades


[ ] - Exibir nome de usuário. Quando um usuário visita o site pela primeira vez, eles devem informar
um nome que será exibido com cada mensagem que o usuário enviar.
Se o usuário fechar a página e voltar mais tarde, o nome de usuário deve ser lembrado.

[ ] - Cria sala de bate-papo. Qualquer usuário deve ser capaz de
criar uma nova sala de bate-papo, contanto que o nome já não esteja
sendo usado por uma outra sala de bate-papo.

[ ] - Lista de salas de bate-papo. Usuários devem conseguir ver uma lista de todas as salas
de bate-papo ativas, e poder selecionar uma sala para entrar.

[ ] - Exibir mensagens. Quando uma sala for selecionada, o usuário deve poder ver todas mensagens que
já foram enviadas, até um máximo de 100 mensagens. O aplicativo deve armazenar apenas a 100 mais recentes mensagens
de cada sala na memória no lado do servidor.

[ ] - Enviar mensagens. Quando estiver em uma sala, os usuários devem poder enviar mensagens para outros usuários
na sala. Quando um usuário envia uma mensagem, seu nome de usuário e horário de envio da mensagem devem ser exibidos juntos com a mensagem.
Todos os usuários na sala devem poder ver a nova mensagem (juntamente com o nome do usuário e o horário de envio).
Enviar e receber mensagens não pode fazer com que a página recarregue.

[ ] - Lembrar a sala de bate-papo. Se um usuário estiver em uma sala, fechar o site e depois reabrir o site, o aplicativo deve lembrar
em qual sala de bate-papo o usuário estava e direcionar o usuário para essa sala automaticamente.



Toque pessoal

[ ] - Usuário pode deletar sua própria mensagem.

[ ] - Habilitar anexo de arquivos (imagens, por exemplo).

[ ] - Habilitar troca de mensagens privadas entre dois usuários.

[ ] - Livro de frases sugeridas de acordo com a última mensagem recebida ou mensagem sendo escrita pelo usuário



"""




import os

from flask import Flask, render_template, jsonify
from flask_socketio import SocketIO, emit

app = Flask(__name__)
app.config["SECRET_KEY"] = os.getenv("SECRET_KEY")
app.config["TEMPLATES_AUTO_RELOAD"] = True
socketio = SocketIO(app)

salas = {
    'ingles': [],
    'espanhol': [],
    'frances': [],
    'portugues': []
}



@app.route("/")
def inicio():
    return render_template("inicio.html")


# Confirma conexão
@socketio.on('socket conectado')
def handle_my_custom_event():
    print("Socket conectado.")


@socketio.on('pedir mensagens')
def pedir_mensagens(sala):

    # Seleciona a sala
    sala = sala['sala']

    # Array de mensagens que será enviado para o cliente
    mensagens = []

    #
    for mensagem in salas[sala]:

        #
        usuario = mensagem['usuario']
        conteudo = mensagem['mensagem']
        dataMensagem = mensagem['dataMensagem']

        #
        mensagens.append({'usuario': usuario, 'mensagem': conteudo, 'dataMensagem': dataMensagem})

    for mensagem in mensagens:
        print(mensagem)

    print(mensagens)

    # Envia array de mensagens
    emit('carregar mensagens', mensagens)
    

@socketio.on('enviar mensagem')
def enviar_mensagem(dados):

    # Selecina os dados da mensagem
    mensagem = dados['mensagem']
    usuario = dados['usuario']
    sala = dados['sala']
    dataMensagem = dados['dataMensagem']

    # Log
    print("----")
    print(mensagem)
    print(usuario)
    print(sala)

    # Adiciona nova mensagem ao final da lista
    salas[sala].append({'usuario': usuario, 'mensagem': mensagem, 'dataMensagem': dataMensagem})

    # Se o número de mensagens for igual ou maior que 100
    if len(salas[sala]) > 100:
        # Remove a mensagem mais antiga
        salas[sala].pop()

    # Log número de mensagens
    print(f'O número de mensagens na sala "{sala}" é: {len(salas[sala])}.')

    # Emite evento para todos os clientes
    emit('exibir mensagem', {'mensagem': mensagem, 'usuario': usuario, 'dataMensagem': dataMensagem}, broadcast=True)


if __name__ == '__main__':
    socketio.run(app, debug=True)
