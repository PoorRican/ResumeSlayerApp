import React, { Component } from "react";
import { HtmlRenderer, Parser } from "commonmark";
import axios from "axios";

enum LoadState {
  WAITING,
  LOADING,
  FINISHED
}

enum InputState {
  RESUME,
  DESCRIPTION,
  REVIEW,
  PROCESSED
}

function advance_input_state(origState: InputState): InputState {
  switch (origState) {
    case InputState.RESUME:
      return InputState.DESCRIPTION;
    case InputState.DESCRIPTION:
      // TODO: add a mechanism to add multiple job desciptions
      return InputState.REVIEW;
    case InputState.REVIEW:
      return InputState.PROCESSED 
    case InputState.PROCESSED:
      // TODO: this should error
      return InputState.PROCESSED
  }
}

type CardState = {
  docText: string;
  loadState: LoadState;
  inputState: InputState;
  docData: DocData;
};

type DocData = {
  origText: string;
  descText: string;
  processedText: string;
};

class ResumeInputCard extends Component<{}, CardState> {
  constructor(props: {}) {
    super(props);
    this.state = {
      docText: "",
      loadState: LoadState.WAITING,
      inputState: InputState.RESUME,
      docData: {origText: '', descText: '', processedText: ''}
    };
  }

  handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    this.setState({ docText: e.target.value });
  };

  loadData = (text: string) => {
    this.setState(prevState => {
      let tmp: DocData;
      switch (prevState.inputState) {
        case InputState.RESUME:
          tmp = prevState.docData;
          return { docData: { ...tmp, origText: text } };
        case InputState.DESCRIPTION:
          tmp = prevState.docData;
          return { docData: { ...tmp, descText: text } };
        case InputState.REVIEW:
          tmp = prevState.docData;
          return { docData: { ...tmp, processedText: text } };
        default:
          return null;
      }
    });
  }

  handleButtonClick = async () => {
    this.setState({ loadState: LoadState.LOADING });

    try {
      if (this.state.inputState === InputState.REVIEW) {
        const response = await axios.post(
          "http://localhost:8000/process",
          {
            resume: this.state.docData?.origText,
            description: this.state.docData?.descText,
            title: "django developer"
          }
        );

        let parser = new Parser()
        let renderer = new HtmlRenderer();
        let html = renderer.render(parser.parse(response.data))
        html = html.replace('\n', '')

        this.loadData(html);
      }
      else {
        this.loadData(this.state.docText);
      }
    } catch (error) {
      console.log(error);
      this.loadData("An error occurred.")
    } finally {
      // update states
      const next_input_state = advance_input_state(this.state.inputState);
      const finished = next_input_state === InputState.REVIEW || next_input_state === InputState.PROCESSED;
      const next_load_state = finished ? LoadState.FINISHED : LoadState.WAITING;
      this.setState({
        docText: '',
        loadState: next_load_state,
        inputState: next_input_state
      });
    }
  };

  render() {
    const { docText: inputText, loadState, docData, inputState } = this.state;

    return (
      <div>
        {loadState === LoadState.WAITING && inputState === InputState.RESUME ? (
          <div>
            <h1>Your Resume:</h1>

            <textarea
              value={inputText}
              onChange={this.handleInputChange}
              placeholder="Enter some text here"
            />
          </div>
        ) : (
          <></> 
        )}
        
        {loadState === LoadState.WAITING && inputState === InputState.DESCRIPTION ? (
          <div>
            <h1>Job Description:</h1>

            <textarea
              value={inputText}
              onChange={this.handleInputChange}
              placeholder="Enter some text here"
            />

          </div>
        ) : (
          <></> 
        )}
        {loadState === LoadState.LOADING ? (
          <div>Loading...</div>
        ) : (
          <></>
        )}
        {loadState === LoadState.FINISHED ? (
          <div>
            <h1>Review:</h1>

            <h2>Resume</h2>
            <section>{docData?.origText}</section>

            <h2>Job Description</h2>
            <section>{docData?.descText}</section>

          </div>
        ) : (
          <></>
        )}


        {inputState === InputState.PROCESSED ? (
          <>
            <h1>Curated Resume:</h1>
            <div dangerouslySetInnerHTML={{__html: docData.processedText}}></div>
          </>
        ) : (
          <button onClick={this.handleButtonClick}>
            Submit
          </button>
        )}
      </div>
    );
  }
}

export default ResumeInputCard;
