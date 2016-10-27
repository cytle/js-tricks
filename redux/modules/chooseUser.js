import React, { Component, PropTypes } from 'widget/react';
import {
  Table,
} from 'widget/ezList/components';

import {
  formatTime,
  connectEntity,
} from '../libs/functions';
import { userDrink } from '../drinks';

import {
  ROLE_USER,
} from '../consts';

const getCreateHref = (history) => ({
  uid, role = ROLE_USER, urlMore = ''
}) => {
  const href = `/custom/query/users/${uid}/${role}${urlMore}`;
  return history.createHref(href);
};

class ChooseUser extends Component {
  componentDidMount() {
    this.fetchUsers(this.props.usersList);
  }

  fetchUsers(usersList) {
    if (! usersList) {
      return false;
    }

    const uids = usersList.map(user => user.uid);

    return this.props.dispatch(userDrink.queryByUidsIfNeed(uids));
  }
  render() {
    const {
      getUser,
    } = this.props;

    const createHref = getCreateHref(this.context.history);
    return (
      <div>
        <Table
          striped bordered condensed hover
          theadData={[
            '序号',
            'uid',
            '用户名',
            '手机',
            '邮箱',
            '昵称',
            '最后登录时间',
            '来源',
            '操作'
          ]}
          tbodyData={this.props.usersList}
          tbodyDataItemCallBack={
            (item, index) => {
              const user = getUser(item.uid) || {};
              return [
                index + 1,
                item.uid,
                user.uname,
                user.phone,
                user.email,
                user.nickname,
                formatTime(user.lastLogin * 1000),
                item.source,
                <a href={createHref(item)}>选择</a>
              ];
            }
          }
        />
        <ul className="text-muted">
          <li>以上信息都来自用户(user表)</li>
        </ul>
      </div>);
  }
}

ChooseUser.propTypes = {
  usersList: PropTypes.object,

  dispatch: PropTypes.func,
  getUser: PropTypes.func,

};


ChooseUser.contextTypes = {
  history: React.PropTypes.object.isRequired,
};

export default connectEntity(ChooseUser, ['getUser']);
