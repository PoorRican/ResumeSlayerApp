export default interface InputProps {
  label: string;
  onChange: (value: string) => void;
  value: string;
  placeholder: string;
  description?: string;
};
