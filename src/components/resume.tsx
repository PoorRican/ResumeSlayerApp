import React, { Component } from "react";
import axios from "axios";

enum LoadState {
    WAITING,
    LOADING,
    FINISHED
}

type ResumeState = {
  docText: string;
  loadState: LoadState;
  returnedData: string | null;
};

class ResumeInputCard extends Component<{}, ResumeState> {
  constructor(props: {}) {
    super(props);
    this.state = {
      docText: "",
      loadState: LoadState.WAITING,
      returnedData: null,
    };
  }

  handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    this.setState({ docText: e.target.value });
  };

  handleButtonClick = async () => {
    this.setState({ loadState: LoadState.LOADING });

    try {
      const response = await axios.post(
        "<http://your-target-url-here.com>",
        {
          data: this.state.docText,
        }
      );

      this.setState({
        returnedData: JSON.stringify(response.data),
      });
    } catch (error) {
      this.setState({
        returnedData: "An error occurred.",
      });
    } finally {
      this.setState({ loadState: LoadState.FINISHED });
    }
  };

  render() {
    const { docText: inputText, loadState, returnedData } = this.state;

    return (
      <div>
        {loadState === LoadState.WAITING ? (
          <div>
            <h1>Your Resume:</h1>

            <textarea
              value={inputText}
              onChange={this.handleInputChange}
              placeholder="Enter some text here"
            />

            <button onClick={this.handleButtonClick}>
              Update resume
            </button>
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
            <pre>{returnedData}</pre>
          </div>
        ) : (
          <></>
        )}
      </div>
    );
  }
}

export default ResumeInputCard;