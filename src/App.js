import React, { Component } from "react";
import { Button } from "react-bootstrap";
import SpeechRecognition from "react-speech-recognition";

class App extends Component {
  state = {};
  componentDidMount() {
    this.props.recognition.lang = "en-US";
  }
  render() {
    const {
      transcript,
      resetTranscript,
      browserSupportsSpeechRecognition
    } = this.props;
    if (!browserSupportsSpeechRecognition) {
      return null;
    }
    console.log("A", transcript);
    return (
      <div>
        <Button className="w-100" onClick={resetTranscript}>
          Reset
        </Button>
        <span>{transcript}</span>
      </div>
    );
  }
}

export default SpeechRecognition(App);
