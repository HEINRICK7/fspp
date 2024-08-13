import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Login from "./components/Login";
import Home from "./components/Home";
import Pacientes from "./components/Pacientes";
import PrivateRoute from "./components/PrivateRoute";
import AppLayout from "./components/AppLayout";
import ListPacientes from "./components/Pacientes/ListPacientes";
import PacienteDetalhes from "./components/Pacientes/PacienteDetalhes";

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route
          path="/pacientes"
          element={
            <PrivateRoute>
              <AppLayout>
                <ListPacientes />
              </AppLayout>
            </PrivateRoute>
          }
        />
        <Route
          path="/pacientes/create"
          element={
            <PrivateRoute>
              <AppLayout>
                <Pacientes />
              </AppLayout>
            </PrivateRoute>
          }
        />
        <Route
          path="/pacientes/:cpf"
          element={
            <PrivateRoute>
              <AppLayout>
                <PacienteDetalhes />
              </AppLayout>
            </PrivateRoute>
          }
        />
         <Route
          path="/paciente/:cpf/editar"
          element={
            <PrivateRoute>
              <AppLayout>
                <Pacientes isEditMode={true} />
              </AppLayout>
            </PrivateRoute>
          }
        />
      </Routes>
    </Router>
  );
};

export default App;
