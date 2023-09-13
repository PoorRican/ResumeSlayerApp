import React from 'react';

const ErrorCard: React.FC<{ title?: string, text: string }> = ({ title, text }) => {

  return (
    <div data-testid={"error_card"}>
      <section className={"bg-red-300 px-10 py-3 border-[1px] border-red-700 rounded-lg max-w-fit mx-auto" }>
        {title && <h2 className="text-xl text-red-600 pb-4 font-medium">
          {title}
        </h2>}
        <p className={"text-red-600 font-light text-sm"}>{text}</p>
      </section>
    </div>
  );
};

export default ErrorCard;
