// these values for demo and testing only
// delete before merge -- begin
//$("#qryLocation").val("Miami");
//$("#qryCategory").val("Music");
//$("#dateFrom").val("04/15/2017");
//$("#dateThru").val("12/31/2017");
// delete before merge -- end


function getEventfulObjs(){
  // harvest the values from HTML
  // change ID names to match Andrea
  // done, added IDs iL/iC to input fields 4-2-2017-1645
  var qL = $("#iL").val();
  var qC = $("#iC").val();
  
  // if either value is empty, do nothing
  // rationale -- the input field placeholders give instructions
  if (qL === "" || qC === "") {return}

  // Next put the dates into a two element array
  // if grabbing from HTML
  //var d0 = [ $("#dateFrom").val(), $("#dateThru").val()];
  // if using current date thru plus 30 days
  var d0 = [moment().format("MM/DD/YYYY"), moment().add(30, 'days').format("MM/DD/YYYY")];
  console.log(qL, qC, d0[0], d0[1]);

  // validate both dates
  if (moment(d0[0], "MM/DD/YYYY").isValid() && moment(d0[1], "MM/DD/YYYY").isValid()) {
    console.log("dates are valid");

    //concate into Eventful string YYYYMMDD00-YYYYMMDD00
    //Eventful ignores the final two zeroes in the date strings
    var d1 = 
    (
      moment(d0[0], "MM/DD/YYYY").format("YYYYMMDD") + "00-" + 
      moment(d0[1], "MM/DD/YYYY").format("YYYYMMDD") + "00"
    ); 
      console.log(qL, qC, d1);

      //store query to Eventful DATA object
     var oArgs = {
        app_key: "RzH4FnhD29mKTN4g",
        q: qC,
        where: qL,
        "date": d1,
        "include": "tags,categories",
        page_size: 5,
        sort_order: "popularity",
     };

     // call Eventful API with our query
     // passing date string for test display, can be removed
      queryEventfulAPI(oArgs, d1);     

  }
  else
  {
    //error condition, discuss how to handle
    console.log(d0 + " is invalid");
  }
}

function windowOpen(url){
  window.open(url);
}

function queryEventfulAPI(oArgs, d1)
{
   // the Eventful call
   EVDB.API.call("/events/search", oArgs, function(oData) {

      // evts is the complete object
      // for production, return evts?
      var evts = oData.events;
      console.log(oData);

      // put the data into the HTML testing page
      // 4-2-2017 1645 put the data into Andrea's HTML
      for (i=0; i < 5; i++) {

        // this line makes the entire div thumbnail a link to new window/event web page
        $("#th" + i).attr("onclick", "windowOpen('" + evts.event[i].url + "')");

        // continue populating the HTML
        $("#th" + i + " .caption h3").html(evts.event[i].title);
        $("#th" + i + " .caption p").html
          (
            moment(evts.event[i].start_time).format("dddd, MMMM D, YYYY, h:mm:ss a") + "<br>" + 
            evts.event[i].venue_name + "<br>" + 
            evts.event[i].venue_address + "<br>" + evts.event[i].city_name + "<br>" +
            "Lat/Long=" + evts.event[i].latitude + ", " + evts.event[i].longitude
          );
        $("#th" + i + " img").attr("src", evts.event[i].image.medium.url);
      }

    });
}


function FOR_TESTING_NOT_CURRENTLY_USED(){
    $("#qtyResults").html
  (
    "You selected dates: " + d1 + "<br>" + 
    oData.total_items + " results,<br>Here's the first " + oData.page_size + " by popularity:<br>" +
    "============================================="
  );
  // testing
  $("#myResults").empty();

  for (i=0; i<evts.event.length; i++) {
    var d = $("<div>");
    d.attr("style", "padding:5px 0px 5px");
  // andrea 4-2-2017 1645
    d.html(
      "title= "+evts.event[i].title+"<br>" +
      "venue= "+evts.event[i].venue_name+", "+ 
                evts.event[i].venue_address + ", " +
                evts.event[i].venue_address + ", " +
                evts.event[i].city_name + "<br>" +
      " time= "+ evts.event[i].start_time
    );
    $("#myResults").append(d);
  }
}