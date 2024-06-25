import React, { useEffect, useState } from "react";
import Voice from "@react-native-voice/voice";

export default function useSpeechRecognition() {
  const [text, setText] = useState("");

  const [isListening, setIsListening] = useState(false);

  useEffect(() => {
    Voice.onSpeechResults = (event) => {
      setText(event.value[0]);
    };

    return () => {
      Voice.destroy().then(Voice.removeAllListeners);
    };
  }, []);

  const startListening = async () => {
    try {
      await Voice.start("en-US");
      setIsListening(true);
    } catch (error) {
      console.error("Error starting recognition:", error);
    }
  };

  const stopListening = async () => {
    try {
      await Voice.stop();
      setIsListening(false);
    } catch (error) {
      console.error("Error stopping recognition:", error);
    }
  };

  return {
    text,
    isListening,
    startListening,
    stopListening,
    hasRecognitionSupport: true, // Assuming react-native-voice is installed, so support is always there
  };
}
