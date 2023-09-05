import React from "react";
import { ResumeFormData } from "./ResumeCard";


const ReviewText: React.FC<ResumeFormData> = ({ resume, title, description }) => {
  return (
    <div>
      <h1>Review Text</h1>

      <h2>Resume:</h2>
      <p>{resume}</p>

      <h2>Title:</h2>
      <p>{title}</p>

      <h2>Description:</h2>
      <p>{description}</p>
    </div>
  );
};

export default ReviewText;
