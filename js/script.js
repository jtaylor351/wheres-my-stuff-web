$(document).ready (function() {
    var path = window.location.pathname;
    var fileName = path.match(/.*\/(.*?)$/)[1];
    switch(fileName) {
      case "home.html":
        $("#back_log").on("click", function() {
          $("#splashImg").fadeTo(150, 1, function() {
            document.getElementById('logInForm').style.display = 'none';
            document.getElementById('splashScreen').style.display = 'block';
          });
          // document.getElementById('splashImg').style.opacity = 1;
        });
        $("#back_register").on("click", function() {
          $("#splashImg").fadeTo(150, 1, function() {
            document.getElementById('registerForm').style.display = 'none';
            document.getElementById('splashScreen').style.display = 'block';
          });
          // document.getElementById('splashImg').style.opacity = 1;
        });
        $("#splash_log_in").on("click", function() {
          $("#splashImg").fadeTo(150, 0.8, function() {
            document.getElementById('splashScreen').style.display = 'none';            
            document.getElementById('logInForm').style.display = 'block';
          });
          // document.getElementById('splashImg').style.opacity = 1;
        });
        $("#splash_register").on("click", function() {
          $("#splashImg").fadeTo(150, 0.8, function() {
            document.getElementById('splashScreen').style.display = 'none';            
            document.getElementById('registerForm').style.display = 'block';
          });
          // document.getElementById('splashImg').style.opacity = 1;
        });
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
        });
        $("#register").on("click", function(email, password, uname) {
          var email = $("#rEmail").val();
          var password = $("#rPwd").val();
          var uname = $("rUname").val();
          firebase.auth().createUserWithEmailAndPassword(email, password)
          .then(function(firebaseUser) {
            writeUserData(firebaseUser.uid, uname, email);
            $("#splashImg").fadeTo(150, 1, function() {
              document.getElementById('registerForm').style.display = 'none';
              document.getElementById('splashScreen').style.display = 'block';
            });
          }).catch(function(error) {
            // Handle Errors here.
            var errorCode = error.code;
            var errorMessage = error.message;
            window.alert(errorMessage);
            // ...
          });
        });
        break;
      case "user_profile.html": // all user home logic like maps and stuff
        document.getElementById('user_name').innerHTML = "Welcome " + sessionStorage.name;
        break;
      case "admin_home.html": // all admin logic
        document.getElementById('admin_name').innerHTML = "Welcome " + sessionStorage.name;
        break;
    }
});

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
      window.sessionStorage.setItem("name", snapshot.child("name").val());
      window.sessionStorage.setItem("uid", snapshot.child("uid").val());
      window.location.assign("user_profile.html");
      return;
    }
    firebase.database().ref("/admin/" + uid).once("value")
      .then(function(snapshot) {
        window.sessionStorage.setItem("name", snapshot.child("name").val());
        window.location.assign("admin_home.html");
      });
  }).catch(function(error) {
    console.log(error);
  })
}

function writeUserData(userId, nname, eemail) {
  console.log(userId); 
  firebase.database().ref('users/' + userId).set({
    name: nname,
    email: eemail,
    banned: false,
    itemCount: 0,
    lockAttempts: 0,
    locked: false,
    uid: userId
  });
}