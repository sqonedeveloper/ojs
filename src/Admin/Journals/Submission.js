import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import { Container, Row, Col, Breadcrumb, Form, Button } from 'react-bootstrap'
import { Editor } from '@tinymce/tinymce-react'
import axios from 'axios'
import MsgResponse from '../../MsgResponse'
import Navigation from './Navigation'

axios.defaults.baseURL = siteURL
axios.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest'

const { detail } = content

class Submission extends Component {
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

      var fieldNames = ['author_guidelines', 'privacy_statement']
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
               open(siteURL + '/admin/journals/wizard/'+segment[4]+'/indexing', '_parent')
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
         author_guidelines,
         privacy_statement
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
                     <Breadcrumb.Item active>Submission</Breadcrumb.Item>
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
                              <Form.Group as={Row}>
                                 <Form.Label column sm={2}>Author Guidelines</Form.Label>
                                 <Col sm={10}>
                                    <Editor
                                       apiKey={'954fukvrtav9th5bw687mjdf4mr2zayp26tavmf30ahbobll'}
                                       initialValue={author_guidelines}
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
                                       onEditorChange={this._handleEditorChange.bind(this, 'author_guidelines')}
                                    />
                                    <small>Recommended guidelines include bibliographic and formatting standards alongside examples of common citation formats to be used in submissions.</small>
                                 </Col>
                              </Form.Group>
                              <Form.Group as={Row}>
                                 <Form.Label column sm={2}>Privacy Statement</Form.Label>
                                 <Col sm={10}>
                                    <Editor
                                       apiKey={'954fukvrtav9th5bw687mjdf4mr2zayp26tavmf30ahbobll'}
                                       initialValue={privacy_statement}
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
                                       onEditorChange={this._handleEditorChange.bind(this, 'privacy_statement')}
                                    />
                                    <small>This statement will appear during user registration, author submission, and on the publicly available Privacy page. In some jurisdictions, you are legally required to disclose how you handle user data in this privacy policy.</small>
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

ReactDOM.render(<Submission />, document.getElementById('root'))