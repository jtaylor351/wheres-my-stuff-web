$(document).ready(function() {
    var itemList = [];
    var foundList = [];
    var lostList = [];
    var neededList = [];
    var donationList = [];
    var foundRef = firebase.database().ref("posts/");
    foundRef.once('value').then(function(postSnap) {
        postSnap.forEach(function(typeSnap) {
            typeSnap.forEach(function(childSnap) {
                var _name = childSnap.child("name").val();
                var _cat = childSnap.child("category").val();                
                var _time = childSnap.child("date").val();
                var _date = new Date(_time);
                var day = _date.getDate();
                var mm = _date.getMonth() + 1;
                var year = _date.getFullYear();
                var _strDate = mm + "/" + day + "/" + year;
                var _type = typeSnap.key;
                var itemObj = {name: _name, category: _cat, time: _time, date: _strDate, type: _type};
                itemList.push(itemObj);
                switch (_type) {
                    case "donation-items":
                        donationList.push(itemObj);
                        break;
                    case "found-items":
                        foundList.push(itemObj);
                        break;
                    case "lost-items":
                        lostList.push(itemObj);
                        break;
                    case "needed-items":
                        neededList.push(itemObj);
                        break;
                }

            });
        });  
        console.log("Length of itemList: " + itemList.length);
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
        itemList.forEach(function(i) {
            console.log(i.name);
            $("#tbod").append("<tr><td>"+ i.name +"</td>" +
            "<td>"+ i.type +"</td>" +
            "<td>"+ i.category +"</td>" +
            "<td>"+ i.date +"</td></tr>");
        });                    
    });
    $("#typeBox").change(function() {
        $("#tbod").empty();
        switch($("#typeBox").val()) {
            case "All":
                itemList.forEach(function(i) {
                    console.log(i.name);
                    $("#tbod").append("<tr><td>"+ i.name +"</td>" +
                    "<td>"+ i.type +"</td>" +
                    "<td>"+ i.category +"</td>" +
                    "<td>"+ i.date +"</td></tr>");
                });
                break;
            case "Lost":
                lostList.forEach(function(i) {
                    console.log(i.name);
                    $("#tbod").append("<tr><td>"+ i.name +"</td>" +
                    "<td>"+ i.type +"</td>" +
                    "<td>"+ i.category +"</td>" +
                    "<td>"+ i.date +"</td></tr>");
                });
                break;
            case "Found":
                foundList.forEach(function(i) {
                    console.log(i.name);
                    $("#tbod").append("<tr><td>"+ i.name +"</td>" +
                    "<td>"+ i.type +"</td>" +
                    "<td>"+ i.category +"</td>" +
                    "<td>"+ i.date +"</td></tr>");
                });
                break;
            case "Need":
                neededList.forEach(function(i) {
                    console.log(i.name);
                    $("#tbod").append("<tr><td>"+ i.name +"</td>" +
                    "<td>"+ i.type +"</td>" +
                    "<td>"+ i.category +"</td>" +
                    "<td>"+ i.date +"</td></tr>");
                });
                break;
            case "Donation":
                donationList.forEach(function(i) {
                    console.log(i.name);
                    $("#tbod").append("<tr><td>"+ i.name +"</td>" +
                    "<td>"+ i.type +"</td>" +
                    "<td>"+ i.category +"</td>" +
                    "<td>"+ i.date +"</td></tr>");
                });
                break;
        }
    });
});