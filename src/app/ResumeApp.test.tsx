import React from 'react';
import { render, screen, fireEvent, act, waitFor } from '@testing-library/react';
import ResumeApp from './ResumeApp';


jest.setTimeout(25000)

const doInputAndSubmit = () => {
  const resumeTextInput = screen.getByTestId("resume_text");
  expect(resumeTextInput).toBeInTheDocument();

  const nextButton = screen.getByText(/Next/i);

  act(() => {
    fireEvent.change(resumeTextInput, { target: { value: "mock resume" } });
    fireEvent.click(nextButton)
  });

  expect(resumeTextInput).not.toBeInTheDocument();

  const titleInput = screen.getByTestId("job_title");
  expect(titleInput).toBeInTheDocument();

  const descInput = screen.getByTestId("description");
  expect(descInput).toBeInTheDocument();

  act(() => {
    fireEvent.change(titleInput, { target: { value: "mock job title" } });
    fireEvent.change(descInput, { target: { value: "mock job description" } });
    fireEvent.click(nextButton);
  });

  expect(titleInput).not.toBeInTheDocument();
  expect(descInput).not.toBeInTheDocument();

  const reviewText = screen.getByTestId("review_text");
  expect(reviewText).toBeInTheDocument();

  const submitButton = screen.getByTestId("final_submit_button").childNodes[0];

  act(() => {
    fireEvent.click(submitButton);
  });

  const progressComponent = screen.getByTestId("progress_component");
  expect(progressComponent).toBeInTheDocument();
}

test('SPA functionality', async () => {
  const MOCK_SOCKET_URL = "wss://development-q5nzhaa-ca5gmpudda7qo.us.platformsh.site/ws/bypass";

  render(<ResumeApp socketUrl={MOCK_SOCKET_URL} />);

  doInputAndSubmit();

  await new Promise((resolve) => setTimeout(resolve, 10000));

  const processedText = screen.getByTestId("processed_text");
  expect(processedText).toBeInTheDocument();

  const processedTextContent = processedText.textContent;
  expect(processedTextContent).toContain("Correct websocket sequence received");
  
});

test('handle sudden crash', async () => {
  const MOCK_SOCKET_URL = "wss://development-q5nzhaa-ca5gmpudda7qo.us.platformsh.site/ws/crash";

  render(<ResumeApp socketUrl={MOCK_SOCKET_URL} />);

  doInputAndSubmit();

  await new Promise((resolve) => setTimeout(resolve, 10000));

  const errorCard = screen.getByTestId("error_card");
  expect(errorCard).toBeInTheDocument();
});