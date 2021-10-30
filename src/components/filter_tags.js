import './css/filter_tag.css';

function FilterTag(props) {
   return (
      <div className={`filter_tag ${props.state ? 'type-meta-active' : 'type-meta'}`}>
         {props.type}
      </div>
   )
}

export default FilterTag;