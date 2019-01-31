"use strict";
//
//  Shawn said it was ok to redact the apiKey.  I will be sending this when I upload it
//
//
var trainList = [];
var database;
var config = {
  apiKey: "please replace with api key i provided",
  authDomain: "train-project-701b4.firebaseapp.com",
  databaseURL: "https://train-project-701b4.firebaseio.com",
  projectId: "train-project-701b4",
  storageBucket: "train-project-701b4.appspot.com",
  messagingSenderId: "809148037025"
};
firebase.initializeApp(config);

database = firebase.database();

$("#add-train-btn").on("click", function (event) {
  event.preventDefault();

  var trainName = $("#name").val().trim();
  var trainDestination = $("#destination").val().trim();
  var trainInitial = $("#initial").val().trim();
  var trainFrequency = $("#frequency").val().trim();

  var tmpTrain = {
    name: trainName,
    destination: trainDestination,
    initial: trainInitial,
    frequency: trainFrequency
  };
  database.ref().push(tmpTrain);
  $("#name").val("");
  $("#destination").val("");
  $("#initial").val("");
  $("#frequency").val("");
});
class trains {
  constructor(trainin, destin, initialin, freqin) { 
    this.name = trainin;
    this.destination = destin;
    this.initial = initialin;
    this.freq = freqin;
  }
}

function displayTrains() {
  var html_s = "";
  var timeSnapshot;
  var testOffset;
  var nextTrainTime;
  var testTime ;
  var minuteString;
  var timeString;
  var timeSnapshot = moment(); // use same time for all calculations to ensure consistency
  $("#schedTable").empty();
  html_s = `    <tr>
                    <th>Train Name</th>
                    <th>Destination</th>
                    <th>Frequency (min)</th>
                    <th>Next Arrival</th>
                    <th>Minutes Away</th>
                </tr>`;
  for (var z = 0; trainList.length > z; z++) {
    // copy the snapshot of the time to a testtime so that the reference to timeSnapshot is not lost.
    testTime = timeSnapshot; // get the right day
    testTime = moment(trainList[z].initial, "hh:mm");
    nextTrainTime = null;
    testOffset = parseInt(trainList[z].freq);

     // this do loop keeps adding time until it finds the first time that is after now
     // if it does not find after midnight it gives up
    do {
        if (testTime.isAfter(timeSnapshot, "second"))
          nextTrainTime = testTime;
        testTime.add(testOffset, "minutes");
    } while (nextTrainTime == null && !testTime.isAfter(timeSnapshot, "day"));
    if (nextTrainTime != null) {
      timeString = nextTrainTime.format(" h:mm:ss a");
      minuteString = ((moment.duration(nextTrainTime.diff(timeSnapshot)).get("hours") * 60) + moment.duration(nextTrainTime.diff(timeSnapshot)).get("minutes"));
    }
    else {  // there are more trains scheduled for today
      timeString = "None Scheduled";
      minuteString = "N/A";
    }
    console.log("zzzzzzzzzzzzzzminstring:" + minuteString);
    html_s = html_s + `<tr>
                          <td>${trainList[z].name}</td>
                          <td>${trainList[z].destination}</td>
                          <td>${trainList[z].freq}</td>
                          <td>${timeString}</td>
                          <td>${minuteString}</td>
                      </tr>`;

  }
  $("#schedTable").append(html_s);
}
database.ref().on("child_added", function (childSnapshot) {
  console.log(childSnapshot.val());
  var trainName = childSnapshot.val().name;
  var trainDestination = childSnapshot.val().destination;
  var trainInitial = childSnapshot.val().initial;
  var trainFrequency = childSnapshot.val().frequency;
  trainList.push(new trains(trainName, trainDestination, trainInitial, trainFrequency));
  displayTrains();
});


$(document).ready(function () {
  $("#pressed").button().click(function () {
    event.preventDefault();
    var name = $("#name").val();
    var destination = $("#destination").val();
    var initial = $("#initial").val();
    var frequency = $("#frequency").val();
    alert(destination + initial + frequency + name);
  });
});
