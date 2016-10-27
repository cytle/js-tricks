import { PropTypes } from 'widget/react';
import {
  FormGroup as BsFormGroup,
  ControlLabel,
} from 'widget/react/bootstrap';

/**
 *  <FormGroup controlId="formInlineEmail" bsSize="small" label="订单状态：">
 *    <FormControl
 *      componentClass="select"
 *      name="type"
 *      defaultValue={type}
 *      options={selectOrderStatusOptions}
 *    />
 *  </FormGroup>
 */
const FormGroup = (props) => {
  return (
    <BsFormGroup bsSize="small" {...props}>
      {props.label ? (<ControlLabel>{props.label}</ControlLabel>) : ''}
      {' '}
      {props.children}
    </BsFormGroup>
  );
};


FormGroup.propTypes = {
  label: PropTypes.any,
  children: PropTypes.any,
  options: PropTypes.arrayOf(React.PropTypes.object),
};


export default FormGroup;
