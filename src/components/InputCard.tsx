import React, { Component } from "react";
import { HtmlRenderer, Parser } from "commonmark";
import axios from "axios";

/**
 * Represents state for server processing status
 */
enum ProcessingState {
  INPUT,        // user is inputting and reviewing text
  WAITING,      // text is being processed by server
  FINISHED      // text has been returned by server
}

/**
 * Input state values for form
 * 
 * State machine is handled by `advance_input_state()`
 */
enum InputState {
  RESUME,       // user is inputting resume text
  JOB_INFO,     // user is inputting job info (title & description)
  REVIEW,       // user is reviewing text
  PROCESSED     // processed resume text is being displayed
}

function advance_input_state(origState: InputState): InputState {
  switch (origState) {
    case InputState.RESUME:
      return InputState.JOB_INFO;
    case InputState.JOB_INFO:
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
  loadState: ProcessingState;
  inputState: InputState;
  origText: string;
  descText: string;
  titleText: string;
  processedText: string;
};

class InputCard extends Component<{}, CardState> {
  constructor(props: {}) {
    super(props);
    this.state = {
      loadState: ProcessingState.INPUT,
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
        this.setState({ loadState: ProcessingState.WAITING });

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
      const next_load_state = finished ? ProcessingState.FINISHED : ProcessingState.INPUT;
      this.setState({
        loadState: next_load_state,
        inputState: next_input_state
      });
    }
  };

  render() {
    const { loadState, inputState, origText, descText, titleText, processedText } = this.state;

    return (
      <section className="mx-auto max-w-4xl flex flex-col bg-slate-50 px-16 py-8">
        {loadState === ProcessingState.INPUT && inputState === InputState.RESUME ? (
          <>
            <label className="text-2xl font-medium pb-4 text-gray-600">
              Your Resume
            </label>

            <textarea
              value={origText}
              onChange={e => this.setState({origText: e.target.value})}
              placeholder="Enter or paste your resume/CV here"
              rows={32}
            />
          </>
        ) : (
          <></> 
        )}
        
        {loadState === ProcessingState.INPUT && inputState === InputState.JOB_INFO ? (
          <>
            <label className="text-2xl font-medium pb-4 text-gray-600">
              Job Title
            </label>

            <input
              value={titleText}
              onChange={e => this.setState({titleText: e.target.value})}
              placeholder="Enter a job title here"
            />

            <label className="text-2xl font-medium pt-8 pb-4 text-gray-600">
              Job Description
            </label>
            <textarea
              value={descText}
              onChange={e => this.setState({descText: e.target.value})}
              placeholder="Enter a job description here"
            />
          </>
        ) : (
          <></> 
        )}
        {loadState === ProcessingState.WAITING ? (
          <div>Loading...</div>
        ) : (
          <></>
        )}
        {loadState === ProcessingState.FINISHED ? (
          <div>
            <h1 className="text-3xl font-medium">Review:</h1>

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
          <div className="pt-4">
            <button onClick={this.handleButtonClick} className="bg-violet-500 text-white px-4 py-1 rounded-md float-right">
              Next
            </button>
          </div>
       )}
      </section>
    );
  }
}

export default InputCard;
