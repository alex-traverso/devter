import { useState } from "react";
import AppLayout from "../../../components/AppLayout";
import Button from "../../../components/Button";
import useUser from "../../../hooks/useUser";
import { addDevit } from "../../../firebase/client";

//Router
import Router from "next/router";

const COMPOSE_STATES = {
  USER_NOT_KNOWN: 0,
  LOADING: 1,
  SUCCESS: 2,
  ERROR: -1,
};

export default function ComposeTweet() {
  const user = useUser();
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState(COMPOSE_STATES.USER_NOT_KNOWN);

  const handleChange = (e) => {
    const { value } = e.target;
    setMessage(value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    setStatus(COMPOSE_STATES.LOADING);
    addDevit({
      avatar: user.avatar,
      content: message,
      userId: user.uid,
      userName: user.username,
    });
    try {
      Router.push("/home");
    } catch (error) {
      console.error(err);
      setStatus(COMPOSE_STATES.ERROR);
    }
  };

  const isButtonDisabled =
    message.length === 0 || status === COMPOSE_STATES.LOADING;

  return (
    <>
      <AppLayout>
        <form onSubmit={handleSubmit}>
          <textarea
            onChange={handleChange}
            placeholder='¿Que está pasando?'
          ></textarea>
          <div>
            <Button disabled={isButtonDisabled}>Devittear</Button>
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
