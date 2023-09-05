import React, { Component } from "react";
import axios from "axios";
import { HtmlRenderer, Parser } from "commonmark";
import InputForm from "./InputForm";
import ReviewText from "./ReviewText";

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
  formData: ResumeFormData;
}

export interface ResumeFormData {
  resume: string;
  title: string;
  description: string;
}

class ResumeCard extends Component<{}, CardState> {
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

  handleFormSubmit = async (data: ResumeFormData) => {
    try {
      const response = await axios.post(
        "http://localhost:8000/process",
        data
      );
      let parser = new Parser()
      let renderer = new HtmlRenderer();
      let html = renderer.render(parser.parse(response.data))
      this.setState({'processedText': html.replace('\n', '')})
    } catch (error) {
      console.log(error);
      this.setState({processedText: "An error occurred..."})
    } finally {
      this.advanceProcessState();
    }
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
        return <ReviewText {...this.state.formData} />;
      case ProcessingState.WAITING:
        return <p>Loading...</p>;
      case ProcessingState.FINISHED:
        return <div dangerouslySetInnerHTML={{__html: this.state.processedText}}></div>;
      default:
        return null;
    }
  }
}

export default ResumeCard;