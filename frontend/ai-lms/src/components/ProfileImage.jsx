import PropTypes from 'prop-types';

const ProfileImage = ({ src, alt, size }) => {
  return (
    <div className={`rounded-full overflow-hidden cursor-pointer ${size}`}>
      <img src={src} alt={alt} className="w-full h-auto" />
    </div>
  );
};

ProfileImage.propTypes = {
  src: PropTypes.string.isRequired,
  alt: PropTypes.string.isRequired,
  size: PropTypes.string,
};

ProfileImage.defaultProps = {
  size: 'w-2 h-2', 
};

export default ProfileImage;