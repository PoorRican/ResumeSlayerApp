import React, { Component } from "react";
import { ResumeFormData } from "./ResumeCard";
import FormButton from "./FormButton";
import Card from "./Card";

/**
 * Input state values for form
 * 
 * State machine is handled by `advance_input_state()`
 */
enum InputState {
  RESUME,       // user is inputting resume text
  JOB_INFO,     // user is inputting job info (title & description)
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
    if (this.state.inputState === InputState.RESUME) {
      this.setState({inputState: InputState.JOB_INFO})
    } else {
      this.props.handleFormSubmit({
        resume: this.state.origText,
        description: this.state.descText,
        title: this.state.titleText
      })
    }
  };

  render() {
    const { inputState, origText, descText, titleText } = this.state;

    return (
      <div className="flex flex-col">
        {inputState === InputState.RESUME ? (
          <Card className={"flex flex-col"} title="Your Old Resume:">
            <label className="text-2xl pb-4 text-gray-500">
              Resume Text
            </label>

            <p className={"text-gray-400 pb-4 font-light"}>
              Paste in your resume text. It's best to provide your master resume or your most generic resume.
              The more data, the better.
              You may optionally format you resume as markdown.
            </p>

            <textarea
              value={origText}
              onChange={e => this.setState({origText: e.target.value})}
              placeholder="Enter or paste your resume/CV here"
              rows={32}
            />
          </Card>
        ) : (
          <></> 
        )}
        
        {inputState === InputState.JOB_INFO ? (
          <Card className={"flex flex-col"} title="Your New Job:">
            <label className="text-2xl font-medium pb-4 text-gray-600">
              Title
            </label>

            <input
              value={titleText}
              onChange={e => this.setState({titleText: e.target.value})}
              placeholder="Enter a job title here"
            />

            <label className="text-2xl font-medium pt-8 pb-4 text-gray-600">
              Description
            </label>
            <textarea
              value={descText}
              onChange={e => this.setState({descText: e.target.value})}
              placeholder="Enter a job description here"
            />
          </Card>
        ) : (
          <></> 
        )}

        <FormButton onClick={this.handleButtonClick} text="Next" className="mt-4 float-right"/>
      </div>
    );
  }
}

export default InputForm;
