(function(global) {
"use strict";

// --- dependency modules ----------------------------------
var Float32Array = global["Float32Array"];
var Int16Array = global["Int16Array"];

// --- define / local variables ----------------------------
//var _runOnNode = "process" in global;
//var _runOnWorker = "WorkerLocation" in global;
//var _runOnBrowser = "document" in global;

// --- class / interfaces ----------------------------------
function RecordBuffer(channel,             // @arg Number - number of input channel.
                      maximamBufferSize) { // @arg Number = Infinity - maximam Buffer queue size.
                                           // @ret RecordBuffer
//{@dev
    $args(RecordBuffer, arguments);
//}@dev
    this.channel = channel;
    this.maximamBufferSize = !!maximamBufferSize ? maximamBufferSize : Infinity;
    this.chsBuffers = (function() {
        var _results = [];
        for (var _i = 1; _i <= this.channel; _i++){
            _results.push([]);
        }
        return _results;
    }.apply(this));
}

RecordBuffer["prototype"]["add"] = RecordBuffer_add;
RecordBuffer["prototype"]["toPCM"] = RecordBuffer_toPCM;

// --- implements ------------------------------------------
function RecordBuffer_add(buffers) { // @arg Float32ArrayArray
                                     // @ret RecordBuffer
//{@dev
    $args(RecordBuffer_add, arguments);
//}@dev
    buffers.forEach(function(buffer, i){
        this.chsBuffers[i].push(new Float32Array(buffer));
    }.bind(this));
    // queue
    if (this.chsBuffers[0].length >= this.maximamBufferSize) {
        for (var _j = 0; _j < this.chsBuffers.length; _j++) {
          this.chsBuffers[_j].shift();
        }
    }
    return this;
}

function RecordBuffer_toPCM (){ // @ret Int16Array
//{@dev
    $args(RecordBuffer_toPCM, arguments);
//}@dev
    var chBuffers;
    return toInt16Array(interleave((function() {
        var _i, _len, _ref, _results;
        _ref = this.chsBuffers;
        _results = [];
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
            chBuffers = _ref[_i];
            _results.push(mergeBuffers(chBuffers));
        }
        return _results;
    }).call(this)));
}

function　mergeBuffers(chBuffer) {
  var bufferSize, f32ary, i, v, _i, _len;
  bufferSize = chBuffer[0].length;
  f32ary = new Float32Array(chBuffer.length * bufferSize);
  for (i = _i = 0, _len = chBuffer.length; _i < _len; i = ++_i) {
    v = chBuffer[i];
    f32ary.set(v, i * bufferSize);
  }
  return f32ary;
}

function　interleave(chs) {
  var ch, f32Ary, i, index, inputIndex, length, _i, _len;
  length = chs.length * chs[0].length;
  f32Ary = new Float32Array(length);
  inputIndex = 0;
  index = 0;
  while (index < length) {
    for (i = _i = 0, _len = chs.length; _i < _len; i = ++_i) {
      ch = chs[i];
      f32Ary[index++] = ch[inputIndex];
    }
    inputIndex++;
  }
  return f32Ary;
}

function　toInt16Array(f32ary) {
  var i, int16ary, v, _i, _len;
  int16ary = new Int16Array(f32ary.length);
  for (i = _i = 0, _len = f32ary.length; _i < _len; i = ++_i) {
    v = f32ary[i];
    int16ary[i] = v * 0x7FFF * 0.8;
  }
  return int16ary;
}


// --- validate / assertions -------------------------------
//{@dev
//function $valid(val, fn, hint) { if (global["Valid"]) { global["Valid"](val, fn, hint); } }
//function $type(obj, type) { return global["Valid"] ? global["Valid"].type(obj, type) : true; }
//function $keys(obj, str) { return global["Valid"] ? global["Valid"].keys(obj, str) : true; }
//function $some(val, str, ignore) { return global["Valid"] ? global["Valid"].some(val, str, ignore) : true; }
function $args(fn, args) { if (global["Valid"]) { global["Valid"].args(fn, args); } }
//}@dev

// --- exports ---------------------------------------------
global["WMAudioRecorder_" in global ? "WMAudioRecorder_" : "WMAudioRecorder"]["RecordBuffer"] = RecordBuffer;

})((this || 0).self || global); // WebModule idiom. http://git.io/WebModule
