import { Col, Image, Row, Typography } from 'antd';
import IMG from '../assets/images.webp'

export default function HeaderGovernoMt() {
  return (
    <thead>
      <tr>
        <td>
          <div className='page-header-space' style={{ display: 'block' }}></div>
          <Row
            className='governoMT'
            align={'middle'}
            justify={'center'}
            gutter={6}
          >
            <Col>
              <Image width={80} src={IMG} preview={false} />
            </Col>
            <Col>
              <Typography.Paragraph
                className='cabecalhoGovernoMT'
                style={{ padding: 0, margin: 0, marginBottom: 0 }}
              >
                Governo do Estado do Piauí
              </Typography.Paragraph>
              <Typography.Paragraph
                className='cabecalhoGovernoMT'
                style={{ padding: 0, margin: 0, marginBottom: 0 }}
              >
                SESAM - SECRETARIA DE SAÚDE MUNICIPAL DE PIRIPIRI
              </Typography.Paragraph>
              <Typography.Paragraph
                className='cabecalhoGovernoMT'
                style={{ padding: 0, margin: 0, marginBottom: 0 }}
              >
                Centro de Saúde da Mulher de Piripiri-PI
              </Typography.Paragraph>
            </Col>
          </Row>

          <br />
        </td>
      </tr>
    </thead>
  );
}
