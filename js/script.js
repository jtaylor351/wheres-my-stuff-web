$(document).ready (function() {
    var path = window.location.pathname;
    var fileName = path.match(/.*\/(.*?)$/)[1];
    switch(fileName) {
      case "home.html":
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