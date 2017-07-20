// userSnap is the datasnapshot of the user in the database
function loadUser(userSnap) {
  window.location.assign("user_home.html");
  console.log("in loadUser");
  document.getElementById('user_name').innerHTML = "Welcome " + userSnap.child("name").val();
}


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
      loadUser(snapshot);
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





// function initMap() {
//         var uluru = {lat: -25.363, lng: 131.044};
//         var map = new google.maps.Map(document.getElementById('map'), {
//           zoom: 4,
//           center: uluru
//         });
//         var marker = new google.maps.Marker({
//           position: uluru,
//           map: map
//         });
//       }