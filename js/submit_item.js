$(document).ready(function() {
    google.maps.event.addDomListener(window, "resize", resizeMap());      
    // $("#map-form").hide();        
    $("#place-but").click(function() {
         $("#map-form").toggle();
         google.maps.event.trigger(map, "resize");
    });
    // google.maps.event.addDomListener(window, 'load', initAutocomplete);
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
        $("#map-form").hide();
        alert("Post Added!");
        

    });
    $("#item-type").change(function() {
        if ($("#item-type").val() == "lost") {
            $("#reward-box").show();                        
        } else {
            $("#reward-box").hide();         
        }
    });
    
    $("#place-select").click(function() {
        $("#lat").val(currentPlace.geometry.location.lat());
        $("#long").val(currentPlace.geometry.location.lng());
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
// var map = null;
// function initMap() {
//     map = new google.maps.Map(
//         document.getElementById('map'), {
//         center: new google.maps.LatLng(37.4419, -122.1419),
//         zoom: 2,
//         mapTypeId: 'roadmap'
//     });
// }

function resizeMap() {
   if(typeof map =="undefined") return;
   setTimeout( function(){resizingMap();} , 400);
}

function resizingMap() {
    if(typeof map =="undefined") return;
    var center = map.getCenter();
    google.maps.event.trigger(map, "resize");
    map.setCenter(center); 
}

function initAutocomplete() {
        map = new google.maps.Map(document.getElementById('map'), {
          center: {lat: 33.7489954, lng: -84.3879824},
          zoom: 2,
          mapTypeId: 'roadmap'
        });
        // Create the search box and link it to the UI element.
        var input = document.getElementById('address');
        var searchBox = new google.maps.places.SearchBox(input);
        map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);

        // Bias the SearchBox results towards current map's viewport.
        map.addListener('bounds_changed', function() {
          searchBox.setBounds(map.getBounds());
        });

        var markers = [];
        // Listen for the event fired when the user selects a prediction and retrieve
        // more details for that place.
        searchBox.addListener('places_changed', function() {
          var places = searchBox.getPlaces();
          currentPlace = places[0];
          if (places.length == 0) {
            return;
          }

          // Clear out the old markers.
          markers.forEach(function(marker) {
            marker.setMap(null);
          });
          markers = [];

          // For each place, get the icon, name and location.
          var bounds = new google.maps.LatLngBounds();
        //   places.
          var marker = new google.maps.Marker({
                    position: currentPlace.geometry.location,
                    map: map,
                    title: currentPlace.name,
                    icon: "http://maps.google.com/mapfiles/ms/icons/red-dot.png"
                });
            if (currentPlace.geometry.viewport) {
              // Only geocodes have viewport.
              bounds.union(currentPlace.geometry.viewport);
            } else {
              bounds.extend(currentPlace.geometry.location);
            }
            markers[0] = marker;
          map.fitBounds(bounds);
        });
      }