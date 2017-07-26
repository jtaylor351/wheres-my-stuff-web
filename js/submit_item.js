$(document).ready(function() {
    $("#submit").click(function() {
        if (!validateForm()) {
            alert("Please fill out all required fields");
            return;
        }
        var cat = $("#item-cat").val();
        var dat = new Date().getTime();
        var desc = $("#item-desc").val();
        var lat = parseFloat($("#lat").val());
        var lng = parseFloat($("#long").val());
        var name = $("#item-name").val();
        var uid = sessionStorage.uid;
        var reward = parseFloat($("#reward").val());
        switch($("#item-type").val()) {
            case "lost":
                writeLostItem(cat, dat, desc, lat, lng, name, uid, reward);
                break;
            case "found":
                writeFoundItem(cat, dat, desc, lat, lng, name, uid);
                break;
            case "need":
                writeNeedItem(cat, dat, desc, lat, lng, name, uid);
                break;
            case "donation":
                writeDonationItem(cat, dat, desc, lat, lng, name, uid);
                break;
        }
        $("#item-name").removeClass('alert-success').val("");
        $("#item-desc").removeClass('alert-success').val("");
        $("#lat").removeClass('alert-success').val("");
        $("#long").removeClass('alert-success').val("");
        $("#reward").val("");
        alert("Post Added!");
        

    });
    $("#item-type").change(function() {
        if ($("#item-type").val() == "lost") {
            $("#reward-box").show();                        
        } else {
            $("#reward-box").hide();         
        }
    });
});

function writeNeedItem(cat, dat, desc, lat, long, name, uid) {
  firebase.database().ref('posts/needed-items/' + uid + "---" + dat).set({
    category: cat,
    date: dat,
    description: desc,
    isOpen: true,
    latitude: lat,
    longitude: long,
    name: name,
    uid: uid
    });
}

function writeFoundItem(cat, dat, desc, lat, long, name, uid) {
  firebase.database().ref('posts/found-items/' + uid + "---" + dat).set({
    category: cat,
    date: dat,
    description: desc,
    isOpen: true,
    latitude: lat,
    longitude: long,
    name: name,
    uid: uid
    });
}

function writeDonationItem(cat, dat, desc, lat, long, name, uid) {
  firebase.database().ref('posts/donation-items/' + uid + "---" + dat).set({
    category: cat,
    date: dat,
    description: desc,
    isOpen: true,
    latitude: lat,
    longitude: long,
    name: name,
    uid: uid
    });
}

function writeLostItem(cat, dat, desc, lat, long, name, uid, reward) {
  firebase.database().ref('posts/lost-items/' + uid + "---" + dat).set({
    category: cat,
    date: dat,
    description: desc,
    isOpen: true,
    latitude: lat,
    longitude: long,
    name: name,
    uid: uid,
    reward: reward
    });
}

function validateForm() {
    var b = true;
    if (!$("#item-name").val()) {
        $("#item-name").addClass('alert-danger');
        b = false;
    } else {
        $("#item-name").removeClass('alert-danger');        
        $("#item-name").addClass('alert-success');
    }
    if (!$("#item-desc").val()) {
        $("#item-desc").addClass('alert-danger');
        b = false;
    } else {
        $("#item-desc").removeClass('alert-danger');
        $("#item-desc").addClass('alert-success');        
    }
    if (!$("#lat").val()) {
        $("#lat").addClass('alert-danger');
        b = false;
    } else if ($("#lat").val() > 90 || $("#lat").val() < -90) {
        $("#lat").addClass('alert-danger');
        b = false;
    } else {
        $("#lat").removeClass('alert-danger');         
        $("#lat").addClass('alert-success');        
    }
    if (!$("#long").val()) {
        $("#long").addClass('alert-danger');
        b = false;
    } else if ($("#long").val() > 180 || $("#lat").val() < -180) {
        $("#long").addClass('alert-danger');
        b = false;
    } else {
        $("#long").removeClass('alert-danger');                 
        $("#long").addClass('alert-success');                
    }
    return b;
}