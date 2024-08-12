import { useState, useEffect } from "react";

import {
  Row,
  Col,
  Button,
  Drawer,
  Typography,
  Layout,
  ColorPicker,
  Divider,
  notification,
} from "antd";

import { DownloadOutlined } from "@ant-design/icons";


const logsetting = [
  <svg
    width="50"
    height="30"
    viewBox="0 0 20 20"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    key={0}
  >
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M11.4892 3.17094C11.1102 1.60969 8.8898 1.60969 8.51078 3.17094C8.26594 4.17949 7.11045 4.65811 6.22416 4.11809C4.85218 3.28212 3.28212 4.85218 4.11809 6.22416C4.65811 7.11045 4.17949 8.26593 3.17094 8.51078C1.60969 8.8898 1.60969 11.1102 3.17094 11.4892C4.17949 11.7341 4.65811 12.8896 4.11809 13.7758C3.28212 15.1478 4.85218 16.7179 6.22417 15.8819C7.11045 15.3419 8.26594 15.8205 8.51078 16.8291C8.8898 18.3903 11.1102 18.3903 11.4892 16.8291C11.7341 15.8205 12.8896 15.3419 13.7758 15.8819C15.1478 16.7179 16.7179 15.1478 15.8819 13.7758C15.3419 12.8896 15.8205 11.7341 16.8291 11.4892C18.3903 11.1102 18.3903 8.8898 16.8291 8.51078C15.8205 8.26593 15.3419 7.11045 15.8819 6.22416C16.7179 4.85218 15.1478 3.28212 13.7758 4.11809C12.8896 4.65811 11.7341 4.17949 11.4892 3.17094ZM10 13C11.6569 13 13 11.6569 13 10C13 8.34315 11.6569 7 10 7C8.34315 7 7 8.34315 7 10C7 11.6569 8.34315 13 10 13Z"
      fill="#ffffff"
    ></path>
  </svg>,
];

<svg
  width="20"
  height="20"
  viewBox="0 0 20 20"
  fill="none"
  xmlns="http://www.w3.org/2000/svg"
  key={0}
>
  <path
    fillRule="evenodd"
    clipRule="evenodd"
    d="M11.4892 3.17094C11.1102 1.60969 8.8898 1.60969 8.51078 3.17094C8.26594 4.17949 7.11045 4.65811 6.22416 4.11809C4.85218 3.28212 3.28212 4.85218 4.11809 6.22416C4.65811 7.11045 4.17949 8.26593 3.17094 8.51078C1.60969 8.8898 1.60969 11.1102 3.17094 11.4892C4.17949 11.7341 4.65811 12.8896 4.11809 13.7758C3.28212 15.1478 4.85218 16.7179 6.22417 15.8819C7.11045 15.3419 8.26594 15.8205 8.51078 16.8291C8.8898 18.3903 11.1102 18.3903 11.4892 16.8291C11.7341 15.8205 12.8896 15.3419 13.7758 15.8819C15.1478 16.7179 16.7179 15.1478 15.8819 13.7758C15.3419 12.8896 15.8205 11.7341 16.8291 11.4892C18.3903 11.1102 18.3903 8.8898 16.8291 8.51078C15.8205 8.26593 15.3419 7.11045 15.8819 6.22416C16.7179 4.85218 15.1478 3.28212 13.7758 4.11809C12.8896 4.65811 11.7341 4.17949 11.4892 3.17094ZM10 13C11.6569 13 13 11.6569 13 10C13 8.34315 11.6569 7 10 7C8.34315 7 7 8.34315 7 10C7 11.6569 8.34315 13 10 13Z"
    fill="#111827"
  ></path>
</svg>;

export const HeaderPanel = () => {

  const { Title, Text } = Typography;

  const [visible, setVisible] = useState(false);
  const [promptEvent, setPromptEvent] = useState<any>(null);
  const [alreadyInstalled, setAlreadyInstalled] = useState(false);

  useEffect(() => window.scrollTo(0, 0));

  const showDrawer = () => setVisible(true);
  const hideDrawer = () => setVisible(false);

  useEffect(() => {
    const handleBeforeInstallPrompt = (e: any) => {
      e.preventDefault();
      setPromptEvent(e);
      console.log("beforeinstallprompt event captured:", e);
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);

    return () =>
      window.removeEventListener(
        "beforeinstallprompt",
        handleBeforeInstallPrompt
      );
  }, []);
  useEffect(() => {
    const checkIfStandalone = () => {
      const isStandaloneMedia = window.matchMedia(
        "(display-mode: standalone)"
      ).matches;
      const isStandaloneNavigator =
        (window.navigator as any).standalone === true;

      console.log("isStandaloneMedia:", isStandaloneMedia);
      console.log("isStandaloneNavigator:", isStandaloneNavigator);

      const isStandalone = isStandaloneMedia || isStandaloneNavigator;
      console.log("isStandalone:", isStandalone);

      if (isStandalone) {
        setAlreadyInstalled(true);
        console.log("App is installed");
      } else {
        setAlreadyInstalled(false);
        console.log("App is not installed");
      }
    };

    checkIfStandalone();
  }, []);
  const handleInstallClick = () => {
    if (promptEvent) {
      console.log("Prompting install");
      promptEvent.prompt();
      promptEvent.userChoice.then((choiceResult: any) => {
        console.log("User choice result:", choiceResult);
        if (choiceResult.outcome === "accepted") {
          setPromptEvent(null);
          notification.success({
            message: "CTFERRO instalado com sucesso",
          });
        } else {
          notification.info({
            message: "Instalação do CTFERRO cancelada",
          });
        }
      });
    } else {
      console.log("No prompt event available");
    }
  };
  console.log(alreadyInstalled);
  return (
    <>
      <Row gutter={[24, 0]}>
        <Col span={24} md={18} className="header-control">
          <Button type="link" onClick={showDrawer}>
            {logsetting}
          </Button>

          <Drawer
            className="settings-drawer"
            mask={true}
            width={360}
            onClose={hideDrawer}
            open={visible}
          >
            <Layout>
              <div className="header-top">
                <Title level={4}>
                  Configuração
                  <Text className="subtitle">
                    Veja nossas opções de cores e configurações para sua
                    aplicação.
                  </Text>
                </Title>
              </div>

              <div className="sidebar-color">
                <Text className="subtitle mb-2">
                  Personalize as cores do aplicativo para refletir seu estilo
                  único. Ajuste as configurações de cor conforme desejar.
                </Text>
                <Divider />
        
                <div className="ant-docment">
                  <Text className="subtitle">
                    Instale nossa aplicação para uma melhor experiência!
                  </Text>
                  <Divider />
                  <Button
                    disabled={alreadyInstalled}
                    onClick={handleInstallClick}
                    size="large"
                    icon={<DownloadOutlined style={{ fontSize: "1.2rem" }} />}
                  >
                    Instalar Aplicação.
                  </Button>
                </div>
              </div>
            </Layout>
          </Drawer>
        </Col>
      </Row>
    </>
  );
};
