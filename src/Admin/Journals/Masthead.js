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

class Masthead extends Component {
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

      var fieldNames = ['journal_name', 'summary', 'initial', 'publisher', 'online_issn', 'print_issn', 'editorial_team', 'about_journal']
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
               open(siteURL + '/admin/journals/wizard/'+segment[4]+'/contact', '_parent')
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
         journal_name,
         summary,
         initial,
         publisher,
         online_issn,
         print_issn,
         editorial_team,
         about_journal
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
                     <Breadcrumb.Item active>Masthead</Breadcrumb.Item>
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
                                 <Form.Label column sm={2} className="required">Journal Name</Form.Label>
                                 <Col sm={10}>
                                    <Row>
                                       <Col sm={6} className={errors.journal_name ? 'has-danger' : ''}>
                                          <Form.Control name="journal_name" value={journal_name} onChange={this._onChange} size="sm" />
                                          <Form.Control.Feedback type="invalid">{errors.journal_name}</Form.Control.Feedback>
                                       </Col>
                                       <Form.Label column sm={2} className="required">Journal Initial</Form.Label>
                                       <Col sm={4} className={errors.initial ? 'has-danger' : ''}>
                                          <Form.Control name="initial" value={initial} onChange={this._onChange} size="sm" disabled={true} />
                                          <Form.Control.Feedback type="invalid">{errors.initial}</Form.Control.Feedback>
                                       </Col>
                                    </Row>
                                 </Col>
                              </Form.Group>
                              <Form.Group as={Row}>
                                 <Form.Label column sm={2}>Publisher</Form.Label>
                                 <Col sm={10}>
                                    <Form.Control name="publisher" value={publisher} onChange={this._onChange} size="sm" />
                                 </Col>
                              </Form.Group>
                              <Form.Group as={Row}>
                                 <Form.Label column sm={2}>ISSN</Form.Label>
                                 <Col sm={10}>
                                    <Row>
                                       <Col sm={4}>
                                          <Form.Control name="online_issn" value={online_issn} onChange={this._onChange} size="sm" placeholder="Online" />
                                       </Col>
                                       <Col sm={4}>
                                          <Form.Control name="print_issn" value={print_issn} onChange={this._onChange} size="sm" placeholder="Print" />
                                       </Col>
                                    </Row>
                                 </Col>
                              </Form.Group>
                              <Form.Group as={Row}>
                                 <Form.Label column sm={2}>Journal Summary</Form.Label>
                                 <Col sm={10}>
                                    <Editor
                                       apiKey={'954fukvrtav9th5bw687mjdf4mr2zayp26tavmf30ahbobll'}
                                       initialValue={summary}
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
                                       onEditorChange={this._handleEditorChange.bind(this, 'summary')}
                                    />
                                 </Col>
                              </Form.Group>
                              <Form.Group as={Row}>
                                 <Form.Label column sm={2}>Editorial Team</Form.Label>
                                 <Col sm={10}>
                                    <Editor
                                       apiKey={'954fukvrtav9th5bw687mjdf4mr2zayp26tavmf30ahbobll'}
                                       initialValue={editorial_team}
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
                                       onEditorChange={this._handleEditorChange.bind(this, 'editorial_team')}
                                    />
                                 </Col>
                              </Form.Group>
                              <Form.Group as={Row}>
                                 <Form.Label column sm={2}>About the Journal</Form.Label>
                                 <Col sm={10}>
                                    <Editor
                                       apiKey={'954fukvrtav9th5bw687mjdf4mr2zayp26tavmf30ahbobll'}
                                       initialValue={about_journal}
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
                                       onEditorChange={this._handleEditorChange.bind(this, 'about_journal')}
                                    />
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

ReactDOM.render(<Masthead />, document.getElementById('root'))