import InputProps from './InputProps';
import InputLabel from './InputLabel';
import InputDescription from './InputDescription';

const FieldGroup: React.FC<InputProps> = ({ label, description, onChange, value, placeholder, id }) => {
  return (
    <div>
      <InputLabel label={label} />

      <InputDescription description={description} />

      <input
        data-testid={id}
        className="bg-transparent w-full"
        type="text"
        onChange={(e) => onChange(e.target.value)}
        value={value}
        placeholder={placeholder} />
    </div>
  );
};

export default FieldGroup;