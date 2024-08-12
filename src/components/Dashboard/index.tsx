import React, { useState } from "react";
import {
  Form,
  Input,
  Button,
  Select,
  Table,
  Modal,
  DatePicker,
  Row,
  Col,
  Typography,
  Divider,
  Space,
  notification,
} from "antd";
import { PlusOutlined, SearchOutlined } from "@ant-design/icons";
import axios from "axios";
import moment from "moment";
import api from "../../service";

// Define a interface para o serviço
interface Service {
  key: number;
  name: string;
  date: string;
  description: string;
}

const { Option } = Select;

const Dashboard = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [services, setServices] = useState<Service[]>([]);

  const columns = [
    {
      title: "Nome",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Data",
      dataIndex: "date",
      key: "date",
    },
    {
      title: "Descrição",
      dataIndex: "description",
      key: "description",
    },
    {
      title: "Ações",
      key: "actions",
      render: (_: any, record: any) => (
        <Button onClick={() => handleEdit(record.key)}>Editar</Button>
      ),
    },
  ];

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleOk = () => {
    form
      .validateFields([
        "dataRegistroServico",
        "responsavel",
        "servicosPrestados",
      ])
      .then((values) => {
        const newService: Service = {
          key: services.length + 1,
          name: values.responsavel,
          date: values.dataRegistroServico.format("DD/MM/YYYY"),
          description: values.servicosPrestados,
        };

        setServices([...services, newService]);
        form.resetFields([
          "dataRegistroServico",
          "responsavel",
          "servicosPrestados",
        ]);
        setIsModalVisible(false);
      });
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const handleEdit = (key: any) => {
    showModal();
  };

  const handleSearchCPF = async () => {
    try {
      const cpfValue = form.getFieldValue("cpf");
      const response = await api.get(`/api/v1/paciente/cpf/${cpfValue}`);
      const paciente = response.data;
  
      // Popula o formulário com os dados do paciente
      form.setFieldsValue({
        nomePaciente: paciente.nome,
        sexo: paciente.sexo,
        estadoCivil: paciente.estadoCivil,
        idade: paciente.idade,
        naturalidade: paciente.naturalidade,
        profissao: paciente.profissao,
        nomeMae: paciente.nomeMae,
        nomePai: paciente.nomePai,
        rua: paciente.endereco.rua,
        numero: paciente.endereco.numero,
        bairro: paciente.endereco.bairro,
        cidade: paciente.endereco.cidade,
        estado: paciente.endereco.estado,
        cep: paciente.endereco.cep,
        ams: paciente.ams,
        dataRegistro: paciente.dataRegistro ? moment(paciente.dataRegistro) : null,
      });
  
      // Popula a tabela com os serviços prestados
      const formattedServices = paciente.servicosPrestados.map((service: any, index: number) => ({
        key: index + 1,
        name: service.responsible,
        date: moment(service.date).format("DD/MM/YYYY"),
        description: service.description,
      }));
  
      setServices(formattedServices);
  
      // Exibe a mensagem de sucesso
      notification.success({
        message: `Usuário encontrado`,
        description: `Paciente: ${paciente.nome}`,
      });
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 404) {
        notification.error({
          message: "Paciente não encontrado",
          description: "O CPF inserido não corresponde a nenhum paciente cadastrado.",
        });
      } else {
        notification.error({
          message: "Erro ao buscar paciente",
          description: "Ocorreu um erro ao tentar buscar o paciente.",
        });
      }
    }
  };
  
  const handleClearCPF = () => {
    form.resetFields([
      "cpf",
      "nomePaciente",
      "sexo",
      "estadoCivil",
      "idade",
      "naturalidade",
      "profissao",
      "nomeMae",
      "nomePai",
      "rua",
      "numero",
      "bairro",
      "cidade",
      "estado",
      "cep",
      "ams",
      "dataRegistro",
    ]);
  };

  const handleSave = () => {
    form
      .validateFields()
      .then((values) => {
        const payload = {
          ...values,
          services,
        };

        console.log("Payload para salvar:", payload);
        // Aqui você pode enviar os dados para o backend via uma requisição POST, por exemplo:
        // axios.post('/api/pacientes', payload)
      })
      .catch((errorInfo) => {
        console.log("Erro na validação do formulário:", errorInfo);
      });
  };

  return (
    <div className="layout-content">
      <Row justify="center" gutter={12}>
        <Col xs={24} sm={24} md={24} lg={24} xl={24}>
          <Typography.Title level={1}>
            <Divider
              orientation="left"
              style={{ fontWeight: 900, color: "#7e9bad" }}
            >
              Formulário de Serviços Prestados ao Paciente
            </Divider>
          </Typography.Title>

          <Form form={form} layout="vertical">
            <Row gutter={16}>
              <Col xs={24} sm={24} md={24} lg={4} xl={4}>
                <Form.Item
                  label="Data do Registro"
                  name="dataRegistro"
                  rules={[
                    {
                      required: true,
                      message: "Por favor, insira a data de registro",
                    },
                  ]}
                >
                  <DatePicker style={{ width: "100%" }} />
                </Form.Item>
              </Col>
              <Col xs={24} sm={24} md={24} lg={4} xl={4}>
                <Form.Item
                  label="A.M.S"
                  name="ams"
                  rules={[
                    { required: true, message: "Por favor, insira o A.M.S" },
                  ]}
                >
                  <Input placeholder="Digite o A.M.S" />
                </Form.Item>
              </Col>
            </Row>
            <Typography.Title level={1}>
              <Divider
                orientation="left"
                style={{ fontWeight: 900, color: "#7e9bad" }}
              >
                Dados do Paciente
              </Divider>
            </Typography.Title>
            <Row gutter={16}>
              <Col xs={24} sm={24} md={24} lg={8} xl={8}>
                <Form.Item
                  label="CPF"
                  name="cpf"
                  rules={[
                    { required: true, message: "Por favor, insira o CPF" },
                  ]}
                >
                  <Input.Search
                    placeholder="Digite o CPF"
                    onSearch={handleSearchCPF}
                    addonAfter={
                      <Space>
                        <Button onClick={handleClearCPF}>Limpar</Button>
                      </Space>
                    }
                  />
                </Form.Item>
              </Col>

              <Col xs={24} sm={24} md={24} lg={16} xl={16}>
                <Form.Item label="Nome do Paciente" name="nomePaciente">
                  <Input placeholder="Nome do paciente" />
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={16}>
              <Col xs={24} sm={24} md={24} lg={4} xl={4}>
                <Form.Item label="Sexo" name="sexo">
                  <Select placeholder="Selecione o sexo">
                    <Option value="masculino">Masculino</Option>
                    <Option value="feminino">Feminino</Option>
                  </Select>
                </Form.Item>
              </Col>
              <Col xs={24} sm={24} md={24} lg={4} xl={4}>
                <Form.Item label="E.Civil" name="estadoCivil">
                  <Input placeholder="Estado Civil" />
                </Form.Item>
              </Col>
              <Col xs={24} sm={24} md={24} lg={4} xl={4}>
                <Form.Item label="Idade" name="idade">
                  <Input placeholder="Idade" type="number" />
                </Form.Item>
              </Col>
              <Col xs={24} sm={24} md={24} lg={4} xl={4}>
                <Form.Item label="Naturalidade" name="naturalidade">
                  <Input placeholder="Naturalidade" />
                </Form.Item>
              </Col>
              <Col xs={24} sm={24} md={24} lg={4} xl={4}>
                <Form.Item label="Profissão" name="profissao">
                  <Input placeholder="Profissão" />
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={16}>
              <Col xs={24} sm={24} md={24} lg={12} xl={12}>
                <Form.Item label="Nome da Mãe" name="nomeMae">
                  <Input placeholder="Nome da Mãe" />
                </Form.Item>
              </Col>
              <Col xs={24} sm={24} md={24} lg={12} xl={12}>
                <Form.Item label="Nome do Pai" name="nomePai">
                  <Input placeholder="Nome do Pai" />
                </Form.Item>
              </Col>
            </Row>
            <Typography.Title level={1}>
              <Divider
                orientation="left"
                style={{ fontWeight: 900, color: "#7e9bad" }}
              >
                Endereço
              </Divider>
            </Typography.Title>
            <Row gutter={16}>
              <Col xs={24} sm={24} md={24} lg={8} xl={8}>
                <Form.Item
                  label="Rua"
                  name="rua"
                  rules={[
                    { required: true, message: "Por favor, insira a rua" },
                  ]}
                >
                  <Input placeholder="Digite a rua" />
                </Form.Item>
              </Col>
              <Col xs={24} sm={24} md={24} lg={4} xl={4}>
                <Form.Item
                  label="Número"
                  name="numero"
                  rules={[
                    { required: true, message: "Por favor, insira o número" },
                  ]}
                >
                  <Input placeholder="Digite o número" type="number" />
                </Form.Item>
              </Col>
              <Col xs={24} sm={24} md={24} lg={8} xl={8}>
                <Form.Item
                  label="Bairro"
                  name="bairro"
                  rules={[
                    { required: true, message: "Por favor, insira o bairro" },
                  ]}
                >
                  <Input placeholder="Digite o bairro" />
                </Form.Item>
              </Col>
              <Col xs={24} sm={24} md={24} lg={8} xl={8}>
                <Form.Item
                  label="Cidade"
                  name="cidade"
                  rules={[
                    { required: true, message: "Por favor, insira a cidade" },
                  ]}
                >
                  <Input placeholder="Digite a cidade" />
                </Form.Item>
              </Col>
              <Col xs={24} sm={24} md={24} lg={4} xl={4}>
                <Form.Item
                  label="Estado"
                  name="estado"
                  rules={[
                    { required: true, message: "Por favor, insira o estado" },
                  ]}
                >
                  <Input placeholder="Digite o estado" />
                </Form.Item>
              </Col>
              <Col xs={24} sm={24} md={24} lg={8} xl={8}>
                <Form.Item
                  label="CEP"
                  name="cep"
                  rules={[
                    { required: true, message: "Por favor, insira o CEP" },
                  ]}
                >
                  <Input placeholder="Digite o CEP" />
                </Form.Item>
              </Col>
            </Row>

            <Typography.Title level={3}>
              <Divider
                orientation="left"
                style={{ fontWeight: 900, color: "#7e9bad" }}
              >
                Serviços Prestados
              </Divider>
            </Typography.Title>
            <Table
              columns={columns}
              dataSource={services}
              pagination={{ pageSize: 10 }}
            />

            <Button
              type="dashed"
              onClick={showModal}
              icon={<PlusOutlined />}
              style={{ marginTop: 16 }}
            >
              Adicionar Serviço
            </Button>

            <Row justify="end" style={{ marginTop: 16 }}>
              <Space>
                <Button onClick={handleClearCPF}>Cancelar</Button>
                <Button type="primary" onClick={handleSave}>
                  Salvar
                </Button>
              </Space>
            </Row>
          </Form>
        </Col>
      </Row>

      <Modal
        title="Adicionar Serviço"
        visible={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <Form layout="vertical" form={form}>
          <Form.Item
            label="Data do Registro"
            name="dataRegistroServico"
            rules={[
              {
                required: true,
                message: "Por favor, insira a data do registro",
              },
            ]}
          >
            <DatePicker style={{ width: "100%" }} />
          </Form.Item>
          <Form.Item
            label="Responsável"
            name="responsavel"
            rules={[
              { required: true, message: "Por favor, insira o responsável" },
            ]}
          >
            <Input placeholder="Responsável" />
          </Form.Item>
          <Form.Item
            label="Serviços Prestados"
            name="servicosPrestados"
            rules={[
              {
                required: true,
                message: "Por favor, descreva os serviços prestados",
              },
            ]}
          >
            <Input.TextArea
              rows={4}
              placeholder="Descreva os serviços prestados"
            />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default Dashboard;
