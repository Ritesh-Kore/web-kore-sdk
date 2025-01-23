(function(window) {
    // Initialize required variables
    var audioStatus = 'idle';
    var speechConfig;
    var synthesizer;
    var player;

    // Initialize Azure TTS
    function initAzureTTS() {
        if (!window.KoreSDK.chatConfig.azureTTS || !window.KoreSDK.chatConfig.azureTTS.key) {
            console.error("Azure TTS: API key is required");
            return;
        }

        try {
            speechConfig = SpeechSDK.SpeechConfig.fromSubscription(
                window.KoreSDK.chatConfig.azureTTS.key, 
                window.KoreSDK.chatConfig.azureTTS.region || 'eastus'
            );
            console.log('----------speechConfig-------', window.KoreSDK)
            
            // Create audio player
            // player = new SpeechSDK.SpeakerAudioDestination();
            // var audioConfig = SpeechSDK.AudioConfig.fromSpeakerOutput(player);
            
            // Create synthesizer
            synthesizer = new SpeechSDK.SpeechSynthesizer(speechConfig);
            
            console.log("Azure TTS initialized successfully");
        } catch (error) {
            console.error("Azure TTS initialization failed:", error);
        }
    }

    // Main speak function
    window.speakTextWithAzure = function(textToSpeak) {
        if (!synthesizer) {
            console.error("Azure TTS not initialized");
            return;
        }

        if (audioStatus === 'speaking') {
            player.pause();
        }

        audioStatus = 'speaking';
        // replace below method in new
        synthesizer.speakTextAsync(
            textToSpeak,
            result => {
                if (result) {
                    audioStatus = 'idle';
                    console.log("Speech synthesis succeeded");
                }
            },
            error => {
                audioStatus = 'idle';
                console.error("Speech synthesis failed:", error);
            }
        );
    };

    // Stop speaking
    window.stopSpeakingAzure = function() {
        if (player) {
            player.pause();
            audioStatus = 'idle';
        }
    };

    // Initialize when the script loads
    initAzureTTS();

})(window);
