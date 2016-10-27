import { Component, PropTypes } from 'widget/react';
import wAlert from 'widget/alert';

import {
  Row,
  Col,
  Button,
} from 'widget/react/bootstrap';

import {
  userDrink
} from '../../drinks';

import { connectEntity } from '../../libs/functions';
import {
  IconLoading
} from 'widget/ezList/components';

const renderRefreshing = ({ refresh }) => {
  return (
    <div className="text-center">
      <hr />

      <div className="lead text-muted">
        <IconLoading />
        &nbsp;&nbsp;
        确认用户信息中
      </div>
      <hr />
      <Button onClick={refresh} bsSize="small">重试</Button>
      &nbsp;&nbsp;
      <Button href="#/custom/query" bsSize="small">更换用户</Button>
    </div>
  );
};
renderRefreshing.propTypes = {
  refresh: PropTypes.fun,
};

const renderFetchError = ({ refresh, uid }) => {
  return (
    <div className="text-center">
      <hr />
      <p className="lead text-danger">
        用户信息获取失败
      </p>
      <p className="text-muted">
        uid：{uid}
      </p>
      <hr />
      <Button onClick={refresh} bsSize="small">重试</Button>
      &nbsp;&nbsp;
      <Button href="#/custom/query" bsSize="small">更换用户</Button>
    </div>
  );
};
renderFetchError.propTypes = {
  refresh: PropTypes.fun,
  uid: PropTypes.number,
};

const getRefresh = (uid, dispatch) => () => {
  dispatch(userDrink.findIfNeed(uid, true))
    .then((data) => data)
    .catch(json => {
      if (json.status === 10) {
        wAlert(json.msg || '未知错误', 'warn');
      }
    });
};


class ShowUser extends Component {
  getChildContext() {
    return { uid: this.props.params.uid };
  }

  componentWillMount() {
    this.chooseUser(this.props.params.uid);
  }

  componentWillReceiveProps(nextProps) {
    this.chooseUser(nextProps.params.uid);
  }


  chooseUser(uid) {
    const {
      history,
      selectedUser,
      dispatch,
    } = this.props;

    uid = parseInt(uid, 10);
    if (isNaN(uid)) {
      wAlert('用户id不符合要求', 'error');
      history.pushState(null, '/custom/query');
    } else {
      if (uid !== selectedUser) {
        dispatch(userDrink.selectUser(uid));
      }
      dispatch(userDrink.findIfNeed(uid))
        .then((data) => data, (response) => response);
    }
  }

  render() {
    const {
      user,
      params,
      dispatch,
      header,
      main
    } = this.props;

    const refresh = getRefresh(params.uid, dispatch);

    if (user) {
      if (user.lastReceivedError) {
        if (user.isFetching) {
          return renderRefreshing({ refresh });
        }

        return renderFetchError({ refresh, uid: user.uid });
      }

      if (user.receivedAt === 0) {
        return renderRefreshing(refresh);
      }
    } else {
      return renderRefreshing(refresh);
    }

    return (
      <div >
        <Row>
          <Col xs={12}>
            {header}
          </Col>
        </Row>
        <Row>
          <Col xs={12}>
            {main}
          </Col>
        </Row>
        <hr />
      </div>
    );
  }
}

ShowUser.propTypes = {
  params: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired,
  header: PropTypes.object,
  main: PropTypes.object,
  dispatch: PropTypes.fun,
  selectedUser: PropTypes.string,
  user: PropTypes.object,  // 会自动检查props是否改变，改变才刷新。。
};
ShowUser.childContextTypes = {
  uid: PropTypes.string
};

export default connectEntity(ShowUser, ['selectedUser', 'user']);

