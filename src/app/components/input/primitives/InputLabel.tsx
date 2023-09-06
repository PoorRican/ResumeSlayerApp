const InputLabel: React.FC<{ label?: string }> = ({ label }) => {
  if (label) {
    return (
      <label className="text-lg pb-4 text-gray-500">
        {label}
      </label>
    );
  } else {
    return null;
  }
};

export default InputLabel;