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

function notifyPopup(title, message){
  fetch('hbs/notifyPopup.hbs')
  .then(response => response.text())
  .then(templateStr => {
    const template = Handlebars.compile(templateStr)
    const html = template( { title, message } )
    $('.toast-container').append(html)
    $('.toast-container .toast:last-child').toast('show')
  })
}

function renderProduct( data, container, extend ){
  if (extend){
    $(container).html('')
  }
  if (data.length > 0 ){
    fetch('hbs/templateProd.hbs')
    .then(response => response.text())
    .then(templateStr => {
      const template = Handlebars.compile(templateStr)
      data.forEach( prod => {
        prod['extend'] = extend
        const html = template( prod )
        if (extend){
          $(container).prepend(html)
        }else{
          tt = $(html).hide()
          $(container).prepend(tt)
          tt.fadeIn(1000)
        }
      });
    })
    
    qtyTotal = data.reduce( (acc,obj) => { return acc + obj.qty }, 0)
    $('#carritoItemCount').html(qtyTotal)
  }else{
    fetch('hbs/emptyProd.hbs')
    .then(response => response.text())
    .then(templateStr => {
      const template = Handlebars.compile(templateStr)
      const html = template()
      tt = $(html).hide()
      $(container).prepend(tt)
      tt.fadeIn(1000)
    })
  }
}

function loadProducts(){
  /*
    Sync Products
  */
    $.ajax({
      url: 'api/productos',
      type: 'GET',
      dataType: 'json',
      success: data => {
        // HandleBars
        renderProduct( data, '#listaProductos', false )
      },
      error: data => {
        console.log('Ups, fail to get Products...')
      }
    })
}

function buildCart( callback ){
  /*
    Sync Products
  */
    $.ajax({
      url: 'api/carritos',
      type: 'POST',
      dataType: 'json',
      success: data => {
        window.cartNumber = data.id
        callback()
      },
      error: data => {
        console.log('Ups, fail to get Products...')
      }
    })
}

function loadCart(){
  /*
    Sync Products
  */
  $.ajax({
    url: `api/carritos/${window.cartNumber}/productos`,
    type: 'GET',
    dataType: 'json',
    success: data => {
      // HandleBars
      renderProduct( data, '#listaCarrito', true )
    },
    error: data => {
      console.log('Ups, fail to get Products...')
    }
  })
}

Handlebars.registerHelper('lte', (v1, v2) => v1 >= v2 )

window.cartNumber = 0

$(document).ready(function() {
  var tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'))
  var tooltipList = tooltipTriggerList.map(function (tooltipTriggerEl) {
    return new bootstrap.Tooltip(tooltipTriggerEl)
  })

  /*
    Super Monitor!
  */
  $.ajaxSetup({
    beforeSend: function(jqXHR, settings) {
      console.log( { 'msg': 'SENT', 'url': settings.url, 'type': settings.type, 'dataType': settings.dataType, 'full': settings } )
    },
    complete: function(data){
      console.log( { 'msg': 'RECV', 'status': data.status, 'responseJSON': data.responseJSON, 'full': data } )

      if ('error' in data.responseJSON ){
        notifyPopup( 'Error', data.responseJSON.error )
      }

      if ('message' in data.responseJSON ){
        notifyPopup( 'Message', data.responseJSON.message )
      }
    }
  });

  $('#productLoadForm').submit(function (event) {
    event.preventDefault();
    if ( validateData('#productLoadForm') ){
      // Horrible, pero fue la forma mas comoda de pasar de Form a url a Json
      data = Object.fromEntries( new URLSearchParams( $('#productLoadForm').serialize() ) )
      $.ajax({
        url: 'api/productos',
        type: 'POST',
        dataType: 'json',
        data: data,
        success: function(data){
          loadProducts()
        }
      })
    }
  });

  $('.toast-container').on('hidden.bs.toast', '.toast', function(event){
    $(event.target).remove();
  })

  $(document).on('click', 'button.addItemToCart', function(event){
    let id = $(this).val()
    $.ajax({
      url: `api/carritos/${window.cartNumber}/productos`,
      type: 'POST',
      dataType: 'json',
      data: {
        'id' : id
      },
      success: function(data){
        loadCart()
      }
    })
  })

  $(document).on('click', 'button.substractItemToCart', function(event){
    let id = $(this).val()
    $.ajax({
      url: `api/carritos/${window.cartNumber}/productos/${id}`,
      type: 'DELETE',
      dataType: 'json',
      data: {
        'id' : id,
        'force': false
      },
      success: function(data){
        loadCart()
      }
    })
  })

  $(document).on('click', 'button.removeItemToCart', function(event){
    let id = $(this).val()
    $.ajax({
      url: `api/carritos/${window.cartNumber}/productos/${id}`,
      type: 'DELETE',
      dataType: 'json',
      data: {
        'id' : id,
        'force': true
      },
      success: function(data){
        loadCart()
      }
    })
  })

  loadProducts()
  buildCart( loadCart )
})
