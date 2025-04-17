import PropTypes from 'prop-types';

function InputLabel({ text }) {
  return (
    <>
      <span className="font-sans font-light text-[15px] text-text-secondary">
        {text}
      </span>
    </>
  );
}
InputLabel.propTypes = {
  text: PropTypes.string,
};
export default InputLabel;
