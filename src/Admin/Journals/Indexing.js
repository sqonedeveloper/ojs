import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import { Container, Row, Col, Breadcrumb, Form, Button } from 'react-bootstrap'
import axios from 'axios'
import MsgResponse from '../../MsgResponse'
import Navigation from './Navigation'

axios.defaults.baseURL = siteURL
axios.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest'

const { detail } = content

class Indexing extends Component {
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

      var fieldNames = ['description', 'custom_tags']
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
         description,
         custom_tags,
         sitemap
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
                     <Breadcrumb.Item active>Indexing</Breadcrumb.Item>
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
                              <h6>Search Engine Indexing</h6>
                              <p>Provide a brief description of the journal which search engines can display when listing the journal in search results.</p>
                              <Form.Group as={Row}>
                                 <Form.Label column sm={2}>Description</Form.Label>
                                 <Col sm={10}>
                                    <Form.Control name="description" value={description} onChange={this._onChange} size="sm" />
                                 </Col>
                              </Form.Group>
                              <Form.Group as={Row}>
                                 <Form.Label column sm={2}>Custom tags</Form.Label>
                                 <Col sm={10}>
                                    <Form.Control name="custom_tags" value={custom_tags} onChange={this._onChange} size="sm" as="textarea" rows={10} />
                                    <small>Custom HTML header tags to be inserted in the header of every page (e.g., META tags).</small>
                                 </Col>
                              </Form.Group>
                              <Form.Group as={Row}>
                                 <Form.Label column sm={2}>Sitemap</Form.Label>
                                 <Col sm={10}>
                                    <p style={{ paddingTop: 5 }}>A XML sitemap is available for submitting to search engines at <a href={sitemap} target="_blank">{sitemap}</a></p>
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

ReactDOM.render(<Indexing />, document.getElementById('root'))