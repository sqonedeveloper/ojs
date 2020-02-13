import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import { Container, Row, Col, Breadcrumb, Button, Table } from 'react-bootstrap'
import { contextMenu } from '../../../Helpers'

class Lists extends Component {
   constructor() {
      super()

      this.state = {
         visible: false
      }
   }

   componentDidMount() {
      this.loadData = $('#datatable').DataTable({
         responsive: true,
         ordering: true,
         processing: true,
         serverSide: true,
         ajax: {
            url: siteURL + '/admin/users/account/getData',
            type: 'POST'
         },
         createdRow: (row, data) => {
            row.onclick = e => {
               this.setState({ id_users: data.id })

               this._handleClick(e)
               contextMenu(e, this.root)
            }
         },
         columns: [
            null,
            null,
            null,
            null,
         ]
      });
   }

   _handleClick(e) {
      const { visible } = this.state;
      this.setState({ visible: !visible });
   }

   render() {
      const {
         visible,
         id_users
      } = this.state

      return (
         <>
            <Container fluid={true}>
               <Row className="page-titles">
                  <Col md={9} className="align-self-center">
                     <h3 className="text-themecolor m-b-5 m-t-0">{document.getElementsByTagName('title')[0].innerText}</h3>
                     <Breadcrumb>
                        <Breadcrumb.Item active>Home</Breadcrumb.Item>
                        <Breadcrumb.Item active>Users</Breadcrumb.Item>
                        <Breadcrumb.Item active>{document.getElementsByTagName('title')[0].innerText}</Breadcrumb.Item>
                     </Breadcrumb>
                  </Col>
                  <Col md={3} className="align-self-center">
                     <Button
                        variant="success"
                        className="float-right waves-effect waves-light"
                        size="sm"
                        onClick={() => open(siteURL + '/admin/users/account/addNew', '_parent')}
                     >Add New Account</Button>
                  </Col>
               </Row>
               <Row>
                  <Col md={12}>
                     <div className="card">
                        <Table striped bordered hover size="sm" id="datatable">
                           <thead>
                              <tr>
                                 <th>Fullname</th>
                                 <th>Username</th>
                                 <th>Email</th>
                                 <th>Status</th>
                              </tr>
                           </thead>
                        </Table>
                     </div>
                  </Col>
               </Row>
            </Container>
            {visible ? <div ref={ref => { this.root = ref }} className="contextMenu">
               <div onClick={() => open(siteURL + '/admin/users/account/detail/' + id_users, '_parent')} className="contextMenu--option">Detail</div>
               <div onClick={() => open(siteURL + '/admin/users/account/edit/' + id_users, '_parent')} className="contextMenu--option">Edit</div>
               <div onClick={() => open(siteURL + '/admin/users/account/' + id_users, '_parent')} className="contextMenu--option">Delete</div>
            </div> : null}
         </>
      )
   }
}

ReactDOM.render(<Lists />, document.getElementById('root'))