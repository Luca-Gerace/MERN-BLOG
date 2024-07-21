import PropTypes from 'prop-types';

export default function Button({ type = 'button', onClick, label, variant, size }) {
  const className = `btn ${variant} ${size}`;

  return (
    <button type={type} className={className} onClick={onClick}>
      {label}
    </button>
  );
}

Button.propTypes = {
  type: PropTypes.string,
  onClick: PropTypes.func,
  label: PropTypes.string.isRequired,
  variant: PropTypes.oneOf(['primary', 'secondary']).isRequired,
  size: PropTypes.oneOf(['s', 'm']).isRequired,
};
