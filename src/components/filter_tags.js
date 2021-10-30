import React from 'react';
import './css/filter_tag.css';
class FilterTag extends React.Component {
   
   componentDidUpdate() {
      console.log(this.props)
      console.log('updated')
   }
   render() {
      return (
         <div className={`filter_tag ${this.props.state ? 'type-meta-active' : 'type-meta'}`}>
            {this.props.type}
         </div>
      )
   }
}

export default FilterTag;