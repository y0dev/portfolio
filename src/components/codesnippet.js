import './css/codesnippet.css'
import { Component } from 'react';
import _languages from '../assets/json/languages.json';
import copy_image from '../assets/images/copy-icon.png'


class CodeSnip extends Component {

   constructor(props) {
      super(props)
      console.log(props);
      this.title = props.title;
      this.language = props.language;

      const code = props.code;
      this.copyText = this.copyText.bind(this);
      let lines = [];

      // loop through lines
      code.forEach(element => {

         const split_code = element.split(" ");
         let span;
         let line = [];
         
         split_code.map((text,idx) => {
            // console.log(text);
            if (this.findKeyword(this.language,text))
            {
               span = <span key={idx} className='code-keyword'>{`${text} `}</span>
            }
            else if (this.findOperator(this.language,text))
            {
               span = <span key={idx} className='code-operator'>{`${text} `}</span>
            }
            else if (this.findPunctuation(this.language,text))
            {
               span = <span key={idx} className='code-punctuation'>{`${text}`}</span>
            }
            else 
            {
               span = <span key={idx} className='code-variable'>{`${text} `}</span>
            }
            line.push(span);
         });
         lines.push(
            <p className='code-line'>{line.concat()}</p>
         );
      });

      this.code = lines;

   }
   copyText (event) {
      const container = event.currentTarget.parentElement.parentElement;
      const codeBody = container.children[1];
      console.log(codeBody.innerText);
      navigator.clipboard.writeText(codeBody.innerText);
   }
   findKeyword(language,text) {
      const keywords = _languages[language].keywords;
      return keywords.includes(text);
   }

   findOperator(language,text) {
      const operators = _languages[language].operators;
      console.log(text,operators.includes(text));
      return operators.includes(text);
   }

   findPunctuation(language,text) {
      const punctuations = _languages[language].punctuations;
      return punctuations.includes(text);
   }

   render() {
      return (
         <div className='code-snippet-container'>
            <div className='code-snippet-header'>
               <h4 className='title'>{this.title}</h4>
               <button onClick={this.copyText}><img className='copy-icon' src="images/copy-icon.png"/></button>
            </div>
            <div className='code-snippet-body'>
               <pre className={`language-${this.language}`}>
                  <code className={`language-${this.language}`}>
                     {this.code}
                  </code>
               </pre>
            </div>
         </div>
      );
   }
}

export default CodeSnip;