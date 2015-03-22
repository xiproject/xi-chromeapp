'use strict';


document.addEventListener('DOMContentLoaded', function() {
    var h2 = document.getElementsByTagName('h2');
    if (h2.length > 0) {
        h2[0].innerText = h2[0].innerText + ' \'Allo';
    }
    var sr = new webkitSpeechRecognition();
    sr.continuous = true; 
    sr.interimResults = true;
    sr.lang='en-IN';
    sr.onerror = function(event) {
        console.log(event.error);
    };

    sr.onstart = function() {
        console.log('Recognition started');

    };
    sr.onend = function() {
        console.log('Recognition ended');
        sr.start();
    };
    sr.onresult = function(e) {
        var finalTranscript = '';
        var interimTranscript = '';
        for (var i = event.resultIndex; i < event.results.length; ++i) {
            if (event.results[i].isFinal) {
                finalTranscript += event.results[i][0].transcript;
            } else {
                interimTranscript += event.results[i][0].transcript;
            }
        } 
        for (var i = 0; i < event.results.length; ++i) {
            var str;
            if (i === event.resultIndex) {
                str = 'result index';
            }
            console.log(event.results[i][0].transcript, event.results[i].isFinal, str);
        }
        h2[0].innerText = finalTranscript + interimTranscript;
        if (finalTranscript) {
            $.get("http://localhost:9876", {'stt': finalTranscript}, function(response) {
                console.log("response: ", response);
	    });
        }
    };
    sr.start();
}, false);




