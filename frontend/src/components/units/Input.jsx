import PropTypes from 'prop-types';

export default function Input({ label, type, id, name, value, onChange, required = false }) {
  return (
    <div className="flex flex-col gap-2 py-2">
      <label className="" htmlFor={id}>{label}</label>
      <input
        className="border-2 p-2 rounded-md"
        type={type}
        id={id}
        name={name}
        value={type === 'file' ? undefined : value}
        onChange={onChange}
        required={required}
      />
    </div>
  );
}

Input.propTypes = {
  label: PropTypes.string.isRequired,
  type: PropTypes.string.isRequired,
  id: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  onChange: PropTypes.func.isRequired,
  required: PropTypes.bool,
};