import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import "./app.css";
import { ConfigProvider } from "antd";
const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);

const customTheme = {
  token: {
    colorPrimary: "#1DA57A", // Cor primária
    colorSuccess: "#52c41a", // Cor para sucesso
    colorWarning: "#faad14", // Cor para avisos
    colorError: "#f5222d", // Cor para erros
    colorLink: "#1DA57A", // Cor dos links
    borderRadius: 4, // Raio das bordas dos botões e outros elementos
    buttonDefaultBg: "#f5f5f5", // Cor de fundo do botão padrão
    buttonDefaultColor: "#000", // Cor do texto do botão padrão
    buttonPrimaryBg: "#1DA57A", // Cor de fundo do botão primário
    buttonPrimaryColor: "#fff", // Cor do texto do botão primário
    buttonDangerBg: "#ff4d4f", // Cor de fundo do botão de perigo
    buttonDangerColor: "#fff", // Cor do texto do botão de perigo
  },
};

root.render(
  <React.StrictMode>
    <ConfigProvider theme={customTheme}>
      <App />
    </ConfigProvider>
  </React.StrictMode>
);

reportWebVitals();
