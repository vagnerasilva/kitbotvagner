'use strict'

const express = require('express')
const bodyParser = require('body-parser')
const request = require('request')
const watson = require('watson-developer-cloud');
const app = express()

const rp = require('request-promise');
app.use('/', express.static('public'));
app.set('port', (process.env.PORT || 5000))
app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies

app.listen(app.get('port'), function() {
	console.log("logado olha o log !! aquiiiiiiiiiiiiii  TO ONLINEEEE  4040 ")
})

var conversation_id = "";


// ##### TOKEN DA PAGINA

let token = "EAAD1gCJN2ZuYq4ZBUFi499uu1MRRvJm10YU5DMNnp602LXAmNrXFwZDZD" // token do facebook

// Facebook 
let timeMessage= {};
app.get('/webhook/', function(req, res) {
	if (req.query['hub.verify_token'] === "vagnertoken") {  //#### Token webhook
		console.log("webhook")
		res.send(req.query['hub.challenge'])
	}
	res.send("Wrong token")
})


app.post('/webhook/',function(req, res){
	
	var data = req.body
///	console.log(data.entry[0].time);  // Time 
	timeMessage = data.entry[0].time;
	if(data.object == 'page'){
		
		data.entry.forEach(function(pageEntry){
			pageEntry.messaging.forEach(function(messagingEvent){
				if(messagingEvent.message){					
					getMessage(messagingEvent)
				//	somenteTexto(senderID, "chamei")
				}
			})
		})
	}
	res.sendStatus(200)
})




function getMessage(event){
	var senderID = event.sender.id
	var messageText = event.message.text
	
//	console.log(messatime)
   console.log("pegando a mensagem")
	avaliarmsg(senderID, messageText)   // Avalia mensagem pelo texto que chega
										// tem opcao de avaliar pelo tipo de evento
}




function avaliarmsg(senderID, messageText){
	console.log("chamando ask msg")
		
	//	somenteTexto(senderID, "chamei")
		servidorAsk(senderID,  messageText);
		//somenteTexto(senderID, messageText)
}// Fim da function

var cont= 0;




function servidorAsk(senderID, messageTex){

rp({
    method: 'POST',
    uri: 'https://servidorheroku.herokuapp.com/send',
	headers: 
		   { 'Content-Type': 'application/json' },
    body: {
        senderID : senderID,
        messageTex : messageTex
    },
    json: true // Automatically stringifies the body to JSON
}).then(function (parsedBody) {
        console.log(parsedBody);
        // POST succeeded...
       var msg = parsedBody.text[0];
       var pacote1 = parsedBody.sender;
       console.log(msg);
       console.log(pacote1);
      // context = parsedBody.output.text;
       //senderID= parsedBody.username;
      //  console.log(context);

        cont++;
        console.log("#################contador")
        console.log(cont)
		somenteTexto(senderID, msg)   // somente Texto como resposta
		// callSendAPI(messageData)  chamada da entrega Card e texto ja personalizado
    })
    .catch(function (err) {
       // console.log(parsedBody);
      // console.log(err);
        console.log("deu ruim")
        somenteTexto(senderID, "deu ruim")
        // POST failed...
    });


}  // Funcao que chama No Servidor 




function somenteTexto(senderID, msg){
	var messageData = {
		recipient : {
			id: senderID
		},
		message: {
			text: msg
		}
	}

	callSendAPI(messageData)
}



function callSendAPI(messageData){
	//api de facebook
	request({
		uri: 'https://graph.facebook.com/v2.6/me/messages',
		qs: {access_token: token},
		method: 'POST',
		json: messageData
	},function(error, response, data){
		if(error)
			console.log('Shiii deu ruim nao deu pra mandar')
		else
			console.log('huhuhuuhu Deu certo ')
	})
}


// ROUTES
app.get('/teste', function(req, res) {
	console.log("teste");
	res.send({
 				"messages": [
   								 {"text": "enviando msg facebook"}
									
 							]
			})
});




