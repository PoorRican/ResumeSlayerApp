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
  loadState: LoadState;
  inputState: InputState;
  origText: string;
  descText: string;
  titleText: string;
  processedText: string;
};

class ResumeInputCard extends Component<{}, CardState> {
  constructor(props: {}) {
    super(props);
    this.state = {
      loadState: LoadState.WAITING,
      inputState: InputState.RESUME,
      origText: '',
      descText: '',
      titleText: '',
      processedText: '',
    };
  }

  handleButtonClick = async () => {
    try {
      if (this.state.inputState === InputState.REVIEW) {
        this.setState({ loadState: LoadState.LOADING });

        const response = await axios.post(
          "http://localhost:8000/process",
          {
            resume: this.state.origText,
            description: this.state.descText,
            title: this.state.titleText,
          }
        );

        let parser = new Parser()
        let renderer = new HtmlRenderer();
        let html = renderer.render(parser.parse(response.data))
        html = html.replace('\n', '')

        this.setState({processedText: html});
      }
    } catch (error) {
      console.log(error);
      this.setState({processedText: "An error occurred..."})
    } finally {
      // update states
      const next_input_state = advance_input_state(this.state.inputState);
      const finished = next_input_state === InputState.REVIEW || next_input_state === InputState.PROCESSED;
      const next_load_state = finished ? LoadState.FINISHED : LoadState.WAITING;
      this.setState({
        loadState: next_load_state,
        inputState: next_input_state
      });
    }
  };

  render() {
    const { loadState, inputState, origText, descText, titleText, processedText } = this.state;

    return (
      <section>
        {loadState === LoadState.WAITING && inputState === InputState.RESUME ? (
          <label>
            Your Resume

            <textarea
              value={origText}
              onChange={e => this.setState({origText: e.target.value})}
              placeholder="Enter some text here"
            />
          </label>
        ) : (
          <></> 
        )}
        
        {loadState === LoadState.WAITING && inputState === InputState.DESCRIPTION ? (
          <>
            <label>
              Job Title

              <input
                value={titleText}
                onChange={e => this.setState({titleText: e.target.value})}
                placeholder="Enter a job title here"
              />
            </label>

            <label>
              Job Description

              <textarea
                value={descText}
                onChange={e => this.setState({descText: e.target.value})}
                placeholder="Enter a job description here"
              />
            </label>
          </>
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
            <section>{origText}</section>

            <h2>Job Details</h2>
            <h3>Title</h3>
            <section>{titleText}</section>

            <h3>Job Description</h3>
            <section>{descText}</section>

          </div>
        ) : (
          <></>
        )}


        {inputState === InputState.PROCESSED ? (
          <>
            <h1>Curated Resume:</h1>
            <div dangerouslySetInnerHTML={{__html: processedText}}></div>
          </>
        ) : (
          <button onClick={this.handleButtonClick}>
            Submit
          </button>
        )}
      </section>
    );
  }
}

export default ResumeInputCard;
