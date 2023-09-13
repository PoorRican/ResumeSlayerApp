import React from 'react';
import { render, screen, fireEvent, act } from '@testing-library/react';
import ResumeApp from './ResumeApp';

test('SPA functionality', () => {
  render(<ResumeApp />);

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
    fireEvent.click(nextButton)
  });

  expect(titleInput).not.toBeInTheDocument();
  expect(descInput).not.toBeInTheDocument();

  const reviewText = screen.getByTestId("review_text");
  expect(reviewText).toBeInTheDocument();

  // TODO: test loading screen
  // TODO: test results
});