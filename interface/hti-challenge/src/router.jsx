import Maze from "./pages/Maze";
import Process from "./pages/Process";

const router = [
  {
    path: "/",
    element: <Maze />,
  },
  {
    path: "/process",
    element: <Process />,
  },
];

export default router;
