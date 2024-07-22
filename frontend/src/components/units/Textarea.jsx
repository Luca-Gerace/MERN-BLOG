import PropTypes from 'prop-types';

export default function Textarea({ label, id, name, value, placeholder, onChange, required = false }) {
  return (
    <div className="flex flex-col gap-2 py-2">
      {label ? <label htmlFor={id}>{label}</label> : null}
      <textarea
        className="border-2 p-2 rounded-md"
        id={id}
        name={name}
        value={value}
        placeholder={placeholder}
        onChange={onChange}
        required={required}
      />
    </div>
  );
}

Textarea.propTypes = {
  label: PropTypes.string,
  id: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  placeholder: PropTypes.string,
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  required: PropTypes.bool,
};
