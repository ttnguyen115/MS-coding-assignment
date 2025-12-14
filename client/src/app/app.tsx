import { Route, Routes } from "react-router-dom";

import styles from "./app.module.css";

import TicketDetail from "./TicketDetail";
import Tickets from "./Tickets";

const App = () => {
  return (
    <div className={styles["app"]}>
      <Routes>
        <Route path="/" element={<Tickets />} />
        <Route path="/:id" element={<TicketDetail />} />
      </Routes>
    </div>
  );
};

export default App;
