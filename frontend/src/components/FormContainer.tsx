import { Col, Container, Row } from 'react-bootstrap';
import { ReactNode } from 'react';

const FormContainer = ({children}: {children: ReactNode}) => {
  return (
    <Container>
      <Row className="justify-content-md-center">
        <Col md={10}>{children}</Col>
      </Row>
    </Container>
  )
}

export default FormContainer