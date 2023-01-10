import AppLayout from "../components/AppLayout";
import "../styles/index.css";
import { RecoilRoot } from "recoil";

function MyApp({ Component, pageProps }) {
  return (
    <AppLayout>
      <RecoilRoot>
        <Component {...pageProps} />
      </RecoilRoot>
    </AppLayout>
  );
}

export default MyApp;
