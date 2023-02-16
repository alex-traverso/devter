import Link from "next/link";
import Home from "../Icons/Home";
import Search from "../Icons/Search";
import Create from "../Icons/Create";

export default function Navbar() {
  return (
    <>
      <nav>
        <Link href='../home'>
          <Home stroke='#439ACF' height={40} width={40} />
        </Link>
        <Link href='../compose/devit'>
          <Search stroke='#439ACF' height={40} width={40} />
        </Link>
        <Link href='../compose/devit'>
          <Create stroke='#439ACF' height={40} width={40} />
        </Link>
      </nav>

      <style jsx>{`
        nav {
          position: sticky;
          bottom: 0;
          left: 0;
          border-top: 1px solid #ccc;
          width: 100%;
          height: 50px;
          background-color: #fff;
          z-index: 100;
          display: flex;
          align-items: center;
          justify-content: space-around;
        }
      `}</style>
    </>
  );
}
