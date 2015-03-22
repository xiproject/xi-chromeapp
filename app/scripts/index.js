'use strict';
var sr;
var timeout;
var transcriptElement;
var interimTranscript;
document.addEventListener('DOMContentLoaded', function() {
    transcriptElement = document.getElementsByTagName('h2')[0];

    sr = new webkitSpeechRecognition();
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
        interimTranscript = '';
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
        transcriptElement.innerText = finalTranscript + interimTranscript;
        if (finalTranscript) {
            $.get("http://localhost:9876", {'stt': finalTranscript}, function(response) {
                console.log("response: ", response);
	    }).fail(function() {
                transcriptElement.innerText = 'couldn\'t connect with core';
            });
        }

        if (timeout) {
            clearTimeout(timeout);
        }
        timeout = setTimeout(clearTranscript, 3000);


    };
    sr.start();
}, false);


function clearTranscript() {
    if (interimTranscript) {
        $.get("http://localhost:9876", {'stt': interimTranscript}, function(response) {
            console.log("response: ", response);
	}).fail(function() {
            transcriptElement.innerText = 'couldn\'t connect with core';
        });
        console.log('Taking too long, sending interim transcript');
        sr.stop();
    }
    interimTranscript = '';
    transcriptElement.innerText = ''
}


