import React, { Component } from 'react'

export default class MsgResponse extends Component {
   render() {
      const { status, msg_response } = this.props

      return (
         <>
            {msg_response ? <div className={'alert ' + (status ? 'alert-success' : 'alert-danger')}>{msg_response}</div> : ''}
         </>
      )
   }
}