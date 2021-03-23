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
    input = $('<input>')
    
    //button
    Btn = $('<button class="searchBtn">')
    Btn.text('search')

    // status
    Stt = $('<p>')
    Stt.text('Request Status: Waiting')

    // history
    cityList = $('<ul>')

    
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
            console.log(cities)      
           // clickSearch();

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
                weatherIcon.attr( 'src' , iconUrl )
                                    
                todayTitle.text(` ${cityName} ${currentDay}`)
                todayTitle.append(weatherIcon)    
                today.append(todayTitle);
                
                Ul = $('<div id"list">')

                weatherResult = [
                    temp= 'Temperature: '  + master.temp +' °F', 
                    humidity='Humidity: ' + master.humidity + ' %', 
                    wind=  'Wind Speed: '  + data.list[0].wind.speed + ' MPH', 
                    UVIndex ='UV Index: '  + dataUv.value
                ];
                
                for (i=0; i < weatherResult.length ; i++) {
                    li= $('<p>')
                    li.text(weatherResult[i])
                    Ul.append(li)
                    today.append(Ul)
                }
                
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
                    furTemp = $('<p>').text('Temp: ' + data.list[i].main.temp + ' °F')
                    furHumd = $('<p>').text('Humidity: ' + data.list[i].main.humidity + ' %')

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

/*

function clickSearch()  {

    console.log(cities)
    cities.push(input.val());
    console.log(cities)

    rendercities();
    storeCity();
}




function storeCity() {
    //save search history
    localStorage.setItem("History", JSON.stringify(cities))
    console.log(cities)           
}


function init() {
    var APIcall = JSON.parse(localStorage.getItem("History"))   ;
    
    if ( APIcall !== null ) {
        cities = APIcall
        console.log(cities)
    }



    console.log(typeof cities)
    rendercities();
}

function rendercities() {
    // make a list
    console.log(typeof cities)
    console.log(cities.length)
    for ( i=0; i < cities.length; i++ ) {
        var cities = cities[i]
        liH = $('<li>');
        liH.text(cities)
        liH.attr("data-index" , i );
        
        console.log('ạdjkasdf')
        var button= $('button')
        button.text("find")

        liH.appendChild(button);
        cityList.appendChild(liH);
        mainL.append(cityList);
    }
}

init();

*/