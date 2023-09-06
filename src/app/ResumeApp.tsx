import React, { Component } from "react";
import axios from "axios";
import InputForm from "./components/input/InputForm";
import ReviewText from "./components/ReviewText";
import MarkdownBlock from "./components/MarkdownBlock";
import FormData from "./FormData";

/**
 * Represents state for server processing status
 */
enum ProcessingState {
  INPUT,        // user is inputting and reviewing text
  REVIEW,       // user is reviewing input text
  WAITING,      // text is being processed by server
  FINISHED      // text has been returned by server
}

type CardState = {
  processState: ProcessingState;
  processedText: string;
  formData: FormData;
}

class ResumeApp extends Component<{}, CardState> {
  advanceProcessState = () => {
    const { processState } = this.state;
    let nextState;
    switch (processState) {
      case ProcessingState.INPUT:
        nextState = ProcessingState.REVIEW;
        break;
      case ProcessingState.REVIEW:
        nextState = ProcessingState.WAITING;
        break;
      case ProcessingState.WAITING:
        nextState = ProcessingState.FINISHED;
        break;
      case ProcessingState.FINISHED:
        nextState = ProcessingState.INPUT;
        break;
      default:
        nextState = processState;
        break;
    }
    this.setState({ processState: nextState });
  }

  postForm = async () => {
    try {
      this.advanceProcessState();
      const response = await axios.post(
        "http://localhost:8000/process",
        this.state.formData
      );
      this.setState({'processedText': response.data})
    } catch (error) {
      console.log(error);
      this.setState({processedText: "An error occurred..."})
    } finally {
      this.advanceProcessState();
    }
  }

  handleFormSubmit = (data: FormData) => {
    this.setState({formData: data});
    this.advanceProcessState();
  }
  
  constructor(props: {}) {
    super(props);
    this.state = {
      processState: ProcessingState.INPUT,
      processedText: '',
      formData: {title: '', description: '', resume: ''}
    }
  }

  render() {
    switch (this.state.processState) {
      case ProcessingState.INPUT:
        return <InputForm handleFormSubmit={this.handleFormSubmit} />;
      case ProcessingState.REVIEW:
        return <ReviewText {...this.state.formData} handleSubmitForm={this.postForm} />;
      case ProcessingState.WAITING:
        return <p>Loading...</p>;
      case ProcessingState.FINISHED:
        return <MarkdownBlock text={this.state.processedText} />
      default:
        return null;
    }
  }
}

export default ResumeApp;