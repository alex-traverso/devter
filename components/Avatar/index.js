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
          height: 60px;
          width: 60px;
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
