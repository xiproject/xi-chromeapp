'use strict';


document.addEventListener('DOMContentLoaded', function() {
    var h1 = document.getElementsByTagName('h1');
    if (h1.length > 0) {
        h1[0].innerText = h1[0].innerText + ' \'Allo';
    }
    var sr = new webkitSpeechRecognition();
    sr.continuous = true; 
    sr.interimResults = true;
    sr.lang='en-IN';

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
        h1[0].innerText = finalTranscript;
        if (finalTranscript) {
            $.get("http://localhost:9876", {'stt': finalTranscript}, function(response) {
                console.log("response: ", response);
	    });
        }

    };
    sr.start();
}, false);




