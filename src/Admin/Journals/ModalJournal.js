import React, { Component } from 'react'
import { Modal, Button, Form, Col, Row } from 'react-bootstrap'
import { Editor } from '@tinymce/tinymce-react'

export default class ModalJournal extends Component {
   constructor() {
      super()
   
      this._onChange = this._onChange.bind(this)
   }
   
   _onChange(e) {
      const { name, value } = e.target
      this.props._updateState({
         name: name,
         value: value
      })
   }

   _handleSubmitJournal() {
      this.props._updateState({
         name: 'createJournal'
      })
   }

   _handleEditorChange(e, value) {
      this.props._updateState({
         name: e,
         value: value
      })
   }

   render() {
      const {
         errors,
         btnLoading,
         name,
         summary,
         initial,
         openModal
      } = this.props

      return (
         <Modal show={openModal} onHide={() => this.props._updateState({ name: 'openModal', value: false })} size="xl">
            <Modal.Header closeButton>
               <Modal.Title>Create Journal</Modal.Title>
            </Modal.Header>
            <Modal.Body>
               <p>After creating a new journal, you will be redirected to its settings wizard, to complete the initial journal setup.</p>
               <Form.Group as={Row} className={errors.name ? 'has-danger' : ''}>
                  <Form.Label column sm={2} className="required">Journal title</Form.Label>
                  <Col sm={10}>
                     <Form.Control name="name" value={name} onChange={this._onChange} size="sm" />
                     <Form.Control.Feedback type="invalid">{errors.name}</Form.Control.Feedback>
                  </Col>
               </Form.Group>
               <Form.Group as={Row}>
                  <Form.Label column sm={2}>Journal summary</Form.Label>
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
               <Form.Group as={Row} className={errors.initial ? 'has-danger' : ''}>
                  <Form.Label column sm={2} className="required">Journal path</Form.Label>
                  <Col sm={10}>
                     <Form.Control name="initial" value={initial} onChange={this._onChange} size="sm" />
                     <Form.Control.Feedback type="invalid">{errors.initial}</Form.Control.Feedback>
                  </Col>
               </Form.Group>
            </Modal.Body>
            <Modal.Footer>
               <Button
                  variant="success"
                  size="sm"
                  className="waves-effect waves-light"
                  onClick={btnLoading ? null : this._handleSubmitJournal.bind(this)}
               >{btnLoading ? 'Loading...' : 'Save'}</Button>
            </Modal.Footer>
         </Modal>
      )
   }
}
