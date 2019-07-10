import React, { Component } from "react";
import { Button, Form } from "react-bootstrap";
import SpeechRecognition from "react-speech-recognition";
const Diff = require("diff");

class App extends Component {
  state = {
    pointer: 0,
    spans: []
  };
  componentWillReceiveProps() {
    const { transcript } = this.props;
  }

  processWord = transcript => {
    const { pointer, spans } = this.state;
    if (pointer >= spans.length) return;
    const expectedTranscript = spans
      .slice(pointer, spans.length)
      .map(x => x[0]);
    transcript = transcript.split([" "]).filter(x => x !== "");

    let qtdWords = Math.min(expectedTranscript.length, transcript.length);

    let newPointer = pointer;
    console.log(pointer, qtdWords);
    for (var i = 0; i < qtdWords; i++) {
      console.log(
        expectedTranscript[i],
        transcript[i],
        expectedTranscript[i].toUpperCase() === transcript[i].toUpperCase()
      );
      if (expectedTranscript[i].toUpperCase() === transcript[i].toUpperCase()) {
        newPointer++;
      } else {
        break;
      }
    }
    this.setState({ pointer: newPointer }, this.paintWords);
  };

  paintWords() {
    const { spans, pointer } = this.state;
    let newSpans = [...spans];
    for (let i = 0; i < pointer; i++) {
      newSpans[i][1] = (
        <span key={newSpans[i][0]} style={{ color: "green" }}>
          {newSpans[i][0]}
        </span>
      );
    }

    this.setState({ spans: newSpans });
  }
  componentDidMount() {
    this.props.recognition.lang = "en-US";
    this.props.recognition.onresult = event => {
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const res = event.results[i];
        if (res.isFinal) {
          this.processWord(res[0].transcript);
        }
      }
    };
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
    let spans = e.target.value.split(" ").reduce((x, y) => {
      x.push([
        y,
        <span key={y} style={{ color: "black" }}>
          {y}
        </span>
      ]);
      return x;
    }, []);

    this.setState({ spans });
  };
  toggleTranscript = () => {
    const {
      startListening,
      listening,
      stopListening,
      resetTranscript
    } = this.props;
    resetTranscript();
    return listening ? stopListening() : startListening();
  };

  render() {
    const { spans } = this.state;
    const {
      transcript,
      listening,
      resetTranscript,
      browserSupportsSpeechRecognition
    } = this.props;
    if (!browserSupportsSpeechRecognition) {
      return null;
    }
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

        <div className="m-3">
          {spans.map(x => x[1]).reduce((x, y) => [x, " ", y], [])}
        </div>
      </div>
    );
  }
}

const options = {
  autoStart: false
};
export default SpeechRecognition(options)(App);
