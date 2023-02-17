import { colors } from "../../styles/theme";
import TopBar from "../../components/TopBar";
import Navbar from "../../components/Navbar";
import { useState, useEffect } from "react";
import DevitComplete from "../../components/DevitComplete";
import useUser from "../../hooks/useUser";
import Modal from "../../components/Modal/Index";
import { listenLatestDevits } from "../../firebase/client";
//Recoil
import { useRecoilState } from "recoil";
import { modalState } from "../../atoms/modalAtom";

const SearchDevits = () => {
  const [timeline, setTimeline] = useState([]);
  const user = useUser();

  const [search, setSearch] = useState("");
  const [filterDevits, setFilterDevits] = useState([]);

  const [isOpen, setIsOpen] = useRecoilState(modalState);

  useEffect(() => {
    let unsubscribe;
    if (user) {
      unsubscribe = listenLatestDevits((newDevit) => {
        setTimeline(newDevit);
        setFilterDevits(newDevit);
      });
    }
    return () => unsubscribe && unsubscribe();
  }, [user]);

  const handleChange = (e) => {
    setSearch(e.target.value);
    filter(e.target.value);
  };

  const filter = (searchInput) => {
    const result = timeline.filter((element) => {
      if (
        element.userName
          ?.toString()
          .toLowerCase()
          .includes(searchInput.toLowerCase()) ||
        element.content
          .toString()
          .toLowerCase()
          .includes(searchInput.toLowerCase())
      ) {
        return element;
      }
    });
    setFilterDevits(result);
  };

  return (
    <>
      <TopBar title='Búsqueda' />

      <input
        type='text'
        placeholder='Buscar'
        value={search}
        onChange={handleChange}
      />

      <section>
        {filterDevits &&
          filterDevits.map(
            ({ userId, userName, avatar, content, createdAt, id, img }) => (
              <DevitComplete
                key={id}
                id={id}
                img={img}
                userName={userName}
                avatar={avatar}
                content={content}
                userId={userId}
                createdAt={createdAt}
                timeline={timeline}
              />
            )
          )}
        {filterDevits.length === 0 && (
          <h4>No hay devits relacionados a lo que estás buscando</h4>
        )}
        {isOpen && <Modal timeline={timeline} />}
      </section>
      <Navbar />

      <style jsx>
        {`
          section {
            flex: 1;
          }

          input {
            margin: 1rem;
            align-self: center;
            width: 90%;
            resize: none;
            outline: none;
            padding: 10px;
            font-size: 1rem;
            border: 1px solid ${colors.greyUnselected};
            border-radius: 10px;
          }
          h4 {
            text-align: center;
          }
        `}
      </style>
    </>
  );
};

export default SearchDevits;
