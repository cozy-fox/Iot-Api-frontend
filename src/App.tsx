import AuthService from "./services/auth.service";

import TableDashboard from "./components/table.dashboard";
import Login from "./components/login.page";
import { useEffect } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";

type Props = {};

const App: React.FC<Props> = () => {

  const navigate = useNavigate();

  useEffect(() => {
    const user = AuthService.getCurrentUser();
    if (user) {
      navigate('/table', { replace: true });
    } else{
      navigate('/', { replace: true });
    }

  }, [navigate]);

  return (
    <div>
      <div className="">
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/login" element={<Login />} />
          <Route path="/table" element={<TableDashboard />} />
        </Routes>
      </div>
    </div>
  );
};

export default App;