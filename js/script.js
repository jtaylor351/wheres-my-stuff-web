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
        });
        $("#logIn").on("click", function(email, password) {
        var userId;
        var isUser;
        var email = $("#email").val();
        var password = $("#pwd").val();
        firebase.auth().signInWithEmailAndPassword(email, password)
        .then(function(firebaseUser) {
            firebase.auth().onAuthStateChanged(function(user) {
              if (user) {
                checkIfUser(user.uid); //only if correct password
              } else {
                window.alert("Authentication failed");
                // User is signed out.
              }
            });
        }).catch(function(error) { //wrong password
            var errorCode = error.code;
            var errorMessage = error.message;
            if (errorCode === 'auth/weak-password') {
                alert(errorMessage);
            } else if (errorCode === 'auth/wrong-password') { //user does exist in the system
                 alert('Wrong password. Please try again');
                 addLockAttempts(email); //add lock attempts and possibly lock the user if wrong pw entered

              } else if (errorCode === 'auth/user-not-found') {
                    alert('The user does not exist in the system. User may have been deleted for violation of our Terms of Service.');
                  }
             console.log(error);
              }); 
        });
        $("#register").on("click", function(email, password, uname) {
          var email = $("#rEmail").val();
          var password = $("#rPwd").val();
          var uname = $("#rUname").val();
          var admin = ($("#admin").val() === "admin");
          if (email === "" || password === "" || uname === "") {
            alert("Please fill out every section of the form");
            return;
          }
          firebase.auth().createUserWithEmailAndPassword(email, password)
          .then(function(firebaseUser) {
            if (admin) {
              writeAdminData(firebaseUser.uid, uname, email);
            } else {
              writeUserData(firebaseUser.uid, uname, email);
            }
            $("#splashImg").fadeTo(150, 1, function() {
              document.getElementById('registerForm').style.display = 'none';
              document.getElementById('splashScreen').style.display = 'block';
            });
          }).catch(function(error) {
            // Handle Errors here.
            var errorCode = error.code;
            var errorMessage = error.message;
            window.alert(errorMessage);
            return;
            // ...
          });
          
        });
        break;
      case "about.html": // all user home logic like maps and stuff
        document.getElementById('profile-name').innerHTML = "Welcome " + sessionStorage.name;
        $("#log-out").click(function() {
          firebase.auth().signOut().then(function() {
          window.location.assign("home.html");
            // Sign-out successful.
          }).catch(function(error) {
            // An error happened.
            console.log(error);
          });
        });
        break;
      case "admin_home.html": // all admin logic
        document.getElementById('admin_name').innerHTML = "Welcome " + sessionStorage.name;
        $("#log-out").click(function() {
          firebase.auth().signOut().then(function() {
          window.location.assign("home.html");
            // Sign-out successful.
          }).catch(function(error) {
            // An error happened.
            console.log(error);
          });
        });
        break;
    }
});

function checkIfUser(uid) {
  firebase.database().ref("/users/" + uid).once("value")
  .then(function(snapshot) {
    if (snapshot.exists()) {
      if (snapshot.child("banned").val()) {
        window.alert("Your account has been banned for violating our Terms of Service");
        throw uid + ": banned";
      }
      if (snapshot.child("locked").val()) {
        window.alert("Your account has been locked by the system. Please try again later or contact admin for support.");
        throw uid + ": locked";
      }
      // must be an ok user

      //reset lock attempts since authentication is successful
      var userLockAttemptsRef = firebase.database().ref('users/' + uid + '/lockAttempts');
      userLockAttemptsRef.set(0);

      window.sessionStorage.setItem("name", snapshot.child("name").val());
      window.sessionStorage.setItem("uid", snapshot.child("uid").val());
      window.location.assign("about.html");
      return;
    }
    firebase.database().ref("/admin/" + uid).once("value")
      .then(function(snapshot) {
        window.sessionStorage.setItem("name", snapshot.child("name").val());
        window.location.assign("admin_home.html");
      });
  }).catch(function(error) {
    // console.log(error);
  })
}

function writeUserData(userId, nname, eemail) {
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

function writeAdminData(userId, nname, eemail) {
  firebase.database().ref('admin/' + userId).set({
    name: nname,
    email: eemail,
    uid: userId
  });
}

function addLockAttempts(email) {
    var userRef = firebase.database().ref('users');
    console.log("EMAIL: " + email);
    userRef.once('value', function(snapshot) {
        snapshot.forEach(function(childSnapshot) { //looping through uid
          var childData = childSnapshot.val();

          if (childSnapshot.child("email").val() === email) {
            var lockAttempts = childSnapshot.child("lockAttempts").val();

            var lockAttemptsRef = firebase.database().ref('users/' + childSnapshot.child('uid').val() + '/lockAttempts');
            console.log("lock-attempts-before:" + lockAttempts);

            lockAttemptsRef.set(++lockAttempts);

            console.log("lock-attempts-increased:" + lockAttempts);

            if (lockAttempts >= 3) {
                var lockedStatRef = firebase.database().ref('users/' + childSnapshot.child('uid').val() + '/locked');
                lockedStatRef.set(true);
                console.log("locked-status:" + childSnapshot.child("locked").val());
                alert("You have 3 failed login attempts. Your account now has been locked. Please contact admin for support.");
                return;
            }
            return;
          }
        });
    });
}
