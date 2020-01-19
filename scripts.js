let serviceUuid = 0x180a;
console.log(serviceUuid);
let myCharacteristic;
let myValue = 0;
let myBLE;
var csvContent;
var data = [];

function setup() {
  // Create a p5ble class
  myBLE = new p5ble();
}

function connectToBle() {
  // Connect to a device by passing the service UUID
  myBLE.connect(serviceUuid, gotCharacteristics);
}

// A function that will be called once got characteristics
function gotCharacteristics(error, characteristics) {
  if (error) console.log('error: ', error);
  console.log('characteristics: ', characteristics);
  myCharacteristic = characteristics[0];
  // Read the value of the first characteristic
  myBLE.read(myCharacteristic, gotValue);
}

// A function that will be called once got values
function gotValue(error, value) {
  if (error) console.log('error: ', error);
  console.log('value: ', value);
  myValue = value;

  data.push(value);

  csvContent = data;

  var adcData = document.getElementById("data");
  adcData.innerHTML = myValue;

  var average = math.mean(csvContent);
  average = average.toFixed(4);
  var avg = document.getElementById("avg");
  avg.innerHTML = average;

  var standarddev = math.std(csvContent);
  standarddev = standarddev.toFixed(4)
  var stddev = document.getElementById("stddev");
  stddev.innerHTML = standarddev;

  // After getting a value, call p5ble.read() again to get the value again
  myBLE.read(myCharacteristic, gotValue);
}

// Building the CSV from the Data two-dimensional array
// Each column is separated by ";" and new line "\n" for next row

// data.forEach(function(infoArray, index) {
//   dataString = infoArray.join(';');
//   csvContent += index < data.length ? dataString + '\n' : dataString;
// });

// The download function takes a CSV string, the filename and mimeType as parameters
// Scroll/look down at the bottom of this snippet to see how download is called
var download = function(content, fileName, mimeType) {
  var a = document.createElement('a');
  mimeType = mimeType || 'application/octet-stream';

  if (navigator.msSaveBlob) { // IE10
    navigator.msSaveBlob(new Blob([content], {
      type: mimeType
    }), fileName);
  } else if (URL && 'download' in a) { //html5 A[download]
    a.href = URL.createObjectURL(new Blob([content], {
      type: mimeType
    }));
    a.setAttribute('download', fileName);
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  } else {
    location.href = 'data:application/octet-stream,' + encodeURIComponent(content); // only this mime type is supported
  }
}