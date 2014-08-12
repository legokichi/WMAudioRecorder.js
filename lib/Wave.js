(function(global) {
"use strict";

// --- dependency modules ----------------------------------
var URL = global["URL"] || global["webkitURL"] || global["mozURL"];
var document = global["document"];
var DataView = global["DataView"];
var ArrayBuffer = global["ArrayBuffer"];
var Blob = global["Blob"];

// --- define / local variables ----------------------------
//var _runOnNode = "process" in global;
//var _runOnWorker = "WorkerLocation" in global;
//var _runOnBrowser = "document" in global;

// --- class / interfaces ----------------------------------
function Wave(channel,    // @arg Number - n channel
              sampleRate, // @arg Number
              pcmdata) {  // @arg ArrayBuffer - n bit n ch PCM raw data
                          // @ret Wave
//{@dev
    $args(Wave, arguments);
//}@dev
    var bitsPerSample, i, int16, offset, buffer, size, view, _i, _len;
    var int16ary = new Int16Array(pcmdata);
    size = int16ary.length * 2; // データサイズ (byte) # 8bit*2 = 16bit
    channel = channel; // チャンネル数 (1:モノラル or 2:ステレオ)
    bitsPerSample = 16; // サンプルあたりのビット数 (8 or 16) # 16bit PCM
    offset = 44; // ヘッダ部分のサイズ
    buffer = new ArrayBuffer(offset + size);
    view = new DataView(buffer); // バイト配列を作成
    writeUTFBytes(view, 0, "RIFF"); //  Chunk ID # RIFF ヘッダ
    view.setUint32(4, offset + size - 8, true); // Chunk Size # ファイルサイズ - 8
    writeUTFBytes(view, 8, "WAVE"); // Format # WAVE ヘッダ
    writeUTFBytes(view, 12, "fmt "); // Subchunk 1 ID # fmt チャンク
    view.setUint32(16, 16, true); // Subchunk 1 Size # fmt チャンクのバイト数
    view.setUint16(20, 1, true); //  Audio Format # フォーマットID
    view.setUint16(22, channel, true); // Num Channels # チャンネル数
    view.setUint32(24, sampleRate, true); // Sample Rate (Hz) # サンプリングレート
    view.setUint32(28, sampleRate * (bitsPerSample >>> 3) * channel, true); // Byte Rate (サンプリング周波数 * ブロックサイズ) # データ速度
    view.setUint16(32, (bitsPerSample >>> 3) * channel, true); // Block Align (チャンネル数 * 1サンプルあたりのビット数 / 8) # ブロックサイズ
    view.setUint16(34, bitsPerSample, true); // Bits Per Sample # サンプルあたりのビット数
    writeUTFBytes(view, 36, 'data'); // Subchunk 2 ID
    view.setUint32(40, size, true); // Subchunk 2 Size # 波形データのバイト数
    for (i = _i = 0, _len = int16ary.length; _i < _len; i = ++_i) {
        int16 = int16ary[i];
        view.setInt16(offset + i * 2, int16, true);
    }
    this["buffer"] = buffer;
}

Wave["prototype"]["toBlob"] = Wave_toBlob;
Wave["prototype"]["toURL"] = Wave_toURL;
Wave["prototype"]["toAudio"] = Wave_toAudio;

// --- implements ------------------------------------------

function writeUTFBytes(view, offset, str) {
  var i, _i, _ref;
  for (i = _i = 0, _ref = str.length; 0 <= _ref ? _i < _ref : _i > _ref; i = 0 <= _ref ? ++_i : --_i) {
    view.setUint8(offset + i, str.charCodeAt(i), true);
  }
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
global["WMAudioRecorder_" in global ? "WMAudioRecorder_" : "WMAudioRecorder"]["Wave"] = Wave; // switch module. http://git.io/Minify

})((this || 0).self || global); // WebModule idiom. http://git.io/WebModule
