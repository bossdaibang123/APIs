var currentDay = moment().format('MM/ DD/ YYYY') 
var cities = [];

// site structure
var header = $('.header')
    textHeader = $('<h1 class="text-header">')
    textHeader.text('Weather Dashboard')
    header.append(textHeader);

var mainHt = $('main')
var mainL  = $('#main-div-left')

    // name input
    textMD = $('<h4>')
    textMD.text('Search for city')

    //input search
var input = $('<input>')
    
    //button
    Btn = $('<button class="searchBtn">')
    Btn.text('search')

    // status
    Stt = $('<p>')
    Stt.text('Request Status: Waiting')

    // history
    cityList = $('<div>')

    
    mainL.append(textMD)
    mainL.append(input)
    mainL.append(Btn)
    mainL.append(Stt)
    mainL.append(cityList)
    
    //done with left side
    mainHt.append(mainL);

    //right side --- top part 
    var cityName
    mainR = $('#main-div-right')  //containerWeather = mainR
    today = $('#todayy-weather')            //mainDivShow = today
    todayTitle  = $('<h3>')
    todayTitle.text(' Weather Dashboard in '+currentDay)
    today.append(todayTitle);
    mainR.append(today);
    
    // right side --- bottom part
    furture  = $('#future-weather')
    furText  = $('<h4>')
    furText.text('5-Day Forecast: ')
    furture.append(furText)
    mainR.append(furture)
    
    //done with right side
    mainHt.append(mainR)
    
// site function
Btn.on('click', function() {
    if (input.val() === '') {
        return;
    }
    getData();

});

function getData() {
    
    var cityName = 'q=' + input.val()
    var keyAPI   = '22268326ee1d5ca43087f28acd77b745'
    var urlBase  = 'http://api.openweathermap.org/data/2.5/forecast?'
    var urlFinal =  urlBase + cityName +'&appid=' + keyAPI ;
    
    /* for ( i=0; i < APIcall.length; i++ ) {
        listBtn = $('<button>')
        listBtn.text(APIcall[i])
        cityList.append(listBtn)
        mainL.append(cityList)
    } */

    // make a request call 
    fetch(urlFinal)

    .then (function (response) {
        return response.json();
    })

    .then (function (data){
      
        if (data.cod == 404) {
            Stt.text('Request Status: City not found')
            today.empty();
            $('#container').empty();
            todayTitle.text(' Try a different city ')
            today.append(todayTitle);
            mainHt.append(today);      

        }else if (data.cod > 199 && data.cod < 300 ){
            Stt.text('Request Status: Good') 
            today.empty();
            if (container) {
                $('#container').empty();
            }

            //city list      
            clickSearch();

            // show result
            console.log(data)
            
            var cityName = data.city.name
            var lat = data.city.coord.lat
            var lon = data.city.coord.lon

            var urlUvFinal  = 'http://api.openweathermap.org/data/2.5/uvi?lat='+lat+'&lon='+lon+'&appid='+keyAPI
            
            fetch(urlUvFinal)

            .then (function (responseUv) {
                return responseUv.json();
            })
            .then (function (dataUv){
                
                master = data.list[0].main
                
                iconCode    = data.list[0].weather[0].icon
                iconUrl     =   'http://openweathermap.org/img/w/'+iconCode+'.png'
                weatherIcon = $('<img id="icon" src="" alt="weather icon">')
                weatherIcon.css( "max-width", "40%" )  
                weatherIcon.css("max-height", "40%" )
                weatherIcon.attr( 'src' , iconUrl )
                                    
                todayTitle.text(` ${cityName}  (${currentDay}) `)
                todayTitle.append(weatherIcon)    
                today.append(todayTitle);
                
                Ul = $('<div id="listUv">')    

                var tempK = ((master.temp * 9/5) - 459.67).toFixed(1)

                weatherResult = [
                    temp= 'Temperature: ' + tempK +' °F', 
                    humidity='Humidity: ' + master.humidity + ' %', 
                    wind=  'Wind Speed: ' + data.list[0].wind.speed + ' MPH', 
                    UVIndex ='UV Index: ' + dataUv.value
                ];
                
                for (i=0; i < weatherResult.length ; i++) {
                    li= $('<p>')
                    li.text(weatherResult[i])
                    Ul.append(li)
                    today.append(Ul)
                    if (i === 3) {
                        if (dataUv.value <= 3 ) {
                            li.addClass('uvGreen')
                        } else if (dataUv.value > 3 && dataUv.value <= 7 ) {
                            li.addClass('uvYel')
                        } else if (dataUv.value > 7 && dataUv.value <= 11) {
                            li.addClass('uvRed') 
                        } else {
                            li.addClass('uvPu')
                        }
                    }
                }
                
              /*   li= $('<div>')
                li.innerHtml('<div id="UV">' + weatherResult[3] +'<div>')
                console.log('djdjdj')
                Ul.append(li)
                today.append(Ul) */
                
                //done with today div element
                mainR.append(today);

                //showing 5 days weather
                container = $('#container')

                for (i=1; i<6; i++) {

                    eachDay   = $('<div class="each-day">')
                    eachDay.attr ('id',i)
                    
                    iconCode     = data.list[i].weather[0].icon
                    iconUrl      =   'http://openweathermap.org/img/w/'+iconCode+'.png'
                    weatherIcon  = $('<img id="icon" src="" alt="weather icon">')
                    weatherIcon.attr( 'src' , iconUrl )

                    furTime = $('<p>').text(moment().add(i, 'days').format('MM/ DD/ YYYY'))
                    furIcon = $('<p>').html(weatherIcon)
                    furTemp = $('<p>').text('Temp: '    + ((data.list[i].main.temp  * 9/5) - 459.67).toFixed(0) + ' °F')
                    furHumd = $('<p>').text('Humidity: '+ data.list[i].main.humidity + ' %')

                    eachDay.append(furTime)
                    eachDay.append(furIcon)
                    eachDay.append(furTemp)
                    eachDay.append(furHumd)
                    
                    container.append(eachDay)
                }

                furture.append(container)
                mainR.append(furture);

            })
        }else {
            // sever die, not your fault
            Stt.text('Request Status: Error in the HTTP request')

        } 
    })
};


function clickSearch()  {
    if(cities.indexOf(input.val()) == -1){
        //add the value to the array
        cities.push(input.val());
    }

    rendercities();
    storeCity();
    input.val('');
}


function storeCity() {
    localStorage.setItem("History", JSON.stringify(cities))
}

function init() {
    var APIcall = JSON.parse(localStorage.getItem("History"))   ;
    
    if ( APIcall !== null ) {
        cities = APIcall
    }
    
    rendercities();
}

function rendercities() {
    //clear the all list
    cityList.empty()
    
    // make a list
    for ( i=0; i < cities.length; i++ ) {
        var currCity = cities[i]
        liH = $('<div class="sd">');
        liH.text(currCity)
        liH.attr( 'id' , i );    
        cityList.append(liH);
    }
}

cityList.on('click', '.sd', function() {
    input.val( $(this).text() )
    console.log($(this).text())
    getData()
})

init();
