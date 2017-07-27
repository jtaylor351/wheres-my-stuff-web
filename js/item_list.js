$(document).ready(function() {
    userEmailList = [];
    itemList = [];
    foundList = [];
    lostList = [];
    neededList = [];
    donationList = [];
    var foundRef = firebase.database().ref("posts/");
    foundRef.once('value').then(function(postSnap) {
        postSnap.forEach(function(typeSnap) {
            typeSnap.forEach(function(childSnap) {
                var _name = childSnap.child("name").val();
                var _cat = childSnap.child("category").val();                
                var _time = childSnap.child("date").val();
                var _desc = childSnap.child("description").val();
                var _uid = childSnap.child("uid").val();
                var _status = (!childSnap.child("isOpen").val()) ? "Resolved" : "Unresolved";
                var _date = new Date(_time);
                var day = _date.getDate();
                var mm = _date.getMonth() + 1;
                var year = _date.getFullYear();
                var _strDate = mm + "/" + day + "/" + year;
                var _type = typeSnap.key;
                _type = _type.substring(0, _type.length - 1);
                var _uid = childSnap.child("uid").val();
                var itemObj = {name: _name, category: _cat, time: _time,
                     date: _strDate, type: _type, description: _desc, uid: _uid,
                    status: _status};
                if (_type === "lost-item") {
                    var _reward = childSnap.child("reward").val();
                    itemObj.reward = _reward; 
                }
                itemList.push(itemObj);
                switch (_type) {
                    case "donation-item":
                        donationList.push(itemObj);
                        break;
                    case "found-item":
                        foundList.push(itemObj);
                        break;
                    case "lost-item":
                        lostList.push(itemObj);
                        break;
                    case "needed-item":
                        neededList.push(itemObj);
                        break;
                }

            });
        });  
        itemList.sort(function(a,b) {
            return (b.time - a.time);
        });
        donationList.sort(function(a,b) {
            return (b.time - a.time);
        });
        foundList.sort(function(a,b) {
            return (b.time - a.time);
        });
        lostList.sort(function(a,b) {
            return (b.time - a.time);
        });
        neededList.sort(function(a,b) {
            return (b.time - a.time);
        });
        var count = 0;
        itemList.forEach(function(i) {
            $("#tbod").append("<tr>" +
            "<td>"+ count +"</td>" +                        
            "<td>"+ i.name +"</td>" +
            "<td>"+ i.type +"</td>" +
            "<td>"+ i.category +"</td>" +
            "<td>"+ i.date +"</td>" +
            "</tr>");
            count++;
        });
        var userRef = firebase.database().ref("users/");
        userRef.once('value').then(function(postSnap) {
            postSnap.forEach(function(userSnap) {
                var myKey = userSnap.child("uid").val();
                var email = userSnap.child("email").val();
                userEmailList[myKey] = email;
            });
        });
    });
    $("#typeBox").on('change', function() {
        console.log($("#typeBox").val());
        $("#tbod").empty();
        switch($("#typeBox").val()) {
            case "All":
                var count = 0;                            
                itemList.forEach(function(i) {
                    $("#tbod").append("<tr>" +
                    "<td>"+ count +"</td>" +  
                    "<td>"+ i.name +"</td>" +
                    "<td>"+ i.type +"</td>" +
                    "<td>"+ i.category +"</td>" +
                    "<td>"+ i.date +"</td></tr>");
                    count++;
                });
                break;
            case "Lost":
                console.log("Made it to need switch");
                var count = 0;                
                lostList.forEach(function(i) {
                    $("#tbod").append("<tr>"+
                    "<td>"+ count +"</td>" +  
                    "<td>"+ i.name +"</td>" +
                    "<td>"+ i.type +"</td>" +
                    "<td>"+ i.category +"</td>" +
                    "<td>"+ i.date +"</td></tr>");
                    count++;
                });
                break;
            case "Found":
                var count = 0;
                foundList.forEach(function(i) {
                    $("#tbod").append("<tr>"+
                    "<td>"+ count +"</td>" +  
                    "<td>"+ i.name +"</td>" +
                    "<td>"+ i.type +"</td>" +
                    "<td>"+ i.category +"</td>" +
                    "<td>"+ i.date +"</td></tr>");
                    count++;
                });
                break;
            case "Need":
                var count = 0;
                neededList.forEach(function(i) {
                    $("#tbod").append("<tr>"+
                    "<td>"+ count +"</td>" +  
                    "<td>"+ i.name +"</td>" +
                    "<td>"+ i.type +"</td>" +
                    "<td>"+ i.category +"</td>" +
                    "<td>"+ i.date +"</td></tr>");
                    count++;
                });
                break;
            case "Donation":
                var count = 0;
                donationList.forEach(function(i) {
                    $("#tbod").append("<tr>"+
                    "<td>"+ count +"</td>" +  
                    "<td>"+ i.name +"</td>" +
                    "<td>"+ i.type +"</td>" +
                    "<td>"+ i.category +"</td>" +
                    "<td>"+ i.date +"</td></tr>");
                    count++;
                });
                break;
        }
    });

    $('#tbod').on('mouseenter','tr',function() {
        $(this).css("background-color", "grey");
    });
    $('#tbod').on('mouseleave','tr',function() {
        $(this).css("background-color", "");
    });
    $('#tbod').on('click','tr',function() {
        var index = parseFloat($(this).children(":first").html());
        switch ($("#typeBox").val()) {
            case "All":
                var type = itemList[index].type;
                (type === "lost-item") ? makeLostModal(itemList, index) : makeModal(itemList, index);
                break;
            case "Lost":
                makeLostModal(lostList, index);
                break;
            case "Found":
                makeModal(foundList, index);
                break;
            case "Need":
                makeModal(neededList, index);
                break;
            case "Donation":
                makeModal(donationList, index);
                break;
        }
    });
});

function makeModal(arr, index) {
    var name = arr[index].name;
    var description = arr[index].description;
    var status = arr[index].status;
    var category = arr[index].category;
    var uid = arr[index].uid;
    var email = userEmailList[uid];
    var type = arr[index].type;
    $('#mod-head').empty();
    $('#mod-head').append(name);
    var body = "<ul>" +
        "<li>Type: " + type + " </li>" +
        "<li>Category: " + category + " </li>" +
        "<li>Status: " + status + " </li>" +
        "<li>Description: " + description + " </li>" +
        "<li>Contact Info: <a href='mailto:'" + email + "'>" + email +"</a></li>" +
        "</ul>";
    $('#mod-bod').empty();
    $('#mod-bod').append(body);
    $('#modal_item').modal();
}

function makeLostModal(arr, index) {
    var name = arr[index].name;
    var description = arr[index].description;
    var status = arr[index].status;
    var category = arr[index].category;
    var uid = arr[index].uid;
    var email = userEmailList[uid];
    var type = arr[index].type;
    var reward = arr[index].reward;
    $('#mod-head').empty();
    $('#mod-head').append(name);
    var body = "<ul>" +
        "<li>Type: " + type + " </li>" +
        "<li>Category: " + category + " </li>" +
        "<li>Status: " + status + " </li>" +
        "<li>Description: " + description + " </li>" +
        "<li>Reward: $" + reward + " </li>" +
        '<li>Contact Info: <a href="mailto:' + email + '">' + email +"</a></li>" +
        "</ul>";
    $('#mod-bod').empty();
    $('#mod-bod').append(body);
    $('#modal_item').modal();
    
}