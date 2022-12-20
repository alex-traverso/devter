import AppLayout from "../../../components/AppLayout";
import Button from "../../../components/Button";
import useUser from "../../../hooks/useUser";
import { useState } from "react";
import { addDevit } from "../../../firebase/client";
export default function ComposeTweet() {
  const user = useUser();
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    const { value } = e.target;
    setMessage(value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    addDevit({
      avatar: user.avatar,
      content: message,
      userId: user.uid,
      userName: user.name,
    });
  };

  return (
    <>
      <AppLayout>
        <form onSubmit={handleSubmit}>
          <textarea
            onChange={handleChange}
            placeholder='¿Que está pasando?'
          ></textarea>
          <div>
            <Button disabled={message.length === 0}>Devittear</Button>
          </div>
        </form>
      </AppLayout>

      <style jsx>{`
        div {
          padding: 15px;
        }
        textarea {
          min-height: 150px;
          width: 100%;
          border: 0;
          outline: 0;
          padding: 15px;
          resize: none;
          font-size: 21px;
        }
      `}</style>
    </>
  );
}
