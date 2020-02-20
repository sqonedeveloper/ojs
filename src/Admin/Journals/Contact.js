import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import { Container, Row, Col, Breadcrumb, Form, Button } from 'react-bootstrap'
import axios from 'axios'
import MsgResponse from '../../MsgResponse'
import Navigation from './Navigation'

axios.defaults.baseURL = siteURL
axios.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest'

const { detail } = content

class Contact extends Component {
   constructor() {
      super()

      this.state = {
         errors: {}
      }

      this._onChange = this._onChange.bind(this)
   }

   componentDidMount() {
      this.setState({ ...detail })
   }

   _onChange(e) {
      const { name, value } = e.target
      this.setState({ [name]: value })
   }

   _handleEditorChange(e, value) {
      this.setState({ [e]: value })
   }

   _submit() {
      this.setState({ btnLoading: true })
      var formData = new FormData()
      formData.append('pageType', segment[5])
      formData.append('id', segment[4])

      var fieldNames = ['name', 'title', 'email', 'phone', 'affiliation']
      for (var i = 0; i < fieldNames.length; i++) {
         var fieldStates = this.state[fieldNames[i]]

         if (fieldStates === undefined) {
            formData.append(fieldNames[i], '')
         } else {
            formData.append(fieldNames[i], fieldStates)
         }
      }

      axios.
         post('/admin/journals/submitWizard', formData).
         then(res => {
            var response = res.data
            this.setState({ ...response })

            if (response.status) {
               open(siteURL + '/admin/journals/wizard/' + segment[4] + '/apperance', '_parent')
            }
         }).
         catch(error => {
            console.log('Error', error.message)
         }).
         finally(() => {
            this.setState({ btnLoading: false })
         })
   }

   render() {
      const {
         btnLoading,
         errors,
         name,
         title,
         email,
         phone,
         affiliation
      } = this.state

      return (
         <Container fluid={true}>
            <Row className="page-titles">
               <Col md={12} className="align-self-center">
                  <h3 className="text-themecolor m-b-5 m-t-0">{document.getElementsByTagName('title')[0].innerText}</h3>
                  <Breadcrumb>
                     <Breadcrumb.Item active>Home</Breadcrumb.Item>
                     <Breadcrumb.Item active>Journals</Breadcrumb.Item>
                     <Breadcrumb.Item active>{document.getElementsByTagName('title')[0].innerText}</Breadcrumb.Item>
                     <Breadcrumb.Item active>Contact</Breadcrumb.Item>
                  </Breadcrumb>
               </Col>
            </Row>
            <Row>
               <Col md={12}>
                  <MsgResponse {...this.state} />
                  <div className="card">
                     <div className="card-body">
                        <Navigation segment={segment} id={segment[4]} />
                        <div className="tab-content">
                           <div className="tab-pane active p-10">
                              <h6>Principal Contact</h6>
                              <p>Enter contact details, typically for a principal editorship, managing editorship, or administrative staff position, which can be displayed on your publicly accessible website.</p>
                              <Form.Group as={Row}>
                                 <Form.Label column sm={2} className="required">Name</Form.Label>
                                 <Col sm={10}>
                                    <Row>
                                       <Col sm={5} className={errors.name ? 'has-danger' : ''}>
                                          <Form.Control name="name" value={name} onChange={this._onChange} size="sm" />
                                          <Form.Control.Feedback type="invalid">{errors.name}</Form.Control.Feedback>
                                       </Col>
                                       <Form.Label column sm={2}>Title</Form.Label>
                                       <Col sm={5} className={errors.title ? 'has-danger' : ''}>
                                          <Form.Control name="title" value={title} onChange={this._onChange} size="sm" />
                                          <Form.Control.Feedback type="invalid">{errors.title}</Form.Control.Feedback>
                                       </Col>
                                    </Row>
                                 </Col>
                              </Form.Group>
                              <Form.Group as={Row}>
                                 <Form.Label column sm={2} className="required">Email</Form.Label>
                                 <Col sm={10}>
                                    <Row>
                                       <Col sm={5} className={errors.email ? 'has-danger' : ''}>
                                          <Form.Control name="email" value={email} onChange={this._onChange} size="sm" />
                                          <Form.Control.Feedback type="invalid">{errors.email}</Form.Control.Feedback>
                                       </Col>
                                       <Form.Label column sm={2}>Phone</Form.Label>
                                       <Col sm={5} className={errors.phone ? 'has-danger' : ''}>
                                          <Form.Control name="phone" value={phone} onChange={this._onChange} size="sm" />
                                          <Form.Control.Feedback type="invalid">{errors.phone}</Form.Control.Feedback>
                                       </Col>
                                    </Row>
                                 </Col>
                              </Form.Group>
                              <Form.Group as={Row}>
                                 <Form.Label column sm={2}>Affiliation</Form.Label>
                                 <Col sm={10} className={errors.affiliation ? 'has-danger' : ''}>
                                    <Form.Control name="affiliation" value={affiliation} onChange={this._onChange} size="sm" />
                                    <Form.Control.Feedback type="invalid">{errors.affiliation}</Form.Control.Feedback>
                                 </Col>
                              </Form.Group>
                              <Col sm={{ offset: 2, span: 10 }}>
                                 <Button
                                    variant="success"
                                    className="waves-effect waves-light"
                                    size="sm"
                                    onClick={btnLoading ? null : this._submit.bind(this)}
                                 >{btnLoading ? 'Loading...' : 'Continue'}</Button>
                              </Col>
                           </div>
                        </div>
                     </div>
                  </div>
               </Col>
            </Row>
         </Container>
      )
   }
}

ReactDOM.render(<Contact />, document.getElementById('root'))