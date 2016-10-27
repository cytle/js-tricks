import { PropTypes } from 'widget/react';
import {
  Col,
  FormGroup,
  ControlLabel,
} from 'widget/react/bootstrap';

/**
 * 横向表单
 *  <FormGroupHorizontal controlId="formPhone" label="手机号">
 *    <FormControl type="text" placeholder="" name="phone" />
 *  </FormGroupHorizontal>
 */
const FormGroupHorizontal = ({
  labelSize = 3,
  contentSize = 9,
  label,
  children,
  controlId
}) => {
  return (
    <FormGroup controlId={controlId}>
      <Col componentClass={ControlLabel} sm={labelSize}>
        {label}
      </Col>
      <Col sm={contentSize}>
        {children}
      </Col>
    </FormGroup>
  );
};

FormGroupHorizontal.propTypes = {
  labelSize: PropTypes.number,
  contentSize: PropTypes.number,
  label: PropTypes.any,
  children: PropTypes.any,
  controlId: PropTypes.string,
};

export default FormGroupHorizontal;

