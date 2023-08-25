import React, { Component } from "react";
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
  docData: DocData | undefined;
};

type DocData = {
  origText?: string | undefined;
  descText?: string | undefined;
  processedText?: string | undefined;
};

class ResumeInputCard extends Component<{}, CardState> {
  constructor(props: {}) {
    super(props);
    this.state = {
      docText: "",
      loadState: LoadState.WAITING,
      inputState: InputState.RESUME,
      docData: undefined
    };
  }

  handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    this.setState({ docText: e.target.value });
  };

  loadData = (text: string) => {
    let tmp: DocData | undefined;
    switch (this.state.inputState) {
      case InputState.RESUME:
        tmp = this.state.docData;
        this.setState({ docData: { ...tmp, origText: text } });
        break;
      case InputState.DESCRIPTION:
        tmp = this.state.docData;
        this.setState({ docData: { ...tmp, descText: text } });
        break;
      case InputState.REVIEW:
        tmp = this.state.docData;
        this.setState({ docData: { ...tmp, processedText: text } });
        break;
    }
  }

  handleButtonClick = async () => {
    this.setState({ loadState: LoadState.LOADING });

    try {
      if (this.state.inputState === InputState.REVIEW) {
        const response = await axios.post(
          "<http://your-target-url-here.com>",
          {
            resume: this.state.docData?.origText,
            desc: this.state.docData?.descText,
          }
        );

        this.loadData(JSON.stringify(response.data));
      }
      else {
        this.loadData(this.state.docText);
      }
    } catch (error) {
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
            <h2>Returned Data:</h2>
            <pre>input state: {inputState}</pre>
            <pre>orig: {docData?.origText}</pre>
            <pre>desc: {docData?.descText}</pre>
            <pre>processed: {docData?.processedText}</pre>
          </div>
        ) : (
          <></>
        )}

        {inputState === InputState.PROCESSED ? (
          <></>
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