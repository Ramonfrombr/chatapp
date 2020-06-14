document.addEventListener('DOMContentLoaded', () => {



	console.log("JavaScript carregado.");

	// Define a sala de bate papo
    localStorage.setItem('sala', 'sala01');
    const sala = localStorage.getItem('sala');

    // Define o nome de usuário e armazena no localStorage
    const botaoNomeUsuario = document.querySelector('#botaoNomeUsuario');
    botaoNomeUsuario.onclick = () => {

        const nome = document.querySelector('#inputNomeUsuario').value;
        localStorage.setItem('usuario', nome);
        console.log(localStorage.getItem('usuario'));
    };

    // Abre nav lateral
    const iconeMenu = document.querySelector('#iconeMenu');
    iconeMenu.onclick = () => {
        document.getElementById("navlateral").style.width = "50%";
        document.querySelector("#navbar").style.display = "none";
        document.querySelector("#chat").style.display = "none";
        document.body.style.backgroundColor = "rgba(0,0,0,0.4)";
    };

    // Fecha nav lateal
    const botaoFechaMenu = document.querySelector('#botaoFecharMenu');
    botaoFechaMenu.onclick = () => {
        document.getElementById("navlateral").style.width = "0";
    	document.querySelector("#navbar").style.display = "table";
    	document.querySelector("#chat").style.display = "flex";
    	document.body.style.backgroundColor = "white";
    	
    };









    var socket = io();
	    
    socket.on('connect', () => {

        // Confirma socket conectado
        socket.emit('socket conectado');

        // Seleciona o formulário de enviar mensagem
        const formMensagem = document.querySelector('#formMensagem');

        // Quando o formulário da mensagem for enviado
        formMensagem.onsubmit = () => {

            // Seleciona o conteúdo da mensagem
            const mensagem = document.querySelector('#mensagem').value;
        
            // Se o usuário digitou alguma coisa
            if (mensagem)
            {

                // Seleciona o nome de usuário e a sala
                const usuario = localStorage.getItem('usuario');
                const sala = localStorage.getItem('sala');

                // Seleciona e ormata a info sobre o horário e data da mensagem
                var dataMensagem = new Date();
                var dia = String(dataMensagem.getDate()).padStart(2, '0');
                var mes = String(dataMensagem.getMonth() + 1).padStart(2, '0'); //Janeiro é 0!
                var ano = dataMensagem.getFullYear();
                var horario = dataMensagem.getHours() + ":" + dataMensagem.getMinutes();
                dataMensagem = horario + ", " + dia + '/' + mes + '/' + ano;


                // Limpa o formulário de mensagem
                document.querySelector('#mensagem').value = '';

                // Log
                console.log(usuario);
                console.log(mensagem);
                console.log(sala);
                console.log(dataMensagem);

                // Emite evento contendo 'mensagem', 'usuario', 'sala' e 'dataMensagem'
                socket.emit('enviar mensagem', {'mensagem': mensagem, 'usuario': usuario, 'sala': sala, 'dataMensagem': dataMensagem});

                // Impede a página de recarregar
                return false;
            }
            // Se o usuário não digitou, não atualize a página
            else
            {
                return false;
            }
        }
    });

    socket.on('exibir mensagem', dados => {

        console.log(`Os dados são: ${dados}`);
        // Cria uma div que servirá de container para os dados da mensagem
        const div = document.createElement('div');


        // Cria element span para armazenar mensagem
        const mensagem = document.createElement('span');
        // Adiciona o conteúdo da mensagem no span
        mensagem.innerHTML = `${dados.mensagem}`;
        // Adiciona classe ao span da mensagem para estilização
        mensagem.classList.add('conteudoMensagem');


        const usuario = document.createElement('span');

        usuario.innerHTML = `${dados.usuario}`;

        usuario.classList.add('usuarioMensagem');


        const dataMensagem = document.createElement('span');

        dataMensagem.innerHTML = `${dados.dataMensagem}`;

        dataMensagem.classList.add('dataMensagem');



        // Preenche div com os dados da mensagem
        div.append(mensagem);
        div.append(usuario);
        div.append(dataMensagem);

        // Se o autor da mensagem for o cliente
        if (localStorage.getItem('usuario') == dados.usuario)
        {
            // Posicionar caixa de mensagem à direita
            div.classList.add('caixaMensagemUsuario');
        }
        else
        {
            // Posicionar caixa de mensagem à esquerda
            div.classList.add('caixaMensagemOutroUsuario');
        }

        // Cria o container que armazenara a caixa da mensagem
        // e permitirá que a caixa seja posicionada na esquerda ou na direita
        const container = document.createElement('div');
        container.classList.add('caixaMensagemContainer');

        // Preenche container com a caixa da mensagem
        container.append(div);

        // Adiciona container da mensagem na lista de mensagens
        document.querySelector('#listaMensagens').append(container);

    });
});









