import InputProps from './InputProps';
import InputLabel from './InputLabel';
import InputDescription from './InputDescription';

const TextareaGroup: React.FC<InputProps> = ({ label, onChange, value, placeholder, description }) => {
  return (
    <div>
      <InputLabel label={label} />

      <InputDescription description={description} />

      <textarea
        className="bg-transparent w-full"
        onChange={(e) => onChange(e.target.value)}
        rows={32}
        value={value}
        placeholder={placeholder}
      />
    </div>
  );
};

export default TextareaGroup;