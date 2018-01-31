var _7SegmentLEDArray = function() {
  this.identifier = ""+(new Date()).getTime();
};

_7SegmentLEDArray.prototype.wired = function(obniz, seg0, seg1, seg2, seg3) {
  this.obniz = obniz;
  
  this.segments = [];
  if (seg0) {
    this.segments.unshift(seg0);
  }
  if (seg1) {
    this.segments.unshift(seg1);
  }
  if (seg2) {
    this.segments.unshift(seg2);
  }
  if (seg3) {
    this.segments.unshift(seg3);
  }
};

_7SegmentLEDArray.prototype.print = function(data) {
  if (typeof data == "number") {
    data = parseInt(data);

    var segments = this.segments;
    var print = function(index) {
      let val = data;

      for (let i=0; i<segments.length; i++) {
        console.log(val);
        if(index == i) {
          segments[i].print(val%10);
        } else {
          segments[i].off();
        }
        val = val/10;
      }
    }

    var animations = [];
    for (let i=0; i<segments.length; i++) {
      animations.push({
        duration: 3,
        state: print
      })
    } 

    var segments = this.segments;
    obniz.io.animation(this.identifier, "loop", animations)
  }
};

_7SegmentLEDArray.prototype.on = function() {
  obniz.io.animation(this.identifier, "resume")
};

_7SegmentLEDArray.prototype.off = function() {
  obniz.io.animation(this.identifier, "pause")
  for (let i=0; i<this.segments.length; i++) {
    this.segments[i].off();
  }
};

if (PartsRegistrate) {
  PartsRegistrate("7SegmentLEDArray", _7SegmentLEDArray);
}
