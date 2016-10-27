import { Component, PropTypes } from 'widget/react';
import {
  Checkbox,
} from 'widget/react/bootstrap';

const isDefaultChecked = (defaultCheckedValues, component) => {
  if (typeof component.props.defaultChecked !== 'undefined') {
    return component.props.defaultChecked;
  }

  if (! defaultCheckedValues) {
    return false;
  }
  const value = component.props.value + '';
  return !(! value || defaultCheckedValues.indexOf(value) === -1);
};

class multiLevelCheckboxs extends Component {
  constructor() {
    super();

    this.handleClick = this.handleClick.bind(this);
  }
  handleClick(e) {
    const childCheckboxs = this.refs.childCheckboxs;
    const myCheckbox = e.target;

    const checked = myCheckbox.checked;
    const checkboxs = childCheckboxs.querySelectorAll('input[type=checkbox]');

    [].every.call(checkboxs, el => (el.checked = checked) || true);

    if (checked) {
      this.refs.myDl.classList.add('open');
    } else if (! ('open' in this.props)) {
      this.refs.myDl.classList.remove('open');
    }
  }
  render() {
    const {
      defaultCheckedValues,
      text,
      name,
      defaultChecked,
    } = this.props;

    const childrenWithProps = React.Children.map(
      this.props.children,
      (child) =>
        React.cloneElement(child, {
          name,
          defaultCheckedValues,
          defaultChecked: isDefaultChecked(defaultCheckedValues, child)
        })
    );

    return (
      <dl
        className={
          'mulit-level-checkboxs '
          + (('open' in this.props || defaultChecked) ? 'open' : '')
        }
        ref="myDl"
      >
        <dt className={text ? '' : 'hidden'}>
          <Checkbox {...this.props} ref="myCheckbox" onClick={this.handleClick}>
            <b>{text}</b>
          </Checkbox>
        </dt>
        <dd ref="childCheckboxs">
          {childrenWithProps}
        </dd>
      </dl>
    );
  }

}

multiLevelCheckboxs.propTypes = {
  defaultCheckedValues: PropTypes.array,
  defaultChecked: PropTypes.boolean,
  name: PropTypes.string,
  open: PropTypes.any,
  value: PropTypes.string,
  text: PropTypes.string,
  children: PropTypes.any,
};


export default multiLevelCheckboxs;
