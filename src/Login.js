import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import { Form, Button, Col } from 'react-bootstrap'
import axios from 'axios'
import MsgResponse from './MsgResponse'

axios.defaults.baseURL = siteURL
axios.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest'

class Login extends Component {
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

      var fields = ['username', 'password'];
      for (var i = 0; i < fields.length; i++) {
         var fieldState = this.state[fields[i]]

         if (fieldState === undefined) {
            formData.append(fields[i], '')
         } else {
            formData.append(fields[i], fieldState)
         }
      }
      
      axios.
         post('/login/submit', formData).
         then(res => {
            var response = res.data
            this.setState({ ...response })

            if (response.status) {
               if (response.is_super === 't') {
                  open(siteURL + '/admin/dashboard', '_parent')
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
         btnLoading,
         username,
         password
      } = this.state

      return (
         <div className="login-register">
            <div className="login-box card">
               <div className="card-body">
                  <MsgResponse {...this.state} />
                  <Form className="form-horizontal form-material">
                     <h3 className="p-2 rounded-title mb-3">Sign In</h3>
                     <Form.Group>
                        <Form.Control name="username" value={username} onChange={this._onChange} placeholder="Username" autoFocus />
                     </Form.Group>
                     <Form.Group>
                        <Form.Control name="password" value={password} onChange={this._onChange} placeholder="Password" type="password" />
                     </Form.Group>
                     <Form.Group>
                        <div className="d-flex no-block align-items-center">
                           <div className="ml-auto">
                              <a href="javascript:void(0)" className="text-muted"><i className="fa fa-lock mr-1" /> Forgot password?</a>
                           </div>
                        </div>
                     </Form.Group>
                     <Form.Group className="text-center mt-3">
                        <Button
                           variant="info"
                           size="lg"
                           className="btn-block text-uppercase waves-effect waves-light"
                           onClick={btnLoading ? null : this._submit.bind(this)}
                        >{btnLoading ? 'Loading...' : 'Log in'}</Button>
                     </Form.Group>
                     <Form.Group className="mb-0">
                        <Col sm={12} className="text-center">
                           Don't have an account? <a href="" className="text-info ml-1"><b>Sign Up</b></a>
                        </Col>
                     </Form.Group>
                  </Form>
                  <Form className="form-horizontal">
                     <Form.Group>
                        <h3>Recover Password</h3>
                        <p className="text-muted">Enter your Email and instructions will be sent to you! </p>
                     </Form.Group>
                     <Form.Group>
                        <Form.Control placeholder="Email" type="email" />
                     </Form.Group>
                     <Form.Group className="text-center mt-3">
                        <Button
                           variant="primary"
                           size="lg"
                           className="btn-block text-uppercase waves-effect waves-light"
                        >{btnLoading ? 'Loading...' : 'Reset'}</Button>
                     </Form.Group>
                  </Form>
               </div>
            </div>
         </div>
      )
   }
}

ReactDOM.render(<Login />, document.getElementById('wrapper'))