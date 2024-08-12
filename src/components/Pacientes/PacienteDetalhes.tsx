import React, { useEffect, useRef, useState } from "react";
import {
  Card,
  Descriptions,
  Row,
  Typography,
  Button,
  notification,
} from "antd";
import { useParams } from "react-router-dom";
import { useReactToPrint } from "react-to-print";
import HeaderGovernoPI from "../HeaderGovernoMt.report";
import "./formPacientes.css";
import api from "../../service";

interface Service {
  date: string;
  responsible: string;
  description: string;
}

interface Patient {
  nome: string;
  cpf: string;
  sexo: string;
  estadoCivil: string;
  idade: string;
  naturalidade: string;
  profissao: string;
  nomeMae: string;
  nomePai: string;
  endereco: {
    rua: string;
    numero: string;
    bairro: string;
    cidade: string;
    estado: string;
    cep: string;
  };
  servicosPrestados: Service[];
}

export default function PacienteDetalhes() {
  const { cpf } = useParams<{ cpf: string }>();
  const [patient, setPatient] = useState<Patient | null>(null);
  const [loading, setLoading] = useState(true);
  const componentRef = useRef<HTMLDivElement>(null); // Referência para impressão

  useEffect(() => {
    const fetchPatientDetails = async () => {
      try {
        const response = await api.get(`/api/v1/paciente/cpf/${cpf}`);
        setPatient(response.data);
      } catch (error) {
        notification.error({
          message: "Erro ao carregar dados do paciente",
          description: "Não foi possível carregar os dados do paciente.",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchPatientDetails();
  }, [cpf]);

  const handlePrint = useReactToPrint({
    content: () => componentRef.current, // Conteúdo a ser impresso
    documentTitle: `Paciente_${patient?.nome}`,
  });

  const renderDescriptionPanel = (title: string, data: any[]) => {
    return (
      <Card
        headStyle={{ backgroundColor: "#e9e8e8" }}
        title={<Typography.Title level={5}>{title}</Typography.Title>}
        size="small"
        bodyStyle={{ padding: "8px" }}
        style={{ marginBottom: "16px" }}
      >
        <Descriptions bordered layout="vertical" column={3}>
          {data.map((item, index) => (
            <Descriptions.Item
              key={index}
              label={item.label}
              span={item.span || 1}
              labelStyle={{
                fontWeight: "bold",
                display: "inline-block",
                alignItems: "left",
              }}
              style={{ paddingTop: 0, paddingBottom: 8 }}
            >
              {item.value}
            </Descriptions.Item>
          ))}
        </Descriptions>
      </Card>
    );
  };

  const servicesData =
    patient?.servicosPrestados
      ?.map((service, index) => [
        { label: `Responsável`, value: service.responsible },
        { label: `Data`, value: service.date },
        { label: `Descrição`, value: service.description, span: 2 },
      ])
      .flat() || [];

  if (loading) return <p>Carregando...</p>;

  return (
    <>
      <Button
        onClick={handlePrint}
        style={{ margin: 20 }}
        type="primary"
        className="no-print"
      >
        Imprimir PDF
      </Button>
      <div ref={componentRef} className="print-container">
        <HeaderGovernoPI />

        <Row gutter={24} justify="center">
          <Typography.Title level={4}>DADOS DO PACIENTE</Typography.Title>
        </Row>
        <br />

        {renderDescriptionPanel("Informações Básicas", [
          { label: "Nome", value: patient?.nome },
          { label: "CPF", value: patient?.cpf },
          { label: "Sexo", value: patient?.sexo },
          { label: "Estado Civil", value: patient?.estadoCivil },
          { label: "Idade", value: patient?.idade },
          { label: "Naturalidade", value: patient?.naturalidade },
          { label: "Profissão", value: patient?.profissao },
        ])}
        <br />

        {renderDescriptionPanel("Filiação", [
          { label: "Nome da Mãe", value: patient?.nomeMae },
          { label: "Nome do Pai", value: patient?.nomePai },
        ])}
        <br />

        {renderDescriptionPanel("Endereço", [
          { label: "Rua", value: patient?.endereco.rua },
          { label: "Número", value: patient?.endereco.numero },
          { label: "Bairro", value: patient?.endereco.bairro },
          { label: "Cidade", value: patient?.endereco.cidade },
          { label: "Estado", value: patient?.endereco.estado },
          { label: "CEP", value: patient?.endereco.cep },
        ])}
        <br />

        {renderDescriptionPanel("Serviços Prestados", servicesData)}
        <br />
      </div>
    </>
  );
}
