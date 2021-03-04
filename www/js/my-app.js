  
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
    // Add default routes
    routes: [
      {
        path: '/about/',
        url: 'about.html',
      },
    ]
    // ... other parameters
  });

var mainView = app.views.create('.view-main');

// Handle Cordova Device Ready Event
$$(document).on('deviceready', function() {
    console.log("Device is ready!");
    // var email = "usuario01@dominio.com";
    // var password = "contraseña01";
    // firebase.auth().createUserWithEmailAndPassword(email, password)
    //     .then(function(){
    //       alert("registrado crack!")
    //     })
    //     .catch(function(error) {
    //     // Handle Errors here.
    //       var errorCode = error.code;
    //       var errorMessage = error.message;
    //       if (errorCode == 'auth/weak-password') {
    //         alert('Clave muy débil.');
    //       } else {
    //         alert(errorMessage);
    //       }
    //       console.log(error);
    //     });
    //     alert("q paso?");
});

// Option 1. Using one 'page:init' handler for all pages
$$(document).on('page:init', function (e) {
    // Do something here when page loaded and initialized
    console.log(e);
})
$$(document).on('page:init', '.page[data-name="index"]', function (e) {
    $$('#btnRegistro').on('click', fnLogin);
})
// Option 2. Using live 'page:init' event handlers for each page
$$(document).on('page:init', '.page[data-name="about"]', function (e) {
    // Do something here when page with data-name="about" attribute loaded and initialized
    console.log(e);
    
})


function fnLogin(){
  email = $$('#emailLogin').val();
  password = $$('#passLogin').val();

   var email = "usuario01@dominio.com";
   var password = "123456789";
   firebase.auth().createUserWithEmailAndPassword(email, password)
       .then(function(){
         alert("registrado crack!")
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