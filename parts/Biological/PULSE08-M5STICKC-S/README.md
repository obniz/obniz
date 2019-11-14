# Puls08M5stickcS

Pulse rate can be measured and graphed.

![photo of wired](./image.jpg)


```html

<!-- HTML Example -->

<script src="https://cdnjs.cloudflare.com/ajax/libs/Chart.js/2.7.2/Chart.min.js"></script>
bpm : <span id="bpm"></span>
<canvas id="myChart" style="width:100%;height:400px"></canvas>


<script>
  let myChart;
  setupCharts();
  var obniz = new Obniz("OBNIZ_ID_HERE");

  obniz.onconnect = async function () {
    let device = obniz.wired("Puls08M5stickcS", {tx: 26, rx: 0});
    device.onbpmupdate = (bpm) => {
      $("#bpm").text(bpm.toFixed(1));
    };

    device.onrawupdate = (data) => {
      data.forEach(e => addChart(e));
      scrollToRight();
      myChart.update();
    }
  };

  function setupCharts() {
    let ctx = document.getElementById("myChart").getContext('2d');
    let dataSet = [];
    dataSet.push({
      label: 'raw',
      data: [],
      borderWidth: 1,
      fill: false,
      lineTension: 0,
      borderColor: "rgba(255, 99, 132, 1)",
      backgroundColor: "rgba(255, 99, 132, 1)",
    });


    myChart = new Chart(ctx, {
      type: 'line',
      data: {
        datasets: dataSet
      },
      options: {
        animation: {
          duration: 0,
        },
        scales: {
          xAxes: [{
            type: "time",
            time: {},
            scaleLabel: {
              display: true,
              labelString: 'Time'
            }
          }],
          yAxes: [{
            scaleLabel: {
              display: true,
              labelString: 'Distance'
            },
            ticks: {
              min: 0,
              max: 6000,
            }

          }]
        }
      }
    });
  }

  let x = new Date().getTime();

  function addChart(temps) {
    myChart.data.datasets[0].data.push({x, y: temps});
    x += 1/250 * 1000;
  }

  function scrollToRight() {
    myChart.options.scales.xAxes[0].time.max = x;
    myChart.options.scales.xAxes[0].time.min = x - 10 * 1000;
    for (let i = 0; i < myChart.data.datasets.length; i++) {
      myChart.data.datasets[i].data = myChart.data.datasets[i].data.filter((elm) => {
        return elm.x > myChart.options.scales.xAxes[0].time.min;
      })
    }
  }
</script>
```

## wired(obniz, {vcc, gnd, tx, rx})

```javascript
// Javascript Example
var device = obniz.wired("Puls08M5stickcS", {tx: 26, rx: 0});
device.onbpmupdate = (bpm) => {
   console.log(bpm);
};
```

## onbpmupdate(bpm)

A callback function that is called when the pulse rate can be measured.
If measurement was not successful, null is entered in bpm.
The unit is "bpm".

```javascript
// Javascript Example
var device = obniz.wired("Puls08M5stickcS", {tx: 26, rx: 0});
device.onbpmupdate = (bpm) => {
   console.log(bpm);
};
```

## onrawupdate([values])
The raw data of pulse wave measurement is called back.
It is a number from 0 to 5000, and if you graph it as it is, it will become a pulse wave graph.

The measurement interval is 250Hz, but this function sends all the number of samples read.
If the length of values ​​is 25, it will be 100ms of data at 250Hz

```javascript
// Javascript Example
var device = obniz.wired("Puls08M5stickcS", {tx: 26, rx: 0});
device.onrawupdate = (datas) => {
  for(one of datas){
   console.log(one);
  }
};
    
```
    