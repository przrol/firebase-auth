import React, { useContext, useEffect, useState } from "react";
import Navigation from "../Navigation";
import { QuizContext } from "../../contexts/QuizContext";
import Card from "react-bootstrap/Card";
import Form from "react-bootstrap/Form";
import Alert from "react-bootstrap/Alert";
import DarkMode from "../darkMode/darkMode.component";
import EditExam from "../editExam/editExam.component";
import { importDataToFirestore } from "../../firebase";

export default function TextToSpeech() {
  const [state, dispatch] = useContext(QuizContext);
  const [isPaused, setIsPaused] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [voices, setVoices] = useState([]);
  const [selectedVoice, setSelectedVoice] = useState(null);
  const [rate, setRate] = useState(1);
  const [pitch, setPitch] = useState(1);
  const [volume, setVolume] = useState(1);

  useEffect(() => {
    // Get available voices
    const updateVoices = () => {
      const voices = window.speechSynthesis.getVoices().filter(v => v.lang === 'en-US' || v.lang === 'en-GB' || v.lang.startsWith('de-'))

      setVoices(voices);
    };

    updateVoices();
    window.speechSynthesis.onvoiceschanged = updateVoices;

    return () => {
      window.speechSynthesis.onvoiceschanged = null;
    };
  }, []);

  

  const handleSpeak = () => {
    const synth = window.speechSynthesis;

    const utterance = new SpeechSynthesisUtterance("You are building an AI system. Which task should you include?");
    
    if (selectedVoice) {
      utterance.voice = selectedVoice;
    }
    
    utterance.rate = rate;
    utterance.pitch = pitch;
    utterance.volume = volume;

    // // is playing and should paused
    // if (!isPaused) {
    //   synth.pause();
    //   setIsPaused(true);
    // }
    // // is paused and should play
    // else {
    //   synth.resume();
    //   setIsPaused(false);
    // }

    synth.speak(utterance);
  };

  return (
    <>
      <Navigation />
      <Card
        bg={state.isDarkMode ? "dark" : "light"}
        className="mx-auto"
        style={{ maxWidth: "800px" }}
      >
        <Card.Header className="text-center">Text to speech</Card.Header>
        <Card.Body>
          <Form>
          <div>
      <select 
        onChange={(e) => setSelectedVoice(voices[e.target.value])}
      >
        {voices.map((voice, index) => (
          <option key={index} value={index}>
            {voice.name} ({voice.lang})
          </option>
        ))}
      </select>

      <div>
        <label>Rate: </label>
        <input 
          type="range" 
          min="0.5" 
          max="2" 
          step="0.1" 
          value={rate}
          onChange={(e) => setRate(parseFloat(e.target.value))}
        />
      </div>

      <div>
        <label>Pitch: </label>
        <input 
          type="range" 
          min="0" 
          max="2" 
          step="0.1" 
          value={pitch}
          onChange={(e) => setPitch(parseFloat(e.target.value))}
        />
      </div>

      <div>
        <label>Volume: </label>
        <input 
          type="range" 
          min="0" 
          max="1" 
          step="0.1" 
          value={volume}
          onChange={(e) => setVolume(parseFloat(e.target.value))}
        />
      </div>

      <button type="button" onClick={handleSpeak}>{isPaused ? 'Pause' : 'Speak'}</button>
    </div>
          </Form>
          
        </Card.Body>
      </Card>

      <DarkMode />
    </>
  );
}
