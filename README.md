# WMRecord.js [![Build Status](https://travis-ci.org/legokichi/WMRecord.js.png)](http://travis-ci.org/legokichi/WMRecord.js)

[![npm](https://nodei.co/npm/legokichi.wmrecord.js.png?downloads=true&stars=true)](https://nodei.co/npm/legokichi.wmrecord.js/)

Audio Recorder using MediaStream API.

## Document

- [WMRecord.js wiki](https://github.com/legokichi/WMRecord.js/wiki/WMRecord)
- [Development](https://github.com/uupaa/WebModule/wiki/Development)
- [WebModule](https://github.com/uupaa/WebModule) ([Slide](http://uupaa.github.io/Slide/slide/WebModule/index.html))


## How to use

### Browser

```js
<script src="lib/WMRecord.js"></script>
<script>
var actx = new AudioContext();

var recording = false;
var processor = actx.createScriptProcessor(16384, 2, 2);
var recbuf = new WMRecord.RecordBuffer(processor.numberOfInputs);

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
        var audio = new WMRecord.Wave(2, actx.sampleRate, recbuf.toPCM()).toAudio()
        document.body.appendChild(audio);
        recbuf = new WMRecord.RecordBuffer(processor.numberOfInputs);
    }
});

</script>
```
