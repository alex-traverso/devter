import Devit from "../../components/Devit";
import Navbar from "../../components/Navbar";

export default function DevitPage(props) {
  /* console.log(apiProps); */
  return (
    <>
      <Devit {...props} />
      <Navbar />
    </>
  );
}

//Data fetching usando getServerSideProps
/* export async function getServerSideProps(context) {
  const { params } = context;
  const { id } = params;

  const apiResponse = await fetch(`http://localhost:3000/api/devits/${id}`);
  if (apiResponse.ok) {
    const apiProps = await apiResponse.json();
    console.log(apiProps);
    return {
      props: { apiProps },
    };
  }
  if (res) {
    res.writeHead(301, { Location: "/home" }).end();
  }
} */

//Data fetching usando getInitialProps
DevitPage.getInitialProps = (context) => {
  const { query, res } = context;
  const { id } = query;

  return fetch(`http://localhost:3000/api/devits/${id}`).then((apiResponse) => {
    if (apiResponse.ok) return apiResponse.json();
    if (res) {
      res.writeHead(404).end();
    }
  });
};
