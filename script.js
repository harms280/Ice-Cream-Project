//dropdown menu for different types of dessert
//places with deals (use deals_filter key that takes a bool)
//style most useful review in the middle of the div with cursive font
//Change background color of h1 tag in website to diagonal rainbow pattern
//play audio of treat yourself on website
//throw error when nothing is in search field

$(function(){
    var arrResults;
    var colorsArray;
    var shuffledArray;
    var auth;
    var terms;
    var near;
    var search = 0;
    var sort;
    var prevSort;
    var accessor;
    var parameters;
    var message;
    var parameterMap;
    var locationLength;
    var storeLocation;
    var store;
    var $inputValue;
    var prevSearch;
    var findLocation = 0;
    var currentLocation;

    initialState();

    _$('#searchTerms').submit(function(e){
        e.preventDefault(e);
        submitLocation();
    });

    function initialState() {
        // $('#accordion').hide();
        // $(".jumbotron").hide();
        // $('h2').hide();
        $('.panel').hide();
        console.log(arrResults);
        arrResults = [];
        colorsArray = ["red","blue","purple","green","amber","brown","pink","orange","blue-grey","teal"];
        shuffledArray = _.shuffle(colorsArray);
        console.log(shuffledArray);
        $('.jumbotron').addClass('animatedJumbo fadeInDown');
        $('#jumboText').addClass('animatedJumboText fadeInDown');
        $('.jumbotron').css('visibility','visible');
        $('#location').focus();

    }

    function initMap(store,x) {
      var myLatLng = {lat: store.location.coordinate.latitude, lng: store.location.coordinate.longitude};
      // var myLatLng = new google.maps.LatLng(store.location.coordinate.latitude, store.location.coordinate.longitude);
      map = new google.maps.Map(document.getElementById('map'+ x ), {
        zoom: 14,
        center: myLatLng
      });

      var marker = new google.maps.Marker({
        position: myLatLng,
        map: map,
        title: store.name
      });
      // console.log(myLatLng.lat)
      // console.log(marker)


     // google.maps.event.addListener(map, "idle", function(){
     //        google.maps.event.trigger(map, 'resize');
     //    });


     }
        // $(window).resize(function() {
        //     google.maps.event.trigger(map, 'resize');
        // });
    // function initMap() {

    //     var myLatLng = {lat: store.location.coordinate.latitude, lng: store.location.coordinate.longitude};
    // }
    $('#geolocator').click(function(){
        // $('#accordion').prepend('<h3>Locating</h3>');
        if(!currentLocation) {
            $('#location').val("");
            $('input[type=submit]').prop('disabled',true);
            $('#geolocator').prop('disabled',true);
            if(search >= 1) {
                $('.panel').hide();
            }
            var geocoder;
            loadingText();

            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(successFunction, errorFunction);
            } 
            //Get the latitude and the longitude;
            function successFunction(position) {
                var lat = position.coords.latitude;
                var lng = position.coords.longitude;
                initialize();
                codeLatLng(lat, lng);
            }

            function errorFunction() {
                alert("Geocoder failed");
            }

              function initialize() {
                geocoder = new google.maps.Geocoder();
              }

              function codeLatLng(lat, lng) {

                var latlng = new google.maps.LatLng(lat, lng);
                geocoder.geocode({'latLng': latlng}, function(results, status) {
                  if (status == google.maps.GeocoderStatus.OK) {
                  console.log(results);
                  // console.log(results[0].formatted_address);
                  $inputValue = $('#location').val(results[0].formatted_address);
                  while(!($inputValue)) {
                    $('#location').val(results[0].formatted_address).focus();
                  }
                  currentLocation = results[0].formatted_address;
                    $('div#loading').fadeOut(300);
                    _$('#searchTerms').submit();
                }
                });
                }
        } else {
            $('#location').val(currentLocation);
            // $('div#loading').fadeOut(300);
            _$('#searchTerms').submit();
        }
    });

function loadingText() {
    $('div#loading').fadeIn(1000,function() {

        // while(!($inputValue)) {

        // }

        // $('div#loading').fadeOut(1000);
    });
}


    function submitLocation() {
        if(($('#location').val() !== prevSearch && $('#location').val().length > 0) || parseInt($('#sort').val()) !== prevSort) {
            prevSearch = $('#location').val();
            prevSort = parseInt($('#sort').val());
            var arrResults = [];
            findLocation = 0;
            $('input[type=submit]').prop('disabled',true);
            $('#geolocator').prop('disabled',true);
            if(search >= 1) {
                $('.panel').fadeOut();
            }
            search++;
            auth = {
                //
                // Update with your auth tokens.
                //
                consumerKey : "Ugk1mF42qt8ql-UeLMgnOA",
                consumerSecret : "xNZa9VW5Usi50WYFijWs-CJ3YyE",
                accessToken : "6lqIDFtjQl3pB2RC3o2_6q5VxHE_f0GX",
                // This example is a proof of concept, for how to use the Yelp v2 API with javascript.
                // You wouldn't actually want to expose your access token secret like this in a real application.
                accessTokenSecret : "OxbJ0lConv8wuBax8PK7ZFF9YXI",
                serviceProvider : {
                signatureMethod : "HMAC-SHA1"
                }
            };

            terms = 'ice+cream';
            near = $('#location').val().split(" ").join("+");
            sort = parseInt($('#sort').val());

            accessor = {
                consumerSecret : auth.consumerSecret,
                tokenSecret : auth.accessTokenSecret
            };
            parameters = [];
            parameters.push(['term', terms]);
            parameters.push(['location', near]);
            parameters.push(['sort', sort]);
            parameters.push(['callback', 'cb']);
            parameters.push(['oauth_consumer_key', auth.consumerKey]);
            parameters.push(['oauth_consumer_secret', auth.consumerSecret]);
            parameters.push(['oauth_token', auth.accessToken]);
            parameters.push(['oauth_signature_method', 'HMAC-SHA1']);

            message = {
                'action' : 'http://api.yelp.com/v2/search',
                'method' : 'GET',
                'parameters' : parameters
            };

            OAuth.setTimestampAndNonce(message);
            OAuth.SignatureMethod.sign(message, accessor);

            parameterMap = OAuth.getParameterMap(message.parameters);
            console.log(parameterMap);

            _$.ajax({
            'url' : message.action,
            'data' : parameterMap,
            'dataType' : 'jsonp',
            'jsonpCallback' : 'cb',
            'success' : function(data, textStats, XMLHttpRequest) {
                // console.log(data);
                for (var i = 0; i < 10; i++) {
                    arrResults.push(data.businesses[i]);
                }
                // console.log(arrResults);

                //for loop that creates a map and text for each result in the accordion. use function closure so maps display properly
                for (var x = 0; x < arrResults.length; x++) {
                (function(_x){
                    var store = arrResults[_x];
                    if(!store) {
                        $('input[type=submit]').prop('disabled',false);
                        $('#geolocator').prop('disabled',false);
                        // $('#location').addClass('has-error');
                    }
                        $('#title' + _x).addClass(shuffledArray[_x]);
                        var headerSelector = '#title' + _x + ' a';
                        $(headerSelector).text(store.name);

                        $('#collapse' + _x).addClass(shuffledArray[_x]);
                        var collapseSelector = '#collapse' + _x + ' .panel-inner';

                        //check location details for proper display and assign value to storeLocation
                        locationLength = store.location.display_address.length;
                        if(locationLength < 2) {
                            storeLocation = store.location.display_address[0];
                        } else if(locationLength < 3) {
                            storeLocation = store.location.display_address[0] + (store.location.display_address[1] ? ", <br>" + store.location.display_address[1] : "");
                        } else if (locationLength < 4) {
                            storeLocation = store.location.display_address[0] + (store.location.display_address[2] ? ", <br>" + store.location.display_address[2] : "");
                        } else {
                            storeLocation = store.location.display_address[0] + (store.location.display_address[3] ? ", <br>" + store.location.display_address[3] : "");
                        }

                        //create inner panel text and map
                        $(collapseSelector).html("<div class='container-fluid'><div class='row'><div class='col-md-3'><p class='pull-left'>Yelp Rating: " + store.rating + "  <img src='" + store.rating_img_url + "'>" +
                            "<br>Reviews: " + store.review_count +
                            "<br>" + storeLocation +
                            "<br>"+ (store.display_phone ? store.display_phone : (store.phone || "")) +
                            "<br>Website: <a href=" + store.url+">"+store.url+"</a></p></div>" +
                            "<br><div class='col-md-4'><p><span class='snippet'>\"" + store.snippet_text + "\"</span></p></div>" +
                            "<div id='map" + _x + "' class='pull-right map'></div></div>");

                        //create map in the div and adjust when accordion panel opens or collapses
                            initMap(store,_x);
                            // $('#collapse'+_x ).on('hidden.bs.collapse', function () {
                            //     initMap(store,_x);
                            // });
                            $('#collapse'+_x).on('shown.bs.collapse', function () {
                                initMap(store,_x);
                            });
                        })(x);
                    }

                    //fade in each panel one by one
                    $(".panel").each(function(index) {
                        $(this).delay(400*index).fadeIn(300);
                    });

                    setTimeout(function(){
                        $('input[type=submit]').prop('disabled',false);
                        $('#geolocator').prop('disabled',false);
                    }, 3000);
            }
            });
        }
    }
});