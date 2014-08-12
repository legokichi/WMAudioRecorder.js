var ModuleTestWMRecord = (function(global) {

var _runOnNode = "process" in global;
var _runOnWorker = "WorkerLocation" in global;
var _runOnBrowser = "document" in global;

navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia;

return new Test("WMRecord", {
        disable:    false,
        browser:    true,
        worker:     false,
        node:       false,
        button:     true,
        both:       true, // test the primary module and secondary module
    }).add([
        test_WMRecord_recording,
    ]).run().clone();

function test_WMRecord_recording(test, pass, miss) {
    navigator.getUserMedia({video: false, audio: true}, function(mediaStream){
        var actx = new AudioContext();

        var recording = true;
        var processor = actx.createScriptProcessor(16384, 2, 2);
        var recbuf = new WMRecord.RecordBuffer(processor.numberOfInputs);
        var source = actx.createMediaStreamSource(mediaStream);
        source.connect(processor);
        processor.connect(actx.destination);

        processor.onaudioprocess = function(ev){
            if(recording){
                var inputBuffers = [];
                for(var i=0; i<processor.numberOfInputs; i++){
                    inputBuffers[i] = ev.inputBuffer.getChannelData(i);
                }
                recbuf.add(inputBuffers);
            }
        };

        window.alert("recording 3 sec. please make some noize.");
        setTimeout(function(){
            recording = false;
            var audio = new WMRecord.Wave(processor.numberOfInputs, actx.sampleRate, recbuf.toPCM()).toAudio();
            audio.autoplay = true;
            document.body.appendChild(audio);
            window.alert("please listen.");
            setTimeout(function(){
              if (window.confirm("Can you hear something right?")) {
                  test.done(pass());
              } else {
                  test.done(miss());
              }
            }, 3000);
        }, 3000);
    }, function(err){ alert("The following error occured: " + err); });

}

})((this || 0).self || global);
