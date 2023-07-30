import { useRoutes } from "react-router-dom";
import router from "../router.jsx";
import "./Layout.css";
function Layout() {
  const content = useRoutes(router);
  return (
    <>
      <header className={"header"}>
        <h1>A-maze-ing Race</h1>
        <ul>
          <li>
            <a href="/">Maze</a>
          </li>
          <li>
            <a href="/process">Process</a>
          </li>
        </ul>
      </header>
      <main className="content">{content}</main>
    </>
  );
}

export default Layout;
