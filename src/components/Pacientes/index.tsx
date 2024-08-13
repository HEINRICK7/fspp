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
  Spin,
} from "antd";
import {
  PlusOutlined,
  EyeOutlined,
  EditOutlined,
  DeleteOutlined,
} from "@ant-design/icons";
import axios from "axios";
import moment from "moment";
import api from "../../service";
import "./formPacientes.css";

interface Service {
  _id?: string;
  key: number;
  name: string;
  date: string;
  description: string;
}

const { Option } = Select;

const Pacientes = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isUpdate, setIsUpdate] = useState(false);
  const [form] = Form.useForm();
  const [services, setServices] = useState<Service[]>([]);
  const [servicesPayload, setServicesPayload] = useState<Service[]>([]);
  const [loading, setLoading] = useState(false);
  const [editingServiceKey, setEditingServiceKey] = useState<number | null>(
    null
  );
  const [modalForm] = Form.useForm();

  const columns = [
    {
      title: "Nome",
      dataIndex: "name",
      key: "name",
      width: "200px",
    },
    {
      title: "Data",
      dataIndex: "date",
      key: "date",
      width: "200px",
    },
    {
      title: "Descrição",
      dataIndex: "description",
      key: "description",
    },
    {
      title: "Ações",
      key: "actions",
      width: "100px",
      render: (_: any, record: Service) => (
        <>
          {servicesPayload.find((service) => service.key === record.key) ? (
            <Button
              icon={<EyeOutlined />}
              onClick={() => showServiceDetails(record)}
            ></Button>
          ) : (
            <div style={{ display: "flex" }}>
              <Button
                type="default"
                icon={<EditOutlined />}
                onClick={() => handleEdit(record.key)}
              ></Button>
              <Button
                danger
                icon={<DeleteOutlined />}
                onClick={() => handleDelete(record.key)}
                style={{ marginLeft: 8 }}
              ></Button>
            </div>
          )}
        </>
      ),
    },
  ];

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleOk = () => {
    modalForm
      .validateFields([
        "dataRegistroServico",
        "responsavel",
        "servicosPrestados",
      ])
      .then((values) => {
        const newService: Service = {
          key:
            editingServiceKey !== null
              ? editingServiceKey
              : services.length + 1,
          name: values.responsavel,
          date: values.dataRegistroServico.format("DD/MM/YYYY"),
          description: values.servicosPrestados,
        };

        if (editingServiceKey !== null) {
          const updatedServices = services.map((service) =>
            service.key === editingServiceKey ? newService : service
          );
          setServices(updatedServices);
        } else {
          setServices([newService, ...services]);
        }

        modalForm.resetFields(); // Reseta apenas o modalForm
        setEditingServiceKey(null);
        setIsModalVisible(false);
      })
      .catch((error) => {
        console.log(
          "Campos com erro de validação no modal:",
          error.errorFields
        );
      });
  };

  const handleSave = async () => {
    try {
      const values = await form.validateFields();
      const payload = {
        nome: values.nomePaciente,
        cpf: values.cpf,
        sexo: values.sexo,
        estadoCivil: values.estadoCivil,
        idade: values.idade,
        naturalidade: values.naturalidade,
        profissao: values.profissao,
        nomeMae: values.nomeMae,
        nomePai: values.nomePai,
        endereco: {
          rua: values.rua,
          numero: values.numero,
          bairro: values.bairro,
          cidade: values.cidade,
          estado: values.estado,
          cep: values.cep,
        },
        ams: values.ams,
        dataRegistro: values.dataRegistro
          ? values.dataRegistro.toISOString()
          : null,
        servicosPrestados: services.map((service) => ({
          date: moment(service.date, "DD/MM/YYYY").toISOString(),
          responsible: service.name,
          description: service.description,
        })),
      };

      if (isUpdate) {
        const cpfValue = form.getFieldValue("cpf");
        const response = await api.put(
          `/api/v1/paciente/cpf/${cpfValue}`,
          payload
        );
        notification.success({
          message: "Paciente atualizado com sucesso",
          description: `Paciente ${response.data.nome} foi atualizado.`,
        });
      } else {
        const response = await api.post("/api/v1/pacientes", payload);
        notification.success({
          message: "Paciente salvo com sucesso",
          description: `Paciente ${response.data.nome} foi salvo.`,
        });
      }

      form.resetFields();
      setServices([]);
      setIsUpdate(false);
    } catch (error: any) {
      console.log("Erro na validação do formulário ou no envio:", error);
      if (error.errorFields) {
        console.log("Campos com erro de validação:", error.errorFields);
      }
      notification.error({
        message: "Erro ao salvar paciente",
        description:
          "Ocorreu um erro ao tentar salvar o paciente. Verifique os campos e tente novamente.",
      });
    }
  };

  const handleCancel = () => {
    modalForm.resetFields();
    setEditingServiceKey(null);
    setIsModalVisible(false);
  };

  const handleEdit = (key: number) => {
    const serviceToEdit = services.find((service) => service.key === key);
    if (serviceToEdit) {
      modalForm.setFieldsValue({
        dataRegistroServico: moment(serviceToEdit.date, "DD/MM/YYYY"),
        responsavel: serviceToEdit.name,
        servicosPrestados: serviceToEdit.description,
      });
      setEditingServiceKey(key);
      setIsModalVisible(true);
    }
  };

  const handleDelete = (key: number) => {
    Modal.confirm({
      title: "Confirmação de Exclusão",
      content: "Tem certeza de que deseja excluir este serviço?",
      okText: "Sim",
      okType: "danger",
      cancelText: "Não",
      onOk: () => {
        const updatedServices = services.filter(
          (service) => service.key !== key
        );
        setServices(updatedServices);
        notification.success({
          message: "Serviço excluído com sucesso",
        });
      },
    });
  };

  const handleSearchCPF = async () => {
    setLoading(true);
    try {
      const cpfValue = form.getFieldValue("cpf");
      const response = await api.get(`/api/v1/paciente/cpf/${cpfValue}`);
      const paciente = response.data;

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
        dataRegistro: paciente.dataRegistro
          ? moment(paciente.dataRegistro)
          : null,
      });

      const formattedServices = paciente.servicosPrestados.map(
        (service: any, index: number) => ({
          key: index + 1,
          name: service.responsible,
          date: moment(service.date).format("DD/MM/YYYY"),
          description: service.description,
        })
      );
      const formattedPayloadServices = paciente.servicosPrestados.map(
        (service: any, index: number) => ({
          key: index + 1,
          name: service.responsible,
          date: moment(service.date).format("DD/MM/YYYY"),
          description: service.description,
        })
      );
      setServicesPayload(formattedPayloadServices);
      setServices(formattedServices);
      setIsUpdate(true);

      notification.success({
        message: `Usuário encontrado`,
        description: `Paciente: ${paciente.nome}`,
      });
    } catch (error) {
      setIsUpdate(false);
      if (axios.isAxiosError(error) && error.response?.status === 404) {
        notification.error({
          message: "Paciente não encontrado",
          description:
            "O CPF inserido não corresponde a nenhum paciente cadastrado.",
        });
      } else {
        notification.error({
          message: "Erro ao buscar paciente",
          description: "Ocorreu um erro ao tentar buscar o paciente.",
        });
      }
    } finally {
      setLoading(false);
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
    setServices([]);
    setIsUpdate(false);
  };
  const showServiceDetails = (service: Service) => {
    Modal.info({
      title: "Detalhes do Serviço",
      width: "50%",
      height: "70%",
      content: (
        <Space direction="vertical">
          <Typography.Text>
            <strong>Responsável:</strong> {service.name}
          </Typography.Text>
          <Typography.Text>
            <strong>Data:</strong> {service.date}
          </Typography.Text>
          <Typography.Text>
            <strong>Descrição:</strong> {service.description}
          </Typography.Text>
        </Space>
      ),
      onOk() {},
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
          <Spin spinning={loading}>
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
                          <Button
                            icon={<DeleteOutlined />}
                            danger
                            onClick={handleClearCPF}
                          ></Button>
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
              <Divider/>
              <Table
                columns={columns}
                dataSource={services}
                pagination={{ pageSize: 4 }}
                title={() => {
                  return (
                    <Row justify={"space-between"}>
                      <Typography.Title level={4} style={{ color: "white" }}>
                        Serviços Prestados
                      </Typography.Title>

                      <Space>
                        <Col>
                          <Button
                            icon={
                              <PlusOutlined
                                style={{ color: "#1DA57A", background: "#FFF" }}
                              />
                            }
                            onClick={showModal}
                            title={"Novo"}
                          />
                        </Col>
                      </Space>
                    </Row>
                  );
                }}
              />

              <Row justify="end" style={{ marginTop: 16 }}>
                <Space>
                  <Button onClick={handleClearCPF}>Cancelar</Button>
                  <Button type="primary" onClick={handleSave}>
                    Salvar
                  </Button>
                </Space>
              </Row>
            </Form>
          </Spin>
        </Col>
      </Row>

      <Modal
        title="Adicionar Serviço"
        visible={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <Form
          form={modalForm} // Use o modalForm aqui
          layout="vertical"
        >
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

export default Pacientes;
