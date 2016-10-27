import { PropTypes } from 'widget/react';
import {
  Col,
  Row,
} from 'widget/react/bootstrap';

/**
 * 横向表单
 *  <FormGroupHorizontal controlId="formPhone" label="手机号">
 *    <FormControl type="text" placeholder="" name="phone" />
 *  </FormGroupHorizontal>
 *
 */
const ItemHorizontal = ({
  labelSize = 3,
  contentSize = 9,
  wrap,
  label,
  children
}) => {
  if (labelSize) {
    contentSize = 12 - labelSize;
  } else if (contentSize) {
    labelSize = 12 - labelSize;
  }

  let content = children;

  if (! wrap) {
    content = (
      <div className="nowrap" title={children}>
        {children}
      </div>
      );
  }

  return (
    <Row className="ez-list-item-horizontal" >
      <Col sm={labelSize || 3} className="item-label">
        <span>{label + ' '}</span>
      </Col>
      <Col sm={contentSize || 9} className="item-content">
        {content}
      </Col>
    </Row>
  );
};

ItemHorizontal.propTypes = {
  labelSize: PropTypes.number,
  contentSize: PropTypes.number,
  label: PropTypes.any,
  // 是否折行
  wrap: PropTypes.boolean,
  children: PropTypes.any,
};

export default ItemHorizontal;
