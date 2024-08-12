import React, { useCallback } from "react";
import { Button, Col, Collapse, Divider, Form, Input, Row } from "antd";
import { DeleteOutlined } from "@ant-design/icons";

interface FilterPanelProps {
  open?: boolean;
  onSearch: (filters: { cpf?: string; nome?: string }) => void;
}

export default function FilterPanel({ open = true, onSearch }: FilterPanelProps) {
  const [form] = Form.useForm();

  const handleFormSubmit = useCallback(
    (values: any) => {
      const formValues = form.getFieldsValue();
      onSearch({
        cpf: formValues.cpf,
        nome: formValues.nome,
      });
    },
    [form, onSearch]
  );

  const handleClearFilters = useCallback(() => {
    form.resetFields(); // Limpa os campos do formulário
    onSearch({ cpf: undefined, nome: undefined }); // Reseta a lista de pacientes
  }, [form, onSearch]);

  const removeField = useCallback(
    (fieldName: string) => {
      form.setFieldsValue({
        [fieldName]: null,
      });
    },
    [form]
  );

  return (
    <>
      <Row style={{ width: "100%", margin: '20px 0' }}>
        <Collapse
          defaultActiveKey={open ? "0" : "1"}
          style={{ width: "100%", backgroundColor: "#e0e4e8" }}
        >
          <Collapse.Panel
            header={<span style={{ fontWeight: "bold" }}>Filtrar</span>}
            key={1}
          >
            <Form
              layout={"horizontal"}
              form={form}
              size="large"
              onFinish={handleFormSubmit}
              autoComplete={"off"}
            >
              <Col span={24}>
                <Form.Item label={"CPF"}>
                  <Input.Group
                    style={{
                      display: "flex",
                      flexDirection: "row",
                    }}
                  >
                    <Form.Item
                      name={"cpf"}
                      style={{
                        width: "100%",
                        marginBottom: "0",
                        marginTop: "0",
                      }}
                    >
                      <Input placeholder="Digite o CPF" />
                    </Form.Item>

                    <Button
                      style={{
                        height: "34px",
                      }}
                      icon={<DeleteOutlined />}
                      danger
                      onClick={() => removeField("cpf")}
                    />
                  </Input.Group>
                </Form.Item>
              </Col>
              <Col span={24}>
                <Form.Item label={"Nome"}>
                  <Input.Group
                    style={{
                      display: "flex",
                      flexDirection: "row",
                    }}
                  >
                    <Form.Item
                      name={"nome"}
                      style={{
                        width: "100%",
                        marginBottom: "0",
                        marginTop: "0",
                      }}
                    >
                      <Input placeholder="Digite o Nome" />
                    </Form.Item>

                    <Button
                      style={{
                        height: "34px",
                      }}
                      icon={<DeleteOutlined />}
                      danger
                      onClick={() => removeField("nome")}
                    />
                  </Input.Group>
                </Form.Item>
              </Col>

              <Divider />

              <Row justify={"end"} gutter={24}>
                <Col xs={12} lg={6}>
                  <Button
                    style={{ width: "100%" }}
                    onClick={handleClearFilters}
                  >
                    Limpar
                  </Button>
                </Col>

                <Col xs={12} lg={6}>
                  <Button
                    style={{ width: "100%" }}
                    htmlType={"submit"}
                    type={"primary"}
                  >
                    Buscar
                  </Button>
                </Col>
              </Row>
            </Form>
          </Collapse.Panel>
        </Collapse>
      </Row>
    </>
  );
}
