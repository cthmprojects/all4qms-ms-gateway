import './footer.scss';

import React from 'react';

import { Col, Row } from 'reactstrap';

export interface IFooterProps {
  isAuthenticated: boolean;
}

export const Footer = (props: IFooterProps) => {
  const renderFooter = () => {
    if (props.isAuthenticated) {
      return (
        <div className="footer page-content">
          <Row>
            <Col md="12">
              <p>Este é o rodapé da página</p>
            </Col>
          </Row>
        </div>
      );
    }
  };

  return <>{renderFooter}</>;
};

export default Footer;
