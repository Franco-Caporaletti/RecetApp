  
// If we need to use custom DOM library, let's save it to $$ variable:
var $$ = Dom7;

var app = new Framework7({
    // App root element
    root: '#app',
    // App Name
    name: 'My App',
    // App id
    id: 'com.myapp.test',
    // Enable swipe panel
    panel: {
      swipe: 'left',
    },
    // RUTAS
    routes: [
      {
        path: '/about/',
        url: 'about.html',
      },
      {
        path: '/principal/',
        url: 'principal.html',
      },
      {
        path: '/registro/',
        url: 'registro.html',
      }
    ]
    // ... other parameters
  });

var mainView = app.views.create('.view-main');

var db = firebase.firestore()
var colUsuarios = db.collection("usuarios");

var publicacionForm = $$('#publicacion-form');



// Handle Cordova Device Ready Event
$$(document).on('deviceready', function() {
    console.log("Device is ready!");
});

// Option 1. Using one 'page:init' handler for all pages
$$(document).on('page:init', function (e) {
    // Do something here when page loaded and initialized
    console.log(e);
})


$$(document).on('page:init', '.page[data-name="index"]', function (e) {
    $$('#btnRegistro').on('click', function(){
      app.views.main.router.navigate("/registro/");
    });

    $$('#btnLogin').on('click', fnLogin)
})

$$(document).on('page:init', '.page[data-name="registro"]', function (e) {
  $$('#btnRegistro2').on('click', fnRegister);

  
})

$$(document).on('page:init', '.page[data-name="principal"]', function (e) {
  $$('#btnPublicar').on('click', fnPublicar);

  
})


// Option 2. Using live 'page:init' event handlers for each page
$$(document).on('page:init', '.page[data-name="about"]', function (e) {
    // Do something here when page with data-name="about" attribute loaded and initialized
    console.log(e);
    
})


function fnRegister(){
  nombreR = $$('#nombreRegistro').val();
  emailR = $$('#emailRegistro').val();
  passwordR = $$('#passRegistro').val();

   firebase.auth().createUserWithEmailAndPassword(emailR, passwordR)
       .then(function(){
         alert("registrado crack!")

         datos = { Nombre: nombreR, Email: emailR };
         colUsuarios.doc(emailR).set(datos);
       })
       .catch(function(error) {
       // Handle Errors here.
         var errorCode = error.code;
         var errorMessage = error.message;
         if (errorCode == 'auth/weak-password') {
           alert('Clave muy débil.');
         } else {
           alert(errorMessage);
         }
         console.log(error);
       });
       alert("q paso?");
}

function fnLogin(){
  email = $$('#emailLogin').val();
  password = $$('#passLogin').val();

  firebase.auth().signInWithEmailAndPassword(email, password)
  .then((user) => {
    // Signed in
    // ...
    app.views.main.router.navigate("/principal/");
  })
  .catch((error) => {
    var errorCode = error.code;
    var errorMessage = error.message;
    alert(errorCode)
  });
}

function fnPublicar(){

  var guardarPublicacion = () => {
    db.collection('publicaciones').doc().set({
      titulo,
      descripcion
    });
  }
  var mostrarPublicacion = () => {
    db.collection('publicaciones').get();
  }


  titulo = $$('#receta-titulo').val();
  descripcion = $$('#receta-descripcion').val();

  
  guardarPublicacion(titulo, descripcion);
}