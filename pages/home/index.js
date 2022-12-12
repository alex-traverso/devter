import AppLayout from "../../components/AppLayout";

const HomePage = () => {
  return (
    <>
      <AppLayout>
        <header>
          <h2>Inicio</h2>
        </header>
        <section></section>
        <nav></nav>
      </AppLayout>

      <style jsx>
        {`
          header {
            top: 0;
            left: 0;
            border-bottom: 1px solid #ccc;
            height: 55px;
            position: fixed;
            width: 100%;
          }

          h2 {
            font-weight: 800;
          }

          nav {
            bottom: 0;
            left: 0;
            border-top: 1px solid #ccc;
            position: fixed;
            width: 100%;
            height: 70px;
          }

          section {
            padding-top: 100px;
          }
        `}
      </style>
    </>
  );
};

export default HomePage;
