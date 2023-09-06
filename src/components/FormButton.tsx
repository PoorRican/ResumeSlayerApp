import React from 'react';

interface FormButtonProps {
  onClick: () => void;
  text: string;
  className?: string;
}

const FormButton: React.FC<FormButtonProps> = ({ onClick: handleButtonClick, text, className }) => {
  return (
    <div className='pt-4'>
      <button onClick={ handleButtonClick } className={"bg-violet-500 text-white px-4 py-1 rounded-md " + className}>
        { text }
      </button>
    </div>
  );
}

export default FormButton;
