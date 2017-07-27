$(document).ready(function() {
    var userList = [];
    var userRef = firebase.database().ref("users/");
    userRef.once('value').then(function(postSnap) {
        postSnap.forEach(function(userSnap) {
            var _uid = userSnap.child("uid").val();
            var _name = userSnap.child("name").val();
            var _ban = userSnap.child("banned").val();
            var _email = userSnap.child("email").val();
            if (_ban) {
                var user = {uid: _uid, name: _name, email: _email};
                userList.push(user);
            }
        });
        var count = 0;
        userList.forEach(function(u) {
            var uStr = "<tr>" +
            "<td>" + count + "</td>" +
            "<td><input type='checkbox'></input></td>" +
            "<td>" + u.name + "</td>" +            
            "<td>" + u.email + "</td>" +            
            "</tr>";
            $("tbody").append(uStr)
            count++;
        });
    }).catch(function(error) {
        console.log("loading problem");
    });
    $("#unban").on('click', function() {
        $('tbody').children("tr").each(function() {
            console.log($(this).find('input').is(':checked'));
            if($(this).find('input').is(':checked')) {
                var uid = userList[$(this).children(":first").html()].uid;
                console.log(uid);
                firebase.database().ref('users/' + uid + "/banned").set(false);
            }
        });
        alert("Unban successful");
        window.location.assign("view_banned_users.html");
    });
});