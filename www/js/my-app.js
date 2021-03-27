
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
    },
    {
      path: '/perfil/',
      url: 'perfil.html',
    },
    {
      path: '/buscador/',
      url: 'buscador.html',
    }
  ]
  // ... other parameters
});

var mainView = app.views.create('.view-main');

var db = firebase.firestore()
var auth = firebase.auth();
var public;

var colUsuarios = db.collection("usuarios");




// Handle Cordova Device Ready Event
$$(document).on('deviceready', function () {
  console.log("Device is ready!");
});

// Option 1. Using one 'page:init' handler for all pages
$$(document).on('page:init', function (e) {
  // Do something here when page loaded and initialized
  console.log(e);
})
// Option 2. Using live 'page:init' event handlers for each page
$$(document).on('page:init', '.page[data-name="about"]', function (e) {
  // Do something here when page with data-name="about" attribute loaded and initialized
  console.log(e);

})

/////////////////////////////////////////////// INDEX y LOGIN ////////////////////////////////////////////////////

$$(document).on('page:init', '.page[data-name="index"]', function (e) {
  $$('#btnRegistro').on('click', function () {
    app.views.main.router.navigate("/registro/");
  });

  $$('#btnLogin').on('click', fnLogin)

  function fnLogin() {
    email = $$('#emailLogin').val();
    password = $$('#passLogin').val();

    auth.signInWithEmailAndPassword(email, password)
      .then(cred => {
        console.log(cred.user)
        app.views.main.router.navigate("/principal/");
      })
      .catch((error) => {
        var errorCode = error.code;
        var errorMessage = error.message;
        console.log(errorCode)
      });
  }
})

/////////////////////////////////////////////// REGISTRO ////////////////////////////////////////////////////

$$(document).on('page:init', '.page[data-name="registro"]', function (e) {
  $$('#btnRegistro2').on('click', fnRegister);

  function fnRegister() {
    nombreR = $$('#nombreRegistro').val();
    emailR = $$('#emailRegistro').val();
    passwordR = $$('#passRegistro').val();
    publicaciones = {};

    auth.createUserWithEmailAndPassword(emailR, passwordR)

      .then(cred => {
        console.log('esto es el cred: ', cred)
        return db.collection('usuarios').doc(cred.user.uid).set({
          nombreR,
          emailR,
          publicaciones
        })
      })
      .then(()=>{
        app.views.main.router.navigate("/principal/");
      })
      .catch(function (error) {
        // Handle Errors here.
        var errorCode = error.code;
        var errorMessage = error.message;
        if (errorCode == 'auth/weak-password') {
          console.log('Clave muy débil.');
        } else {
          console.log(errorMessage);
        }
        console.log(error);
      });
  }

})

/////////////////////////////////////////////// PRINCIPAL ////////////////////////////////////////////////////

$$(document).on('page:init', '.page[data-name="principal"]', function (e) {
  $$('#btnPublicar').on('click', fnPublicar);
  // fnMostrar();
  // botones toolbar
  $$('#btnPerfil').on('click', function () {
    app.views.main.router.navigate("/perfil/");
  });
  $$('#btnHome').on('click', function () {
    app.views.main.router.navigate("/principal/");
  });
  $$('#btnBuscar').on('click', function () {
    app.views.main.router.navigate("/buscador/");
  });

  

  function fnPublicar() {
    // almaceno lo que quiero guardar
    titulo = $$('#receta-titulo').val();
    descripcion = $$('#receta-descripcion').val();

    
    let user = firebase.auth().currentUser
    let uid = user.uid


     public = db.collection('usuarios').doc(uid);
     console.log('este es el uid: ', uid);



     public.collection('publicaciones').add({
          titulo,
          descripcion
     }).then(function () {
         // limpio los input
         $$('#receta-titulo').val('');

         $$('#receta-descripcion').val('');

    }).catch(function (error) {
         console.error(error)
    })

    
    //pasar a funcion
    public.collection('publicaciones').onSnapshot((querySnapshot) => {
      $$('#cardPublicacion').html('');
      querySnapshot.forEach((doc) => {
        
        info = doc.data();
        info.id = doc.id;
  
        title = doc.data().titulo;
        description = doc.data().descripcion;
       
        $$('#cardPublicacion').append(`<div class='card' id="z${info.id}">
        <div class='card-header'> ${title} </div> 
        <div class='card-content card-content-padding'> ${description} </div> 
        <div class='card-footer'>
        <p class='row'>
        <button class='col button button-raised btn-modificar' id="btn-${info.id}">Modificar</button>
        <button class='col button button-raised btn-eliminar' id="btn-${info.id}">Eliminar</button>
        </p>
        </div> 
        </div>`);
        $$('.btn-eliminar').on('click', function(){
          console.log(this.id)
          esteID=this.id
          elID = esteID.replace("btn-","");
          $$('#z'+elID).html('');
          public.collection('publicaciones').doc(elID).delete();
        })
        $$('.btn-modificar').on('click', function(){
          //receta-titulo
          //receta-descripcion
          $$('#receta-titulo').val();
          $$('#receta-descripcion').val();

        })
      })
    });
    
  }
  
})

/////////////////////////////////////////////// PERFIL ////////////////////////////////////////////////////

$$(document).on('page:init', '.page[data-name="perfil"]', function (e) {
  // botones toolbar
  $$('#btnPerfil').on('click', function () {
    app.views.main.router.navigate("/perfil/");
  });
  $$('#btnHome').on('click', function () {
    app.views.main.router.navigate("/principal/");
  });
  $$('#btnBuscar').on('click', function () {
    app.views.main.router.navigate("/buscador/");
  });

  auth.onAuthStateChanged(user =>{
    if (user){
      console.log('usuario logeado: ', user)
      setUI(user);
    }else{
      console.log('usuario deslogeado')
    }
  })
  //seteo datos de usuario en el perfil
  var setUI = (user) =>{
    if(user){
      db.collection('usuarios').doc(user.uid).get().then(doc => {
        console.log()
          $$('#nombreUsuario').append(`<div>${doc.data().nombreR}</div>`);
      })
      
    }else{
      console.log('paso algo que no esta bueno')
    }
  }

})

/////////////////////////////////////////////// BUSCADOR ////////////////////////////////////////////////////

$$(document).on('page:init', '.page[data-name="buscador"]', function (e) {
  // botones toolbar
  $$('#btnPerfil').on('click', function () {
    app.views.main.router.navigate("/perfil/");
  });
  $$('#btnHome').on('click', function () {
    app.views.main.router.navigate("/principal/");
  });
  $$('#btnBuscar').on('click', function () {
    app.views.main.router.navigate("/buscador/");
  });


  //ref.collection('usuarios').orderBy('nombreR').startAt(nombreR).endAt(nombreR+'\uf8ff')


})




// function fnMostrar(){
//   public.collection('publicaciones').onSnapshot((querySnapshot) => {
  
//     querySnapshot.forEach((doc) => {
      
//       info = doc.data();
//       info.id = doc.id;

//       title = doc.data().titulo;
//       description = doc.data().descripcion;
     
//       $$('#cardPublicacion').append(`<div class='card' id="${info.id}">
//       <div class='card-header'> ${title} </div> 
//       <div class='card-content card-content-padding'> ${description} </div> 
//       <div class='card-footer'>
//       <p class='row'>
//       <button class='col button button-raised'>Modificar</button>
//       <button class='col button button-raised btn-eliminar' id="btn-${info.id}">Eliminar</button>
//       </p>
//       </div> 
//       </div>`);
//       $$('.btn-eliminar').on('click', function(){
//         console.log(this.id)
//       })
//       //  var btnsEliminados = document.querySelectorAll('.btn-eliminar');
      
//       //  btnsEliminados.forEach(btn =>{
//       //     btn.addEventListener('click', async(e) =>{
//       //       console.log('clickeado este id: ', e.target.dataset.id)
//       //      await eliminarPublicacion(e.target.dataset.id)
//       //     })
//       //  })

//     })
//   })
// }



