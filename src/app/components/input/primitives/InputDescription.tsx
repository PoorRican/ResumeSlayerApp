const InputDescription: React.FC<{ description?: string }> = ({ description }) => {
  if (description) {
    return (
      <p className={"text-gray-400 pb-4 font-light"}>
        {description}
      </p>
    );
  } else {
    return null;
  }
};

export default InputDescription;