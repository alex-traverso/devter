import Devit from "../../components/Devit";
import Navbar from "../../components/Navbar";

export default function DevitPage(props) {
  console.log(props);
  return (
    <>
      <Devit {...props} />
      <Navbar />
    </>
  );
}

//Data fetching usando getInitialProps
DevitPage.getInitialProps = async (context) => {
  const { query, res } = context;
  const { id } = query;

  return await fetch(`http://localhost:3000/api/devits/${id}`).then(
    (apiResponse) => {
      if (apiResponse.ok) return apiResponse.json();
      if (res) {
        res.writeHead(404).end();
      }
    }
  );
};
