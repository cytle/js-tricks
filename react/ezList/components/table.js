import { PropTypes } from 'widget/react';
import { Table } from 'widget/react/bootstrap';

const headTr = items => <tr>{items.map(item => <th>{item}</th>)}</tr>;
const bodyTr = items => <tr>{items.map(item => <td>{item}</td>)}</tr>;
const emptyTr = (l, content = '--无--') => <tr><td colSpan={l}>{content}</td></tr>;

const STable = (props) => {
  const {
    children,
    theadData,
    tbodyData,
    tbodyDataItemCallBack,
  } = props;

  let tbody;

  if (tbodyData) {
    if (tbodyData.length === 0) {
      tbody = emptyTr(theadData.length);
    } else {
      if (tbodyDataItemCallBack) {
        // 数据回调给 tbodyDataItemCallBack
        tbody = tbodyData.map(tbodyDataItemCallBack).map(bodyTr);
      } else {
        tbody = tbodyData.map(bodyTr);
      }
    }
  } else {
    if (tbodyData === null) {
      tbody = emptyTr(theadData.length);
    } else {
      tbody = emptyTr(theadData.length, '正在加载');
    }
  }

  return (
    <Table
      striped
      bordered
      condensed
      hover
      className="ez-list-table"
      {...props}
    >
      <thead>
        {headTr(theadData)}
      </thead>
      <tbody>
        {tbody}
      </tbody>
      {children}
    </Table>
    );
};

STable.propTypes = {
  children: PropTypes.any,
  theadData: PropTypes.array,
  tbodyData: PropTypes.array,
  tbodyDataItemCallBack: PropTypes.func,
};


export default STable;
