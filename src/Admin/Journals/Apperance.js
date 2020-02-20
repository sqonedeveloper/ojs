import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import { Container, Row, Col, Breadcrumb, Form, Button } from 'react-bootstrap'
import axios from 'axios'
import MsgResponse from '../../MsgResponse'
import Navigation from './Navigation'
import { Editor } from '@tinymce/tinymce-react'
import { LazyLoadImage } from 'react-lazy-load-image-component'

axios.defaults.baseURL = siteURL
axios.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest'

const { detail } = content

class Apperance extends Component {
   constructor() {
      super()

      this.state = {
         errors: {},
         file_antri: [],
         old_file: {},
         progress: {}
      }

      this._onChange = this._onChange.bind(this)
   }

   componentDidMount() {
      this.setState({
         ...detail,
         logo: this._getImageFile(baseURL + detail.initial + '/' + detail.logo),
         favicon: this._getImageFile(baseURL + detail.initial + '/' + detail.favicon),
         thumbnail: this._getImageFile(baseURL + detail.initial + '/' + detail.thumbnail)
      })
   }

   _onChange(e) {
      const { name, value, type } = e.target

      if (type === 'file') {
         this._checkPploadMaxFilesize(this[name].files[0], name)
      } else {
         this.setState({ [name]: value })
      }
   }

   _getImageFile(url) {
      var http = new XMLHttpRequest()
      http.open('GET', url, false)
      http.send()

      if (http.status === 200 && http.responseText !== 'no direct script access allowed') {
         return url
      } else {
         return false
      }
   }

   _checkPploadMaxFilesize(file, name) {
      var formData = new FormData()
      formData.append(name, file)

      axios.
         post('checkPploadMaxFilesize?name=' + name, formData).
         then(res => {
            var response = res.data
            this.setState({ ...response })

            if (response.status) {
               const { file_antri } = this.state
               if (file_antri.indexOf(name) === -1) {
                  this.setState({ file_antri: file_antri.concat(name) })
               }
            }
         }).
         catch(error => {
            console.log('Error', error.message)
         })
   }

   _handleEditorChange(e, value) {
      this.setState({ [e]: value })
   }

   _submit() {
      this.setState({ btnLoading: true })
      var formData = new FormData()
      formData.append('pageType', segment[5])
      formData.append('id', segment[4])

      var fieldNames = ['page_footer', 'additional_content']
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
               const { file_antri } = this.state
               if (file_antri.length > 0) {
                  this._uploadFile(0)
               } else {
                  open(siteURL + '/admin/journals/wizard/' + segment[4] + '/submission', '_parent')
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

   _uploadFile(key) {
      const { file_antri, old_file } = this.state

      var formData = new FormData()
      formData.append('file', this[file_antri[key]].files[0])
      formData.append('upload_path', 'public/' + detail.initial)
      formData.append('key', key)
      formData.append('name', file_antri[key])
      formData.append('old_file', old_file[file_antri[key]])

      axios.
         post('/uploadFileImage', formData, {
            onUploadProgress: (progress) => {
               var percent = Math.round((progress.loaded * 100) / progress.total)
               this.setState({ progress: {
                  [file_antri[key]]: percent
               } })
            }
         }).
         then(res => {
            var response = res.data

            if (!response.status) {
               var file_error = response.errors[file_antri[key]].file
               this.setState({ errors: { [file_antri[key]]: file_error } })
            } else {
               this._updateTable(file_antri[key], response.file_name)

               this.setState({
                  old_file: {
                     logo: file_antri[key] === 'logo' ? response.file_name : old_file.logo,
                     favicon: file_antri[key] === 'favicon' ? response.file_name : old_file.favicon,
                     thumbnail: file_antri[key] === 'thumbnail' ? response.file_name : old_file.thumbnail
                  },
                  [file_antri[key]]: this._getImageFile(baseURL + detail.initial + '/' + response.file_name)
               })
            }

            if (file_antri[response.key] === undefined) {
               open(siteURL + '/admin/journals/wizard/' + segment[4] + '/submission', '_parent')
            } else {
               this._uploadFile(response.key)
            }
         }).
         catch(error => {
            console.log('Error', error.message)
         }).
         finally(() => {
            this.setState({ progress: {
               [file_antri[key]]: 0
            } })
         })
   }

   _updateTable(field, value) {
      var formData = new FormData()
      formData.append('pageType', 'updateTable')
      formData.append('id_journal', segment[4])
      formData.append('field', field)
      formData.append('value', value)
      formData.append('table', 'journal_apperance')

      axios.
         post('/admin/journals/updateTable', formData).
         then(res => {
            var response = res.data
            this.setState({ ...response })
         }).
         catch(error => {
            console.log('Error', error.message)
         })
   }

   render() {
      const {
         btnLoading,
         errors,
         page_footer,
         additional_content,
         logo,
         favicon,
         thumbnail,
         progress
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
                     <Breadcrumb.Item active>Appearance</Breadcrumb.Item>
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
                                 <Form.Label column sm={2}>Logo</Form.Label>
                                 <Col sm={10} className={errors.logo ? 'has-danger' : ''}>
                                    {progress.logo > 0 ? <div style={{ paddingTop: 5 }}>
                                       <div className="progress">
                                          <div className="progress-bar bg-info progress-bar-striped active" role="progressbar" aria-valuenow="85" aria-valuemin="0" aria-valuemax="100" style={{ width: progress.logo + '%', height: 20 }}><span style={{ fontWeight: 500 }}>{progress.logo}% Complete</span></div>
                                       </div>
                                    </div> : <Form.Control name="logo" ref={e => this.logo = e} onChange={this._onChange} size="sm" type="file" />}
                                    <Form.Control.Feedback type="invalid">{errors.logo}</Form.Control.Feedback>
                                    {logo ? <div className="pkp_form_file_view pkp_form_image_view">
                                       <div className="img">
                                          <LazyLoadImage src={logo} effect="blur" />
                                       </div>
                                    </div> : ''}
                                 </Col>
                              </Form.Group>
                              <Form.Group as={Row}>
                                 <Form.Label column sm={2}>Favicon</Form.Label>
                                 <Col sm={10} className={errors.favicon ? 'has-danger' : ''}>
                                    {progress.favicon > 0 ? <div style={{ paddingTop: 5 }}>
                                       <div className="progress">
                                          <div className="progress-bar bg-info progress-bar-striped active" role="progressbar" aria-valuenow="85" aria-valuemin="0" aria-valuemax="100" style={{ width: progress.favicon + '%', height: 20 }}><span style={{ fontWeight: 500 }}>{progress.favicon}% Complete</span></div>
                                       </div>
                                    </div> : <Form.Control name="favicon" ref={e => this.favicon = e} onChange={this._onChange} size="sm" type="file" />}
                                    <Form.Control.Feedback type="invalid">{errors.favicon}</Form.Control.Feedback>
                                    {favicon ? <div className="pkp_form_file_view pkp_form_image_view">
                                       <div className="img">
                                          <LazyLoadImage src={favicon} effect="blur" />
                                       </div>
                                    </div> : ''}
                                 </Col>
                              </Form.Group>
                              <Form.Group as={Row}>
                                 <Form.Label column sm={2}>Thumbnail</Form.Label>
                                 <Col sm={10} className={errors.thumbnail ? 'has-danger' : ''}>
                                    {progress.thumbnail > 0 ? <div style={{ paddingTop: 5 }}>
                                       <div className="progress">
                                          <div className="progress-bar bg-info progress-bar-striped active" role="progressbar" aria-valuenow="85" aria-valuemin="0" aria-valuemax="100" style={{ width: progress.thumbnail + '%', height: 20 }}><span style={{ fontWeight: 500 }}>{progress.thumbnail}% Complete</span></div>
                                       </div>
                                    </div> : <Form.Control name="thumbnail" ref={e => this.thumbnail = e} onChange={this._onChange} size="sm" type="file" />}
                                    <Form.Control.Feedback type="invalid">{errors.thumbnail}</Form.Control.Feedback>
                                    {thumbnail ? <div className="pkp_form_file_view pkp_form_image_view">
                                       <div className="img">
                                          <LazyLoadImage src={thumbnail} effect="blur" />
                                       </div>
                                    </div> : ''}
                                 </Col>
                              </Form.Group>
                              <Form.Group as={Row}>
                                 <Form.Label column sm={2}>Page Footer</Form.Label>
                                 <Col sm={10}>
                                    <Editor
                                       apiKey={'954fukvrtav9th5bw687mjdf4mr2zayp26tavmf30ahbobll'}
                                       initialValue={page_footer}
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
                                       onEditorChange={this._handleEditorChange.bind(this, 'page_footer')}
                                    />
                                 </Col>
                              </Form.Group>
                              <Form.Group as={Row}>
                                 <Form.Label column sm={2}>Additional Content</Form.Label>
                                 <Col sm={10}>
                                    <Editor
                                       apiKey={'954fukvrtav9th5bw687mjdf4mr2zayp26tavmf30ahbobll'}
                                       initialValue={additional_content}
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
                                       onEditorChange={this._handleEditorChange.bind(this, 'additional_content')}
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

ReactDOM.render(<Apperance />, document.getElementById('root'))