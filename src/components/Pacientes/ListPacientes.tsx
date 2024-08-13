import React, { useState, useEffect } from "react";
import { Table, Button, Space, Row, Typography, Col, notification } from "antd";
import { PrinterOutlined, PlusOutlined, EditOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import api from "../../service";
import FilterPanel from "./FilterPanel"; // Importe o FilterPanel
import "./formPacientes.css";

interface Patient {
  id: string;
  key: string;
  name: string;
  cpf: string;
}

const ListPacientes: React.FC = () => {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchPatients();
  }, []);

  const fetchPatients = async (filters = {}) => {
    setLoading(true);
    try {
      const response = await api.get("/api/v1/pacientes", { params: filters });
      const patientsData = response.data.map((patient: any, index: number) => ({
        key: index.toString(),
        name: patient.nome,
        cpf: patient.cpf,
        id: patient.id,
      }));
      setPatients(patientsData);
    } catch (error) {
      notification.error({
        message: "Erro ao carregar pacientes",
        description: "Não foi possível carregar a lista de pacientes.",
      });
      setPatients([]); // Redefine a lista para vazio em caso de erro
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (filters: { cpf?: string; nome?: string }) => {
    fetchPatients(filters); // Chama a função fetchPatients com os filtros
  };

  const columns = [
    {
      title: "Nome",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "CPF",
      dataIndex: "cpf",
      key: "cpf",
    },
    {
      title: "Ações",
      key: "actions",
      width: "50px",
      render: (_: any, record: Patient) => (
        <Space size="middle">
          <Button
            icon={<PrinterOutlined />}
            onClick={() => navigate(`/pacientes/${record.cpf}`)}
          />
          <Button
            icon={<EditOutlined />}
            onClick={() => navigate(`/paciente/${record.cpf}/editar`)}
            type="default"
            className="no-print"
          />
        </Space>
      ),
    },
  ];

  return (
    <div className="layout-content">
      <Row justify="center" gutter={12}>
        <Col xs={24} sm={24} md={24} lg={24} xl={24}>
          <FilterPanel onSearch={handleSearch} />

          <Table
            columns={columns}
            dataSource={patients}
            pagination={{ pageSize: 10 }}
            loading={loading}
            title={() => {
              return (
                <Row justify={"space-between"}>
                  <Typography.Title level={3} style={{ color: "white" }}>
                    Lista de Pacientes
                  </Typography.Title>

                  <Space>
                    <Col>
                      <Button
                        icon={
                          <PlusOutlined
                            style={{ color: "#1DA57A", background: "#FFF" }}
                          />
                        }
                        onClick={() => navigate(`/pacientes/create`)}
                        title={"Novo"}
                      />
                    </Col>
                  </Space>
                </Row>
              );
            }}
          />
        </Col>
      </Row>
    </div>
  );
};

export default ListPacientes;
