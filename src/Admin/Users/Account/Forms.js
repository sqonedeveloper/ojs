import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import { Container, Row, Col, Breadcrumb, Form, Button } from 'react-bootstrap'
import axios from 'axios'
import MsgResponse from '../../../MsgResponse'

axios.defaults.baseURL = siteURL
axios.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest'

const { listCountry } = content

class Forms extends Component {
   constructor() {
      super()
   
      this.state = {
         errors: {}
      }
   
      this._onChange = this._onChange.bind(this)
   }
   
   _onChange(e) {
      const { name, value } = e.target
      this.setState({ [name]: value })
   }

   _submit() {
      this.setState({ btnLoading: true })
      var formData = new FormData()
      formData.append('pageType', pageType)
      formData.append('id', segment[5])

      var fields = ['first_name', 'last_name', 'username', 'email', 'password', 'country'];
      for (var i = 0; i < fields.length; i++) {
         var fieldState = this.state[fields[i]]

         if (fieldState === undefined) {
            formData.append(fields[i], '')
         } else {
            formData.append(fields[i], fieldState)
         }
      }
      
      axios.
         post('/admin/users/account/submit', formData).
         then(res => {
            var response = res.data
            this.setState({ ...response })

            if (response.status) {
               if (pageType === 'insert') {
                  this.setState({ ...response.emptyPost })
               }
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
         errors,
         btnLoading,
         first_name,
         last_name,
         username,
         email,
         password,
         country,
      } = this.state

      return (
         <Container fluid={true}>
            <Row className="page-titles">
               <Col md={12} className="align-self-center">
                  <h3 className="text-themecolor m-b-5 m-t-0">{document.getElementsByTagName('title')[0].innerText}</h3>
                  <Breadcrumb>
                     <Breadcrumb.Item active>Home</Breadcrumb.Item>
                     <Breadcrumb.Item active>Users</Breadcrumb.Item>
                     <Breadcrumb.Item active>Account</Breadcrumb.Item>
                     <Breadcrumb.Item active>{document.getElementsByTagName('title')[0].innerText}</Breadcrumb.Item>
                  </Breadcrumb>
               </Col>
            </Row>
            <Row>
               <Col md={12}>
                  <MsgResponse {...this.state} />
                  <div className="card">
                     <div className="card-body">
                        <Form.Group as={Row} className={errors.first_name ? 'has-danger' : ''}>
                           <Form.Label column sm={3}>First Name</Form.Label>
                           <Col sm={9}>
                              <Form.Control name="first_name" value={first_name} onChange={this._onChange} size="sm" />
                              <Form.Control.Feedback type="invalid">{errors.first_name}</Form.Control.Feedback>
                           </Col>
                        </Form.Group>
                        <Form.Group as={Row} className={errors.last_name ? 'has-danger' : ''}>
                           <Form.Label column sm={3}>Last Name</Form.Label>
                           <Col sm={9}>
                              <Form.Control name="last_name" value={last_name} onChange={this._onChange} size="sm" />
                              <Form.Control.Feedback type="invalid">{errors.last_name}</Form.Control.Feedback>
                           </Col>
                        </Form.Group>
                        <Form.Group as={Row} className={errors.username ? 'has-danger' : ''}>
                           <Form.Label column sm={3}>Username</Form.Label>
                           <Col sm={9}>
                              <Form.Control name="username" value={username} onChange={this._onChange} size="sm" />
                              <Form.Control.Feedback type="invalid">{errors.username}</Form.Control.Feedback>
                           </Col>
                        </Form.Group>
                        <Form.Group as={Row} className={errors.email ? 'has-danger' : ''}>
                           <Form.Label column sm={3}>Email</Form.Label>
                           <Col sm={9}>
                              <Form.Control name="email" value={email} onChange={this._onChange} size="sm" />
                              <Form.Control.Feedback type="invalid">{errors.email}</Form.Control.Feedback>
                           </Col>
                        </Form.Group>
                        <Form.Group as={Row} className={errors.password ? 'has-danger' : ''}>
                           <Form.Label column sm={3}>Password</Form.Label>
                           <Col sm={9}>
                              <Form.Control name="password" value={password} onChange={this._onChange} size="sm" type="password" />
                              <Form.Control.Feedback type="invalid">{errors.password}</Form.Control.Feedback>
                           </Col>
                        </Form.Group>
                        <Form.Group as={Row} className={errors.country ? 'has-danger' : ''}>
                           <Form.Label column sm={3}>Country</Form.Label>
                           <Col sm={9}>
                              <Form.Control name="country" value={country} onChange={this._onChange} size="sm" as="select">
                                 <option value="">--choose--</option>
                                 {listCountry.map((data, key) => {
                                    return <option value={data.value} key={key}>{data.label}</option>
                                 })}
                              </Form.Control>
                              <Form.Control.Feedback type="invalid">{errors.country}</Form.Control.Feedback>
                           </Col>
                        </Form.Group>
                        <Col sm={{ offset: 3, span: 9 }}>
                           <Button
                              variant="success"
                              className="waves-effect waves-light"
                              size="sm"
                              onClick={btnLoading ? null : this._submit.bind(this)}
                           >{btnLoading ? 'Loading...' : 'Submit'}</Button>
                        </Col>
                     </div>
                  </div>
               </Col>
            </Row>
         </Container>
      )
   }
}

ReactDOM.render(<Forms />, document.getElementById('root'))