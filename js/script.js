// Initialize default app
// Retrieve your own options values by adding a web app on
// https://console.firebase.google.com

// var ref = new Firebase("cs-2340-a8b03.firebaseapp.com");

// ref.initializeApp({
//   apiKey: "AIzaSyBWI3tP5zOd8Q_7uyPJzeHWtlehIKFW26k", // Auth / General Use
//   authDomain: "cs-2340-a8b03.firebaseapp.com",         // Auth with popup/redirect
//   databaseURL: "https://cs-2340-a8b03.firebaseio.com/", // Realtime Database
// });

// var authClient = new FirebaseAuthClient(ref, function(error, user) {
//   if (error) {
//     alert(error);
//     return;
//   }
//   if (user) {
//     // User is already logged in.
//     doLogin(user);
//   } else {
//     // User is logged out.
//     showLoginBox();
//   }
// });

// firebase.auth().signInWithEmailAndPassword($("#email").val(), $("#pwd").val()).catch(function(error) {
//   // Handle Errors here.
//   var errorCode = error.code;
//   var errorMessage = error.message;
//   // ...
// });


// document.getElementById("logIn").addEventListener("click",
// logIn(document.getElementById("email").value, document.getElementById("pwd").value));





function checkIfUser(uid) {
  firebase.database().ref("/users/" + uid).once("value")
  .then(function(snapshot) {
    if (snapshot.exists()) {
      if (snapshot.child("banned").val()) {
        window.alert("Your acccount has been banned for violating our Terms of Service");
        throw "banned";
      }
      if (snapshot.child("locked").val()) {
        window.alert("Your acccount has been locked for inputing the incorect password too many times. Try again later.");
        throw "locked";
      }
      // must be an ok user
      window.location.assign("user_home.html");
      return;
    }
    // must be an admin
    window.location.assign("admin_home.html");
    
  })
  .catch(function(error) {
    console.log(error);
  })
}




$(document).ready (function() {
    $("#logIn").on("click", function(email, password) {
        var userId;
        var isUser;
        var email = $("#email").val();
        var password = $("#pwd").val();
        firebase.auth().signInWithEmailAndPassword(email, password)
        .then(function(firebaseUser) {
          // try {
            firebase.auth().onAuthStateChanged(function(user) {
              if (user) {
                checkIfUser(user.uid);
                // b = checkIfUser(user.uid).onreadystatechange = function() {
                //   if (this.readyState == 4 && this.status == 200) {
                //     document.getElementById("demo").innerHTML =
                //     this.responseText;
                //   }
                //   };
                // console.log(b);
                // if (b) {
                //   // window.location.assign("user_home.html");
                // } else {
                //   // window.location.assign("admin_home.html");
                // }
              } else {
                window.alert("Authentification Failed");
                // User is signed out.
                // ...
              }
            });
      }).catch(function(error) {
          window.alert("Authentification Failed");
          // console.log(error);
            });
})});







// function logIn(email, password) {
//     defaultAuth = firebase.auth();
//     defaultAuth.signInWithEmailAndPassword(email, password)
//         .catch(function(error) {
//         // Handle Errors here.
//         var errorCode = error.code;
//         var errorMessage = error.message;
//         if (errorCode === 'auth/wrong-password') {
//             alert('Wrong password.');
//         } else {
//             alert(errorMessage);
//     }
//     console.log(error);
//     });

//     var currentUser;

//     defaultAuth.onAuthStateChanged(function(user) {
//         if (user) {
//             currentUser = user;
//             console.log("sign in worked");
//         } else {
//             console.log("sign in did not work");            
//         }
//     });



// }