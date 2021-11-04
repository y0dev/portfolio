import React from 'react';
import './css/contact_me.css';

class ContactMe extends React.Component {
   render() {
      return(
         <div id='contact-me'>
            <div className='contact-container'>
               <h2>Contact Me</h2>
               <form>
                  <div className='row100'>
                     <div className='col'>
                        <div className='inputBox'>
                           <input type='text' name='name' required/>
                              <span className='text'>Name</span>
                              <span className='line'></span>
                        </div>
                     </div>
                  </div>
                  <div className='row100'>
                     <div className='col'>
                        <div className='inputBox'>
                           <input type='email' name='email' required/>
                              <span className='text'>Email</span>
                              <span className='line'></span>
                        </div>
                     </div>
                     <div className='col'>
                        <div className='inputBox'>
                           <input type="tel" id="phone" name="phone"
                              pattern="[0-9]{3}-[0-9]{3}-[0-9]{4}"
                              required/>
                              <span className='text'>Phone<span className='tempVal'>: 123-456-7890</span></span>
                              <span className='line'></span>
                        </div>
                     </div>
                  </div>
                  <div className='row100'>
                     <div className='col'>
                        <div className={'inputBox textarea'}>
                           <textarea type='text' name='phone' required/>
                              <span className='text'>Type your message here...</span>
                              <span className='line'></span>
                        </div>
                     </div>
                  </div>
                  <div className='row100'>
                     <div className='col'>
                        <input type='submit' value='Send'/>
                     </div>
                  </div>
               </form>
            </div>
         </div>
      )
   }
}

export default ContactMe;