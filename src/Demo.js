import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import './Demo.css'
// class Demo extends Component
// {
//     render()
//        {
//            return  <div className="maindiv_style" > 
//                         <h1> Hello {this.props.name} </h1>
//                         <p> Welcome to my project :) </p>
//                   </div>
//        }
// }

const Demo = (props) => {
    return <div className="maindiv_style"> 
                 <h1> Aman Bhardwaj</h1>
                  <p> Web Developer</p>
           </div>
}
export default Demo; 