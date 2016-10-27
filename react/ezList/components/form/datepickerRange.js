import { Component } from 'widget/react';

// 时间转换为 yyyy-mm-dd
const getLocalISODate = date => {
  if (date instanceof Date) {
    const m = date.getMinutes() - date.getTimezoneOffset();
    date = new Date(date);

    date.setMinutes(m);
    return date.toISOString().split('T')[0];
  }

  return null;
};


class Range extends Component {
  constructor(...args) {
    super(...args);
    this.state = {
      dateStart: '',
      dateEnd: ''
    };

    this.handleChange = this.handleChange.bind(this);
  }

  componentWillMount() {
    const defaultRange = this.props.defaultValue || {};
    const range = this.props.value || {};
    const values = Object.assign({}, this.state, defaultRange, range);
    this.setDateState(values);
  }

  // 绑定datepicker
  componentDidMount() {
    const ref = $(this.refs.range).datepicker({
      language: 'zh-CN',
      format: 'yyyy-mm-dd',
      autoclose: true,
      clearBtn: true,

    });

    ref.on('changeDate', this.handleChange)
       .on('changeMonth', this.handleChange)
       .on('changeYear', this.handleChange);
  }

  componentWillReceiveProps(nextProps) {
    const defaultRange = nextProps.defaultValue || {};
    const range = nextProps.value || {};
    const values = Object.assign({}, this.state, defaultRange, range);

    this.setDateState(values);
  }

  setDateState(values) {
    const {
      dateStart,
      dateEnd
    } = values;

    values.dateStart = dateStart && getLocalISODate(new Date(dateStart));
    values.dateEnd = dateEnd && getLocalISODate(new Date(dateEnd));

    return this.setState(values);
  }

  handleChange() {
    const values = {
      dateStart: this.refs.daterangeStart.value,
      dateEnd: this.refs.daterangeEnd.value
    };
    this.setDateState(values);

    if (this.props.onChange) {
      this.props.onChange(values);
    }
  }

  render() {
    let {
      dateStart,
      dateEnd
    } = this.state;

    let dateStartValue = dateStart;
    let dateEndValue = dateEnd;

    if (! this.props.withoutTime) {
      dateStartValue = dateStart && (dateStart + ' 00:00:00');
      dateEndValue = dateEnd && (dateEnd + ' 23:59:59');
    }

    return (
      <div
        className={'ez-list-datepicker-range ' + (('inline' in this.props) ? 'inline' : '')}
      >
        <div ref="range" className="input-daterange input-group">
          <input
            value={dateStart}
            type="text"
            ref="daterangeStart"
            className="input-sm form-control"
          />
          <span className="input-group-addon">至</span>
          <input
            value={dateEnd}
            type="text"
            ref="daterangeEnd"
            className="input-sm form-control"
          />
        </div>
        <input
          type="hidden"
          ref="daterangeRealStart"
          name={this.props.startName || 'start'}
          value={dateStartValue}
        />
        <input
          type="hidden"
          ref="daterangeRealEnd"
          name={this.props.endName || 'end'}
          value={dateEndValue}
        />
      </div>
    );
  }
}

Range.propTypes = {
  startName: React.PropTypes.string,
  endName: React.PropTypes.string,
  defaultValue: React.PropTypes.object,
  value: React.PropTypes.object,
  onChange: React.PropTypes.fun,
  withoutTime: React.PropTypes.boolean,

};

export default Range;
