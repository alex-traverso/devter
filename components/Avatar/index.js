const Avatar = ({ src, alt, text }) => {
  return (
    <div>
      <img src={src} alt={alt} />
      {text && <strong>{text}</strong>}

      <style jsx>{`
        div {
          display: flex;
          align-items: center;
        }

        img {
          height: 50px;
          width: 50px;
          object-fit: cover;
          border-radius: 9999px;
        }

        strong {
          margin-left: 12px;
        }
      `}</style>
    </div>
  );
};

export default Avatar;
