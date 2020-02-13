import React, { Component } from 'react'
import { Modal, Button, Form, Col, Row } from 'react-bootstrap'

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
                     <Form.Control name="summary" value={summary} onChange={this._onChange} size="sm" />
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
