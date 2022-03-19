function validateData(id){
  notValidatedItems = []
  // Fetch all the forms we want to apply custom Bootstrap validation styles to
  var forms = document.querySelector( id );
  // Loop over them and prevent submission
  Array.prototype.filter.call(forms, function(form) {
    if (form.checkValidity() === false) {
      notValidatedItems.push('0')
    }
  });
  return notValidatedItems.length ? false : true
}

function loadProduct( data ){
  if (data.length > 0 ){
    fetch('hbs/templateProd.hbs')
    .then(response => response.text())
    .then(templateStr => {
      const template = Handlebars.compile(templateStr)
      data.forEach( prod => {
        const html = template( prod )
        tt = $(html).hide()
        $('#listaProductos').prepend(tt)
        tt.fadeIn(1000)
      });
    })
  }else{
    fetch('hbs/emptyProd.hbs')
    .then(response => response.text())
    .then(templateStr => {
      const template = Handlebars.compile(templateStr)
      const html = template()
      tt = $(html).hide()
      $('#listaProductos').prepend(tt)
      tt.fadeIn(1000)
    })
  }
}

Handlebars.registerHelper('lte', (v1, v2) => v1 >= v2 )

$(document).ready(function() {

  const socket = io.connect();

  socket.on('productos', data => {
    console.log( 'Data From Server: ' + JSON.stringify( data ) )
    
    // HandleBars
    loadProduct( data )
  });

  $('#productLoadForm').submit(function (event) {
    event.preventDefault();
    if ( validateData('#productLoadForm') ){
      // Horrible, pero fue la forma mas comoda de pasar de Form a url a Json
      data = Object.fromEntries( new URLSearchParams( $('#productLoadForm').serialize() ) )
      console.log( 'Data To Server: ' + JSON.stringify( data ) )
      socket.emit('productos', data );
    }
  });

  socket.on('mensajes', msjs => {
    const mensajesHTML = msjs
        .map(msj => `<div><span class="chat_user">${msj.usermail}</span> [${new Date(msj.timestamp).toLocaleString()}]: <span class="chat_msg">${msj.input}</span><div>`)
        .join('')

    tt = $(mensajesHTML).hide()
    $('div#chat_wall').append(tt)
    tt.fadeIn(1000)
  });

  $('#chatLoadForm').submit(function (event) {
    event.preventDefault();
    if ( validateData('#chatLoadForm') ){
      const usermail = document.querySelector('input[id="chat_mail"]')
      const input = document.querySelector('input[id="chat_message"]')
      socket.emit('mensajes', { usermail: usermail.value, input: input.value } )
    }
  });
});
