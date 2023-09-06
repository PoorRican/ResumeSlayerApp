import React from "react";
import { ResumeFormData } from "../ResumeApp";
import FormButton from "./FormButton";
import MarkdownBlock from "./MarkdownBlock";
import Card from "./Card";


/**
 * Allows user to review input text before submitting for processing.
 * 
 * @returns `section` presenting resume text, job title, and job description
 */
const ReviewText: React.FC<ResumeFormData & { handleSubmitForm: () => void }> = ({ resume, title, description, handleSubmitForm }) => {
  return (
    <section className="flex flex-col gap-8">

      <h1 className="text-3xl">
        Review
      </h1>

      <Card title="Your Old Resume:">
        <div className="pl-2">
          <MarkdownBlock text={resume} />
        </div>
      </Card>

      <Card title="Your New Job:">
        <h3 className="text-xl text-gray-600 font-light pb-4">
          Title
        </h3>
        <p>{title}</p>

        <h3 className="text-xl text-gray-600 font-light pb-4">
          Description
        </h3>
        <div>
          <MarkdownBlock text={description} />
        </div>
      </Card>

      <FormButton onClick={handleSubmitForm} text="Submit" className="float-right"/>
    </section>
  );
};

export default ReviewText;
