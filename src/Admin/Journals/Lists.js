import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import { Container, Row, Col, Breadcrumb, Button } from 'react-bootstrap'
import ModalJournal from './ModalJournal'
import axios from 'axios'

axios.defaults.baseURL = siteURL
axios.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest'

class Lists extends Component {
   constructor() {
      super()
   
      this.state = {
         errors: {},
         openModal: false
      }
   
      this._onChange = this._onChange.bind(this)
   }
   
   _onChange(e) {
      this.setState({ [e.target.name]: e.target.value })
   }

   _updateState(e) {
      this.setState({ [e.name]: e.value })

      if (e.name === 'createJournal') {
         this._submitCreateJournal()
      }
   }

   _submitCreateJournal() {
      this.setState({ btnLoading: true })
      var formData = new FormData()
      formData.append('pageType', 'createJournal')

      let fields = ['name', 'summary', 'initial']
      for (var i = 0; i < fields.length; i++) {
         if (typeof this.state[fields[i]] === 'undefined') {
            formData.append(fields[i], '')
         } else {
            formData.append(fields[i], this.state[fields[i]])
         }
      }
      
      axios.
         post('/admin/journals/submit', formData).
         then(res => {
            var response = res.data
            this.setState({ ...response })
         }).
         catch(error => {
            console.log('Error', error.message)
         }).
         finally(() => {
            this.setState({ btnLoading: false })
         })
   }

   render() {
      return (
         <Container fluid={true}>
            <Row className="page-titles">
               <Col md={9} className="align-self-center">
                  <h3 className="text-themecolor m-b-5 m-t-0">{document.getElementsByTagName('title')[0].innerText}</h3>
                  <Breadcrumb>
                     <Breadcrumb.Item active>Home</Breadcrumb.Item>
                     <Breadcrumb.Item active>{document.getElementsByTagName('title')[0].innerText}</Breadcrumb.Item>
                  </Breadcrumb>
               </Col>
               <Col md={3} className="align-self-center">
                  <Button
                     variant="success"
                     className="float-right waves-effect waves-light"
                     size="sm"
                     onClick={() => this.setState({ openModal: true })}
                  >Create Journal</Button>
                  <ModalJournal {...this.state} _updateState={e => this._updateState(e)} _submitCreateJournal={this._submitCreateJournal.bind(this)} />
               </Col>
            </Row>
            <Row>
               <Col md={12}>
                  <div className="card">
                     <div className="card-body">
                        This is some text within a card block.
                     </div>
                  </div>
               </Col>
            </Row>
         </Container>
      )
   }
}

ReactDOM.render(<Lists />, document.getElementById('root'))