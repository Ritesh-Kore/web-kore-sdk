(function(window, $) {
    // Initialize required variables
    var audioStatus = 'idle';
    var speechConfig;
    var synthesizer;
    var player;
    var speechRecognizer;
    

    // Initialize Azure STT
    function initAzureSTT() {
        if (!window.KoreSDK.chatConfig.stt.azure.subscriptionKey) {
            console.error("Azure STT: API key is required");
            return;
        }
    }

    // Stop speaking
    window.stopSpeakingAzure = function() {
        $('.notRecordingMicrophone').css('display', 'block');
        $('.recordingMicrophone').css('display', 'none');
        speechRecognizer.close();
    };

    // Speech-to-Text function
    window.recognizeSpeechWithAzure = function() {

        try {
            var sttConfig = SpeechSDK.SpeechConfig.fromSubscription(
                window.KoreSDK.chatConfig.stt.azure.subscriptionKey,
                'eastus'
            );
            sttConfig.speechRecognitionLanguage = 'en-US'; // Set default language

            // var audioConfig = SpeechSDK.AudioConfig.fromDefaultMicrophoneInput();
            speechRecognizer = new SpeechSDK.SpeechRecognizer(sttConfig);

            console.log("Azure STT initialized successfully");
        } catch (error) {
            console.error("Azure STT initialization failed:", error);
        }

        speechRecognizer.recognizeOnceAsync(result => {
            let text = "";
            switch (result.reason) {
                case SpeechSDK.ResultReason.RecognizedSpeech:
                    text = result.text;
                    
                    document.querySelector('.chatInputBox').innerHTML = text;
                    console.log("Recognized: " + text);
                    break;
                case SpeechSDK.ResultReason.NoMatch:
                    text = "Speech could not be recognized.";
                    $('.recordingMicrophone').css('display', 'none');
                    $('.notRecordingMicrophone').css('display', 'block');
                    console.warn(text);
                    break;
                case SpeechSDK.ResultReason.Canceled:
                    var cancellation = SpeechSDK.CancellationDetails.fromResult(result);
                    text = "Cancelled: Reason= " + cancellation.reason;
                    $('.recordingMicrophone').css('display', 'none');
                    $('.notRecordingMicrophone').css('display', 'block');
                    if (cancellation.reason == SpeechSDK.CancellationReason.Error) {
                        text = "Canceled: " + cancellation.errorDetails;
                    }
                    console.warn(text);
                    break;
            }
        });
    };

    // Initialize when the script loads
    initAzureSTT();

})(window, (jQuery || (window.KoreSDK && window.KoreSDK.dependencies && window.KoreSDK.dependencies.jQuery)));