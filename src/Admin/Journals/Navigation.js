import React, { Component } from 'react'

export default class Navigation extends Component {
   render() {
      const { segment, id } = this.props

      return (
         <ul className="nav nav-tabs">
            <li className="nav-item">
               <a href={siteURL + '/admin/journals/wizard/'+id+'/masthead'} className={"nav-link" + (segment[5] === 'masthead' ? ' active' : '')}>
                  <span className="hidden-xs-down">Masthead</span>
               </a>
            </li>
            <li className="nav-item">
               <a href={siteURL + '/admin/journals/wizard/'+id+'/contact'} className={"nav-link" + (segment[5] === 'contact' ? ' active' : '')}>
                  <span className="hidden-xs-down">Contact</span>
               </a>
            </li>
            <li className="nav-item">
               <a href={siteURL + '/admin/journals/wizard/'+id+'/apperance'} className={"nav-link" + (segment[5] === 'apperance' ? ' active' : '')}>
                  <span className="hidden-xs-down">Appearance</span>
               </a>
            </li>
            <li className="nav-item">
               <a href={siteURL + '/admin/journals/wizard/'+id+'/submission'} className={"nav-link" + (segment[5] === 'submission' ? ' active' : '')}>
                  <span className="hidden-xs-down">Submission</span>
               </a>
            </li>
            <li className="nav-item">
               <a href={siteURL + '/admin/journals/wizard/'+id+'/indexing'} className={"nav-link" + (segment[5] === 'indexing' ? ' active' : '')}>
                  <span className="hidden-xs-down">Indexing</span>
               </a>
            </li>
            <li className="nav-item">
               <a href={siteURL + '/admin/journals/wizard/'+id+'/users'} className={"nav-link" + (segment[5] === 'users' ? ' active' : '')}>
                  <span className="hidden-xs-down">Users</span>
               </a>
            </li>
         </ul>
      )
   }
}
