import React from "react";
import { ResumeFormData } from "./ResumeCard";
import FormButton from "./FormButton";
import MarkdownBlock from "./MarkdownBlock";


const ReviewText: React.FC<ResumeFormData & { handleSubmitForm: () => void }> = ({ resume, title, description, handleSubmitForm }) => {
  return (
    <section className="flex flex-col">

      <div>
        <h1 className="text-3xl font-semibold">
          Review Text
        </h1>

        <h2 className="text-2xl text-gray-500 pt-8">
          Your Old Resume:
        </h2>
        <div className="pl-2">
          <MarkdownBlock text={resume} />
        </div>

        <h2 className="text-2xl text-gray-500 pt-8">
          Your New Job Title:
        </h2>
        <p>{title}</p>

        <h2 className="text-2xl text-gray-500 pt-8">
          Your New Job Description:
        </h2>
        <p>{description}</p>
      </div>

      <FormButton onClick={handleSubmitForm} text="Submit" className="float-right"/>
    </section>
  );
};

export default ReviewText;
