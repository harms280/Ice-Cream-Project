//dropdown menu for different types of dessert
//places with deals (use deals_filter key that takes a bool)
//most useful review in the middle of the div
// button in input filed with target to get current location (requires Google Maps)
//Change background color of h1 tag in website to diagonal rainbow pattern
//click event on accordion header a tag that generates a google map? or just generate google map for each one
//play audio of treat yourself on website
//animation for the accordions on new search, set variable to first search which reveals the options, then fadeOut old text then fadeIn new text
//throw error when nothing is in search field
//throw errors for when city is mispelled or offer other options???

$(function(){
    var arrResults;
    var colorsArray;
    var shuffledArray;
    var auth;
    var terms;
    var near;
    var sort;
    var accessor;
    var parameters;
    var message;
    var parameterMap;
    var locationLength;
    var storeLocation;
    var store;

    initialState();



    // initialState();

        // <script type="text/javascript" src="http://ajax.googleapis.com/ajax/libs/jquery/1.4.4/jquery.min.js"></script>
        // <script type="text/javascript" src="http://oauth.googlecode.com/svn/code/javascript/oauth.js"></script>
        // <script type="text/javascript" src="http://oauth.googlecode.com/svn/code/javascript/sha1.js"></script>
        // <script type="text/javascript">
    _$('#searchTerms').submit(function(e) {
        e.preventDefault();
        var arrResults = [];

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
            console.log(data);
            for (var i = 0; i < 10; i++) {
                arrResults.push(data.businesses[i]);
            }
            console.log(arrResults);

            //original version
            for (var x = 0; x < arrResults.length; x++) {
                var store = arrResults[x];
                $('#title' + x).addClass(shuffledArray[x]);
                var headerSelector = '#title' + x + ' a';
                $(headerSelector).text(store.name);

                $('#collapse' + x).addClass(shuffledArray[x]);
                var collapseSelector = '#collapse' + x + ' .panel-inner';

                //check location details for proper display and assign value to storeLocation
                locationLength = store.location.display_address.length;
                if(locationLength < 2) {
                    storeLocation = store.location.display_address[0];
                } else if(locationLength < 3) {
                    storeLocation = store.location.display_address[0] + (store.location.display_address[1] ? ", " + store.location.display_address[1] : "");
                } else if (locationLength < 4) {
                    storeLocation = store.location.display_address[0] + (store.location.display_address[2] ? ", " + store.location.display_address[2] : "");
                } else {
                    storeLocation = store.location.display_address[0] + (store.location.display_address[3] ? ", " + store.location.display_address[3] : "");
                }

                //create inner panel text and map
                $(collapseSelector).html("<p class='pull-left'>Yelp Rating: " + store.rating + 
                    "<br>Number of Reviews: " + store.review_count + 
                    "<br> Address: " + storeLocation +
                    "<br>Phone: "+ (store.display_phone ? store.display_phone : "") + 
                    "<br>Website: <a href=" + store.url+">"+store.url+"</a></p>" +
                    "<div id='map" + x + "' class='pull-right map'></div>");

                //create map in the div
                // initMap(store,x);

                (function(_x){
                    $('#collapse'+_x ).on('hidden.bs.collapse', function () {
                        initMap(store,_x);
                    });
                    $('#collapse'+_x).on('shown.bs.collapse', function () {
                        initMap(store,_x);
                    });
                    })(x);
                // $('#map' +x).on('hidden.bs.collapse', function () {
                //   initMap(store,x);
                // });
                // $('#map'+x).on('shown.bs.collapse', function () {
                //   initMap(store,x); 
                // });

                // var p = document.createElement('p');
                // p.innerText = "Store: "+ store.name + "\n Yelp Rating: " + store.rating+ "\n Number of Reviews: "+store.review_count+"\nPhone: "+ store.display_phone + " Website: " + store.url;
                // document.getElementById('container').appendChild(p);
            }

            $(".panel").each(function(index) {
                $(this).delay(400*index).fadeIn(300);
            });
            
            $('.panel-heading').click(function(e){
                        var x = $(this).attr('data-index');
                        console.log(x);
            //             google.maps.event.trigger(map, 'resize'); 
                        // initMap();
            });

           // $('.panel-heading').click(function() {
           //      // var map = $(this).find('.map');
           //      var center = map.getCenter();
           //      google.maps.event.trigger(map, "resize");
           //      map.setCenter(center); 
           //      });



            // $(".panel-heading").click(function(i){
            //     var checkMap = 'map'+
            //     google.maps.event.trigger('map'+i, 'resize');
            // });
            // $('.panel:nth-child('+ (x+1) + ')').fadeIn();
        // $('#accordion:nth-child(' + (x+1) + ')').fadeIn();

        }
        // }).done(function(response){
        // console.log(response[0].name);
        });
    });

    function initialState() {
        // $('#accordion').hide();
        $('.panel').hide();
        console.log(arrResults);
        arrResults = [];
        colorsArray = ["red","blue","purple","green","amber","brown","pink","orange","blue-grey","teal"];
        shuffledArray = _.shuffle(colorsArray);
        console.log(shuffledArray);
        $('#location').focus();
        
    }

    function initMap(store,x) {
      var myLatLng = {lat: store.location.coordinate.latitude, lng: store.location.coordinate.longitude};
      // var myLatLng = new google.maps.LatLng(store.location.coordinate.latitude, store.location.coordinate.longitude);

      map = new google.maps.Map(document.getElementById('map'+ x ), {
        zoom: 16,
        center: myLatLng
      });
        
      var marker = new google.maps.Marker({
        position: myLatLng,
        map: map,
        title: store.name
      });

      console.log(myLatLng.lat);
      console.log(marker);
    

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
    
});
// $('#searchTerms').on('submit', function(e) {
//         e.preventDefault();
//         var arrResults = [];
//         var shuffledArray = _.shuffle(colorsArray);
//     });
// });
            // $.ajax({
            //     method: "GET",
            //     url: 'http://api.yelp.com/v2/search',
            //     data: {
            //         term: terms,
            //         location: near,
            //         callback: 'cb',
            //         oauth_consumer_key: auth.consumerKey,
            //         oauth_consumer_secret: auth.consumerSecret,
            //         oauth_token: auth.accessToken,
            //         oauth_signature_method: 'HMAC-SHA1'
            //     },
            //     success: function(data) {
            //         console.log(data.businessess[0].name);
            //     }
            // })