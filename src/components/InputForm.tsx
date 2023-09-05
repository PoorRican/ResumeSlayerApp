import React, { Component } from "react";
import { ResumeFormData } from "./ResumeCard";

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
}

function advance_input_state(origState: InputState): InputState {
  switch (origState) {
    case InputState.RESUME:
      return InputState.JOB_INFO;
    case InputState.JOB_INFO:
      // TODO: add a mechanism to add multiple job desciptions
      return InputState.JOB_INFO;
  }
}

type FormProps = {
  handleFormSubmit: (data: ResumeFormData) => void
};

type FormState = {
  inputState: InputState;
  origText: string;
  descText: string;
  titleText: string;
};

class InputForm extends Component<FormProps, FormState> {
  constructor(props: FormProps) {
    super(props);
    this.state = {
      inputState: InputState.RESUME,
      origText: '',
      descText: '',
      titleText: '',
    };
  }

  handleButtonClick = () => {
    this.props.handleFormSubmit({
      resume: this.state.origText,
      description: this.state.descText,
      title: this.state.titleText
    })
  };

  render() {
    const { inputState, origText, descText, titleText } = this.state;

    return (
      <section className="mx-auto max-w-4xl flex flex-col bg-slate-50 px-16 py-8">
        {inputState === InputState.RESUME ? (
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
        
        {inputState === InputState.JOB_INFO ? (
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

        <div className="pt-4">
          <button onClick={this.handleButtonClick} className="bg-violet-500 text-white px-4 py-1 rounded-md float-right">
            Next
          </button>
        </div>
      </section>
    );
  }
}

export default InputForm;
