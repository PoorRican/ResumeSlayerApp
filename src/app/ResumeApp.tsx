import React, { useEffect, useState } from "react";
import InputForm from "./components/input/InputForm";
import ReviewText from "./components/ReviewText";
import MarkdownBlock from "./components/MarkdownBlock";
import FormData from "./FormData";
import useWebSocket from "react-use-websocket";

/**
 * Represents state for server processing status
 */
enum ProcessingState {
  INPUT,        // user is inputting and reviewing text
  REVIEW,       // user is reviewing input text
  WAITING,      // text is being processed by server
  FINISHED      // text has been returned by server
}

const SOCKET_URL = "ws://localhost:8000/ws";

const ResumeApp = () => {

  const [processState, setProcessState] = useState(ProcessingState.INPUT);
  const [processedText, setProcessedText] = useState('');
  const [formData, setFormData] = useState({ title: '', description: '', resume: '' });
  const { sendMessage, lastMessage, readyState } = useWebSocket(SOCKET_URL);

  useEffect(() => {
    if (lastMessage !== null) {
      setProcessedText(lastMessage.data);
      advanceProcessState();
    }
  }, [lastMessage, setProcessedText]);


  const advanceProcessState = () => {
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
    setProcessState(nextState);
  }

  const postForm = async () => {
    advanceProcessState();
    sendMessage(formData.resume);
    sendMessage(formData.title);
    sendMessage(formData.description);

  }

  const handleFormSubmit = (data: FormData) => {
    // logic here
    setFormData(data)
    advanceProcessState();
  }

  switch (processState) {
    case ProcessingState.INPUT:
      return <InputForm handleFormSubmit={handleFormSubmit} />;
    case ProcessingState.REVIEW:
      return <ReviewText {...formData} handleSubmitForm={postForm} />;
    case ProcessingState.WAITING:
      return <p>Loading...</p>;
    case ProcessingState.FINISHED:
      return <MarkdownBlock text={processedText} />
    default:
      return null;
  }
}

export default ResumeApp;