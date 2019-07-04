import React, { Component } from "react";
import { Button, Form } from "react-bootstrap";
import SpeechRecognition from "react-speech-recognition";
const Diff = require("diff");

class App extends Component {
  state = {
    text: "",
    textPointer: 0
  };
  componentWillReceiveProps() {
    const { transcript } = this.props;
    console.log(transcript);
  }
  componentDidMount() {
    this.props.recognition.lang = "en-US";
    // this.props.recognition.onresult = event => {
    //   console.log(event);
    //   for (let i = event.resultIndex; i < event.results.length; i++) {
    //     const res = event.results[i][0];
    //     console.log(res);
    //   }
    // };
    const SpeechGrammarList =
      window.SpeechGrammarList ||
      window.webkitSpeechGrammarList ||
      window.mozSpeechGrammarList ||
      window.msSpeechGrammarList ||
      window.oSpeechGrammarList;
    var speechRecognitionList = new SpeechGrammarList();
    speechRecognitionList.addFromString("recognition", 1);
    this.props.recognition.grammars = speechRecognitionList;
  }
  setText = e => {
    this.setState({ text: e.target.value });
  };
  toggleTranscript = () => {
    const {
      startListening,
      listening,
      stopListening,
      resetTranscript
    } = this.props;
    console.log(this.props);
    resetTranscript();
    return listening ? stopListening() : startListening();
  };

  render() {
    const { text } = this.state;
    const {
      transcript,
      listening,
      resetTranscript,
      browserSupportsSpeechRecognition
    } = this.props;
    if (!browserSupportsSpeechRecognition) {
      return null;
    }
    let result = Diff.diffWords(text, transcript, { ignoreCase: true }).map(
      y => {
        console.log(y);
        let className = "correct";
        if (y.removed) className = "removed";
        if (y.added) className = "added";
        return <span className={className}>{y.value}</span>;
      }
    );
    console.log(result);
    return (
      <div className="m-5">
        <Form>
          <Form.Group>
            <Form.Control onChange={this.setText} as="textarea" rows="5" />
          </Form.Group>
        </Form>
        <Button onClick={this.toggleTranscript} type="submit" className="w-100">
          {listening ? "Stop it!" : "Let's train!"}
        </Button>

        <div className="m-3">{result}</div>
      </div>
    );
  }
}

const options = {
  autoStart: false
};
export default SpeechRecognition(options)(App);
