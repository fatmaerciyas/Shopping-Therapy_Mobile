import React, { useEffect } from "react";
import Voice from "@react-native-voice/voice";

const useVoiceRecognition = (
  onStart: (e: any) => void,
  onEnd: (e: any) => void,
  onResults: (e: any) => void
) => {
  useEffect(() => {
    const initializeVoice = async () => {
      try {
        await Voice.destroy();
        await Voice.removeAllListeners();

        Voice.onSpeechStart = onStart;
        Voice.onSpeechEnd = onEnd;
        Voice.onSpeechResults = onResults;

        console.log("Voice module initialized successfully.");
      } catch (error) {
        console.error("Error initializing Voice module:", error);
      }
    };

    initializeVoice();

    return () => {
      Voice.destroy().then(() => Voice.removeAllListeners());
    };
  }, [onStart, onEnd, onResults]);
};

export default useVoiceRecognition;
