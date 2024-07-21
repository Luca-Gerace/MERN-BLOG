import PropTypes from 'prop-types';

export default function Input({ label, type, id, name, value, onChange, required }) {
  return (
    <div className="form-group">
      <label htmlFor={id}>{label}</label>
      <input
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
    value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    onChange: PropTypes.func.isRequired,
    required: PropTypes.bool,
};
  
Input.defaultProps = {
    required: false,
};