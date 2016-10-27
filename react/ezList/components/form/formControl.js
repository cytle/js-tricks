import { PropTypes } from 'widget/react';
import {
  FormControl as BsFormControl,
} from 'widget/react/bootstrap';

/**
 *  <FormGroup name="slele" options={[
 *    value: '',
 *    children: 'asdasd'
 *  ]}/>
 */
const FormControl = (props) => {
  let children = props.children;
  if (props.componentClass === 'select') {
    if (props.options) {
      children = props.options.map(item => <option {...item} />);
    }
  }
  return (
    <BsFormControl {...props}>
      {children}
    </BsFormControl>
  );
};

FormControl.propTypes = {
  options: PropTypes.arrayOf(React.PropTypes.object),
  componentClass: PropTypes.any,
  children: PropTypes.any,
};

export default FormControl;
