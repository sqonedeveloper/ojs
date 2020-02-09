import React, { Component } from 'react'
import ReactDOM from 'react-dom'

const { navigation } = content

class Sidebar extends Component {
   render() {
      return (
         <div className="scroll-sidebar">
            <nav className="sidebar-nav">
               <ul id="sidebarnav">
                  {navigation.map((data, key) => {
                     return (
                        <li key={key} className={data.active.indexOf(segment[2]) !== -1 ? 'active' : ''}>
                           <a href={siteURL + data.url} className={'waves-effect waves-dark' + (data.sub ? ' has-arrow' : '')}>
                              <i className={data.icon} />
                              <span className="hide-menu">{data.label}</span>
                           </a>
                           {data.sub ? <ul className="collapse">{data.child.map((a, b) => {
                              return (
                                 <li key={b} className={data.active.indexOf(segment[2]) !== -1 && a.active.indexOf(segment[3]) !== -1 ? 'active' : ''}>
                                    <a href={siteURL + a.url} className={(data.active.indexOf(segment[2]) !== -1 && a.active.indexOf(segment[3]) !== -1 ? 'active' : '') + (a.sub ? ' has-arrow' : '')}>{a.label}</a>
                                    {a.sub ? <ul className="collapse">{a.child.map((c, d) => {
                                       return (
                                          <li key={d} className={data.active.indexOf(segment[2]) !== -1 && a.active.indexOf(segment[3]) !== -1 ? 'active' : ''}>
                                             <a href={siteURL + c.url} className={data.active.indexOf(segment[2]) !== -1 && a.active.indexOf(segment[3]) !== -1 && c.active.indexOf(segment[4]) !== -1 ? 'active' : ''}>{c.label}</a>
                                          </li>
                                       )
                                    })}</ul> : ''}
                                 </li>
                              )
                           })}</ul> : ''}
                        </li>
                     )
                  })}
               </ul>
            </nav>
         </div>
      )
   }
}

ReactDOM.render(<Sidebar />, document.getElementById('sidebar'))