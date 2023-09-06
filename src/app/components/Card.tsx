import React from 'react';

const Card: React.FC<{ title?: string, children: React.ReactNode, className?: string }> = ({ title, children, className }) => {
  className = className ? ' ' + className : '';

  return (
    <div>
      <h2 className="text-2xl text-gray-500 pb-4">
        {title}
      </h2>
      <section className={"bg-slate-50 px-16 py-8" + className }>
        {children}
      </section>
    </div>
  );
};

export default Card;