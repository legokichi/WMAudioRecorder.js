# WMAudioRecorder.js [![Build Status](https://travis-ci.org/legokichi/WMAudioRecorder.js.png)](http://travis-ci.org/legokichi/WMAudioRecorder.js)

[![npm](https://nodei.co/npm/legokichi.wmaudiorecorder.js.png?downloads=true&stars=true)](https://nodei.co/npm/legokichi.wmaudiorecorder.js/)

Audio Recorder for Wave file using MediaStream API.

## Document

- [WMAudioRecorder.js wiki](https://github.com/legokichi/WMAudioRecorder.js/wiki/WMAudioRecorder)
- [Development](https://github.com/uupaa/WebModule/wiki/Development)
- [WebModule](https://github.com/uupaa/WebModule) ([Slide](http://uupaa.github.io/Slide/slide/WebModule/index.html))


## How to use

### Browser

```js
<script src="lib/WMAudioRecorder.js"></script>
<script>
var actx = new AudioContext();

var recording = false;
var processor = actx.createScriptProcessor(16384, 2, 2);
var recbuf = new WMAudioRecorder.RecordBuffer(processor.numberOfInputs);

processor.onaudioprocess = function(ev){
    if(recording){
        var inputBuffers = [];
        for(var i=0; i<processor.numberOfInputs; i++){
            inputBuffers[i] = ev.inputBuffer.getChannelData(i);
        }
        recbuf.add(inputBuffers);
    }
};

navigator.getUserMedia({video: false, audio: true}, function(mediaStream){
    var source = actx.createMediaStreamSource(mediaStream);
    source.connect(processor);
}, function(err){ alert("The following error occured: " + err); });


document.body.addEventListener("click", function(){
    recording = !recording;
    if(!recording){
        wav = new WMAudioRecorder.Wave(processor.numberOfInputs, actx.sampleRate, recbuf.toPCM());
        var blob = new Blob([wav.buffer], {"type": "audio/wav"});
        var url =  URL.createObjectURL(blob);
        var audio = document.createElement("audio");
        audio.src = url;
        audio.controls = true;
        audio.autoplay = true;
        document.body.appendChild(audio);
        recbuf = new WMAudioRecorder.RecordBuffer(processor.numberOfInputs);
    }
});

</script>
```


```js
importScripts("lib/WMAudioRecorder.js");

var recbuf = new WMAudioRecorder.RecordBuffer(1);

self.onmessage = function(ev.data){
    if(ev.data.id === "buffer"){
        recbuf.add(ev.data.buffer);
    }else if(ev.data.id === "getWave"){
        var wav = new WMAudioRecorder.Wave(1, ev.data.sampleRate, recbuf.toPCM());
        self.postMessage({"buffer": wav.buffer}, [wav.buffer]);
    }
}
```
