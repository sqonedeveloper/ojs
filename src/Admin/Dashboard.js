import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import { Container, Row, Col, Breadcrumb } from 'react-bootstrap'

class Dashboard extends Component {
   render() {
      return (
         <Container fluid={true}>
            <Row className="page-titles">
               <Col md={12} className="align-self-center">
                  <h3 className="text-themecolor m-b-5 m-t-0">{document.getElementsByTagName('title')[0].innerText}</h3>
                  <Breadcrumb>
                     <Breadcrumb.Item active>Home</Breadcrumb.Item>
                     <Breadcrumb.Item active>{document.getElementsByTagName('title')[0].innerText}</Breadcrumb.Item>
                  </Breadcrumb>
               </Col>
            </Row>
            <Row>
               <Col md={12}>
                  <div className="card">
                     <div className="card-body">
                        This is some text within a card block.
                     </div>
                  </div>
               </Col>
            </Row>
         </Container>
      )
   }
}

ReactDOM.render(<Dashboard />, document.getElementById('root'))