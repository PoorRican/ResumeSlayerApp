import React from "react";
import { ResumeFormData } from "./ResumeCard";
import FormButton from "./FormButton";


const ReviewText: React.FC<ResumeFormData & { handleSubmitForm: () => void }> = ({ resume, title, description, handleSubmitForm }) => {
  return (
    <section className="flex flex-col">
      <div>
        <h1>Review Text</h1>

        <h2>Resume:</h2>
        <p>{resume}</p>

        <h2>Title:</h2>
        <p>{title}</p>

        <h2>Description:</h2>
        <p>{description}</p>
      </div>
      <FormButton onClick={handleSubmitForm} text="Submit" className="float-right"/>
    </section>
  );
};

export default ReviewText;
