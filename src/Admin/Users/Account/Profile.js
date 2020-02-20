import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import { Container, Row, Col, Breadcrumb, Form, Button } from 'react-bootstrap'
import { Editor } from '@tinymce/tinymce-react'
import { LazyLoadImage } from 'react-lazy-load-image-component'
import { checkImageUrl } from '../../../Helpers'
import axios from 'axios'
import MsgResponse from '../../../MsgResponse'

axios.defaults.baseURL = siteURL
axios.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest'

const { listCountry, detail } = content

class Profile extends Component {
   constructor() {
      super()

      this.state = {
         errors: {},
         avatar: ''
      }

      this._onChange = this._onChange.bind(this)
   }

   componentDidMount() {
      this.setState({
         ...detail,
         avatar: checkImageUrl(baseURL + 'img/' + detail.avatar),
         old_avatar: detail.avatar
      })
   }

   _onChange(e) {
      const { name, value, type } = e.target
      this.setState({ [name]: value })

      if (type === 'file') {
         this._checkPploadMaxFilesize(this[name].files[0], name)
      }
   }

   _handleEditorChange(e, value) {
      this.setState({ [e]: value})
   }

   _checkPploadMaxFilesize(file, name) {
      var formData = new FormData()
      formData.append(name, file)
      
      axios.
         post('checkPploadMaxFilesize?name=' + name, formData).
         then(res => {
            var response = res.data
            this.setState({ ...response })
         }).
         catch(error => {
            console.log('Error', error.message)
         })
   }

   _submit() {
      this.setState({ btnLoading: true })
      var formData = new FormData()
      formData.append('avatar', this.avatar.files[0])

      var fields = ['first_name', 'last_name', 'username', 'email', 'password', 'country', 'public_name',
         'website', 'phone', 'orcid_id', 'affiliation', 'bio_statement', 'mailing_address', 'old_avatar']
      for (var i = 0; i < fields.length; i++) {
         var fieldState = this.state[fields[i]]

         if (fieldState === undefined) {
            formData.append(fields[i], '')
         } else {
            formData.append(fields[i], fieldState)
         }
      }
      
      axios.
         post('/admin/users/profile/submit', formData).
         then(res => {
            var response = res.data
            this.setState({ ...response })

            if (response.status) {
               this.setState({
                  avatar: checkImageUrl(baseURL + 'img/' + response.avatar)
               })
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
         public_name,
         website,
         phone,
         orcid_id,
         affiliation,
         bio_statement,
         mailing_address,
         avatar
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
               <Col md={3}>
                  <div className="card">
                     <div className="card-body">
                        <Col sm={12} className="text-center">
                           <LazyLoadImage effect="blur" src={avatar} className="img-responsive" style={{ width: '100%' }} />
                        </Col>
                     </div>
                  </div>
               </Col>
               <Col md={9}>
                  <MsgResponse {...this.state} />
                  <div className="card">
                     <div className="card-body">
                        <Form.Group as={Row}>
                           <Form.Label column sm={3} className="required">First Name</Form.Label>
                           <Col sm={9}>
                              <Row>
                                 <Col sm={5} className={errors.first_name ? 'has-danger' : ''}>
                                    <Form.Control name="first_name" value={first_name} onChange={this._onChange} size="sm" />
                                    <Form.Control.Feedback type="invalid">{errors.first_name}</Form.Control.Feedback>
                                 </Col>
                                 <Form.Label column sm={2} className="required">Last Name</Form.Label>
                                 <Col sm={5} className={errors.last_name ? 'has-danger' : ''}>
                                    <Form.Control name="last_name" value={last_name} onChange={this._onChange} size="sm" />
                                    <Form.Control.Feedback type="invalid">{errors.last_name}</Form.Control.Feedback>
                                 </Col>
                              </Row>
                           </Col>
                        </Form.Group>
                        <Form.Group as={Row}>
                           <Form.Label column sm={3} className="required">Username</Form.Label>
                           <Col sm={9}>
                              <Row>
                                 <Col sm={5} className={errors.username ? 'has-danger' : ''}>
                                    <Form.Control name="username" value={username} onChange={this._onChange} size="sm" disabled={true} />
                                    <Form.Control.Feedback type="invalid">{errors.username}</Form.Control.Feedback>
                                 </Col>
                                 <Form.Label column sm={2} className="required">Email</Form.Label>
                                 <Col sm={5} className={errors.email ? 'has-danger' : ''}>
                                    <Form.Control name="email" value={email} onChange={this._onChange} size="sm" disabled={true} />
                                    <Form.Control.Feedback type="invalid">{errors.email}</Form.Control.Feedback>
                                 </Col>
                              </Row>
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
                           <Form.Label column sm={3} className="required">Country</Form.Label>
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
                        <Form.Group as={Row}>
                           <Form.Label column sm={3}>Public Name</Form.Label>
                           <Col sm={9}>
                              <Form.Control name="public_name" value={public_name} onChange={this._onChange} size="sm" />
                              <Form.Control.Feedback type="valid">How do you prefer to be addressed? Salutations, middle names and suffixes can be added here if you would like.</Form.Control.Feedback>
                           </Col>
                        </Form.Group>
                        <Form.Group as={Row}>
                           <Form.Label column sm={3}>Homepage URL</Form.Label>
                           <Col sm={9}>
                              <Form.Control name="website" value={website} onChange={this._onChange} size="sm" />
                           </Col>
                        </Form.Group>
                        <Form.Group as={Row}>
                           <Form.Label column sm={3}>Phone</Form.Label>
                           <Col sm={9}>
                              <Row>
                                 <Col sm={5}>
                                    <Form.Control name="phone" value={phone} onChange={this._onChange} size="sm" />
                                 </Col>
                                 <Form.Label column sm={2}>ORCID iD</Form.Label>
                                 <Col sm={5}>
                                    <Form.Control name="orcid_id" value={orcid_id} onChange={this._onChange} size="sm" />
                                 </Col>
                              </Row>
                           </Col>
                        </Form.Group>
                        <Form.Group as={Row}>
                           <Form.Label column sm={3}>Affiliation</Form.Label>
                           <Col sm={9}>
                              <Form.Control name="affiliation" value={affiliation} onChange={this._onChange} size="sm" />
                           </Col>
                        </Form.Group>
                        <Form.Group as={Row}>
                           <Form.Label column sm={3}>Bio Statement</Form.Label>
                           <Col sm={9}>
                              <Editor
                                 apiKey={'954fukvrtav9th5bw687mjdf4mr2zayp26tavmf30ahbobll'}
                                 initialValue={bio_statement}
                                 init={{
                                    height: 200,
                                    menubar: false,

                                    plugins: [
                                       'advlist autolink lists link image charmap print preview anchor',
                                       'searchreplace visualblocks code fullscreen',
                                       'insertdatetime media table paste code help wordcount'
                                    ],
                                    toolbar:
                                       'undo redo | formatselect | bold italic backcolor | \
                                       alignleft aligncenter alignright alignjustify | \
                                       bullist numlist outdent indent | removeformat | help'
                                 }}
                                 onEditorChange={this._handleEditorChange.bind(this, 'bio_statement')}
                              />
                           </Col>
                        </Form.Group>
                        <Form.Group as={Row}>
                           <Form.Label column sm={3}>Mailing Address</Form.Label>
                           <Col sm={9}>
                              <Editor
                                 apiKey={'954fukvrtav9th5bw687mjdf4mr2zayp26tavmf30ahbobll'}
                                 initialValue={mailing_address}
                                 init={{
                                    height: 200,
                                    menubar: false,
                                    plugins: [
                                       'advlist autolink lists link image charmap print preview anchor',
                                       'searchreplace visualblocks code fullscreen',
                                       'insertdatetime media table paste code help wordcount'
                                    ],
                                    toolbar:
                                       'undo redo | formatselect | bold italic backcolor | \
                                       alignleft aligncenter alignright alignjustify | \
                                       bullist numlist outdent indent | removeformat | help'
                                 }}
                                 onEditorChange={this._handleEditorChange.bind(this, 'mailing_address')}
                              />
                           </Col>
                        </Form.Group>
                        <Form.Group as={Row} className={errors.avatar ? 'has-danger' : ''}>
                           <Form.Label column sm={3}>Avatar</Form.Label>
                           <Col sm={9}>
                              <Form.Control name="avatar" onChange={this._onChange} ref={e => this.avatar = e} type="file" size="sm" />
                              <Form.Control.Feedback type="invalid">{errors.avatar}</Form.Control.Feedback>
                           </Col>
                        </Form.Group>
                        <Col sm={{ offset: 3, span: 9 }}>
                           <Button
                              variant="success"
                              className="waves-effect waves-light"
                              size="sm"
                              onClick={btnLoading ? null : this._submit.bind(this)}
                           >{btnLoading ? 'Loading...' : 'Update'}</Button>
                        </Col>
                     </div>
                  </div>
               </Col>
            </Row>
         </Container>
      )
   }
}

ReactDOM.render(<Profile />, document.getElementById('root'))