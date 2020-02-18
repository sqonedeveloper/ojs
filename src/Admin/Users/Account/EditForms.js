import React, { Component } from 'react'
import { Form, Row, Col } from 'react-bootstrap'
import { Editor } from '@tinymce/tinymce-react'

export default class EditForms extends Component {
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

   _handleEditorChange(e, value) {
      this.props._updateState({
         name: e,
         value: value
      })
   }

   render() {
      const {
         public_name,
         website,
         phone,
         orcid_id,
         affiliation,
         bio_statement,
         mailing_address,
      } = this.props

      return (
         <>
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
            <Form.Group as={Row}>
               <Form.Label column sm={3}>Signature</Form.Label>
               <Col sm={9}>
                  <Form.Control size="sm" />
               </Col>
            </Form.Group>
         </>
      )
   }
}