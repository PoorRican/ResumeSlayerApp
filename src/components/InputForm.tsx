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

interface InputProps {
  label: string;
  onChange: (value: string) => void;
  value: string;
  placeholder: string;
  description?: string;
};

const InputDescription: React.FC<{ description?: string }> = ({ description }) => {
  if (description) {
    return (
      <p className={"text-gray-400 pb-4 font-light"}>
        {description}
      </p>
    );
  } else {
    return null;
  }
};

const InputLabel: React.FC<{ label?: string }> = ({ label }) => {
  if (label) {
    return (
      <label className="text-lg pb-4 text-gray-500">
        {label}
      </label>
    );
  } else {
    return null;
  }
};


const TextareaGroup: React.FC<InputProps> = ({ label, onChange, value, placeholder, description }) => {
  return (
    <div>
      <InputLabel label={label} />

      <InputDescription description={description} />

      <textarea
        className="bg-transparent w-full"
        onChange={(e) => onChange(e.target.value)}
        rows={32}
        value={value}
        placeholder={placeholder}
      />
    </div>
  );
};


const FieldGroup: React.FC<InputProps> = ({ label, description, onChange, value, placeholder }) => {
  return (
    <div>
      <InputLabel label={label} />

      <InputDescription description={description} />

      <input
        className="bg-transparent w-full"
        type="text"
        onChange={(e) => onChange(e.target.value)}
        value={value}
        placeholder={placeholder} />
    </div>
  );
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

            <TextareaGroup
              description="Paste in your resume text. It's best to provide your master resume or your most generic resume. The more data, the better."
              label="Resume Text"
              onChange={val => this.setState({origText: val})}
              placeholder="Enter or paste your resume/CV here"
              value={origText}
            />

          </Card>
        ) : (
          <></> 
        )}
        
        {inputState === InputState.JOB_INFO ? (
          <Card className={"flex flex-col"} title="Your New Job:">

            <FieldGroup
              label="Title"
              onChange={val => this.setState({titleText: val})}
              value={titleText}
              placeholder="Enter the job title here"
            />

            <TextareaGroup
              label="Description"
              onChange={val => this.setState({descText: val})}
              placeholder="Enter the job description here"
              value={descText}
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
