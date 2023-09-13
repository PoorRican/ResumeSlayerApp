import React, { useEffect, useState, useCallback } from "react";
import InputForm from "./components/input/InputForm";
import ReviewText from "./components/ReviewText";
import MarkdownBlock from "./components/MarkdownBlock";
import FormData from "./FormData";
import useWebSocket, {ReadyState} from "react-use-websocket";
import Card from "./components/Card";

/**
 * Represents state for server processing status
 */
enum ProcessingState {
  INPUT,        // user is inputting and reviewing text
  REVIEW,       // user is reviewing input text
  WAITING,      // text is being processed by server
  FINISHED      // text has been returned by server
}

// const SOCKET_URL = "wss://master-7rqtwti-ca5gmpudda7qo.us.platformsh.site/ws";
const SOCKET_URL = "wss://development-q5nzhaa-ca5gmpudda7qo.us.platformsh.site/ws";
// const SOCKET_URL = "ws://localhost:8000/ws";

interface ResumeAppProps {
  socketUrl?: string;
}

const ResumeApp = ({ socketUrl = SOCKET_URL }: ResumeAppProps) => {
  const [processState, setProcessState] = useState(ProcessingState.INPUT);
  const [processedText, setProcessedText] = useState('');
  const [formData, setFormData] = useState({ title: '', description: '', resume: '' });
  const { sendMessage, lastMessage, readyState } = useWebSocket(socketUrl);
  const [websocketError, setWebsocketError] = useState(false);

  // advance state
  const advanceProcessState = useCallback(() => {
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
  }, [processState]);

  // handle incoming data
  useEffect(() => {
    if (processState === ProcessingState.WAITING && lastMessage !== null) {
      const data = lastMessage.data;

      // handle an error being returned by server 
      if (data.includes('Error')) {
        setWebsocketError(true);
      }

      setProcessedText(data);
      advanceProcessState();
    }
  }, [lastMessage, processState, advanceProcessState])

  // show websocket state on console
  useEffect(() => {
    switch (readyState) {
      case ReadyState.OPEN:
        console.info("Socket is OPEN");
        break;
      case ReadyState.UNINSTANTIATED:
        console.info("Socket is UNINSTANTIATED");
        break;
      case ReadyState.CLOSING:
        console.info("Socket is CLOSING");
        break;
      case ReadyState.CLOSED:

        // handle socket being unexpectedly closed
        if (processState !== ProcessingState.FINISHED) {
          console.error("Socket was unexpectedly closed...");
          setWebsocketError(true);
          setProcessedText("Connection unexpectedly closed...");
          advanceProcessState();
        } else {
          console.info("Socket is CLOSED");
        }
        break;
      case ReadyState.CONNECTING:
        console.info("Socket is CONNECTING");
        break;
      default:
        console.warn("Socket state is unknown");
        break
    }
  }, [readyState, processState, advanceProcessState]);
  
  const postForm = async () => {
    advanceProcessState();

    sendMessage(formData.resume);
    sendMessage(formData.title);
    sendMessage(formData.description);
  }

  const handleFormSubmit = (data: FormData) => {
    setFormData(data)
    advanceProcessState();
  }

  switch (processState) {
    case ProcessingState.INPUT:
      return <InputForm handleFormSubmit={handleFormSubmit} />;
    case ProcessingState.REVIEW:
      return <ReviewText {...formData} handleSubmitForm={postForm} />;
    case ProcessingState.WAITING:
      return (
        <div data-testid="progress_component">
          <label htmlFor={"file"}>File progress:</label>

          <progress id="file" max="1" value="0">X%</progress>
        </div>
);
    case ProcessingState.FINISHED:
      if (websocketError) {
        return <div data-testid="error_card"><Card title="Websocket Error">{ processedText }</Card></div>
      } else {
        return <div data-testid="processed_text"><MarkdownBlock text={processedText}/></div>
      }
    default:
      return null;
  }
}

export default ResumeApp; 