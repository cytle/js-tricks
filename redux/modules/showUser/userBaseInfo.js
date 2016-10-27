import { Component } from 'widget/react';
import {
  Row,
  Col,
  Collapse,
  Glyphicon,
  Button
} from 'widget/react/bootstrap';
import {
  ItemHorizontal
} from 'widget/ezList/components';

import {
  connectEntity,
  formatTime
} from '../../libs/functions';

import {
  userDrink
} from '../../drinks';


class UserBaseInfo extends Component {
  constructor(...args) {
    super(...args);
    this.state = {
      open: true,
    };
    this.show = this.show.bind(this);
    this.refresh = this.refresh.bind(this);
  }

  shouldComponentUpdate(nextProps, nextState) {
    return this.props.user.lastUpdated !== nextProps.user.lastUpdated ||
    nextState.open !== this.state.open;
  }

  refresh() {
    this.props.dispatch(userDrink.base.invalidate(this.props.user.uid));
  }

  show() {
    this.setState({ open: !this.state.open });
  }

  render() {
    const user = this.props.user;

    return (
      <div className="user-base-info">

        <Row>
          <Col md="6" xs="12" className="text-right pull-right">


            <div style={{ margin: 10, display: 'inline-block' }} >
              <span
                onClick={this.show}
                className="text-muted"
                style={{
                  cursor: 'pointer'
                }}
              >
                <Glyphicon
                  bsSize="large"
                  glyph={this.state.open ? 'resize-small' : 'resize-full'}
                />
                &nbsp;&nbsp;
                {this.state.open ? '隐藏' : '显示'}用户信息
              </span>
            </div>

            <div style={{ display: 'inline-block' }} >
              <span className={(user.isFetching ? '' : 'hidden')} >
                <Glyphicon glyph="refresh" className="icon-spin" />
                &nbsp;
                获取用户信息中
                &nbsp;
                &nbsp;
              </span>
              <Button href="#/custom/query" bsSize="sm">更换用户</Button>
            </div>
              {/*
              <Button onClick={this.refresh} className={(user.isFetching ? 'hidden' : '')}>
                <Glyphicon glyph="repeat" />
                &nbsp;
                刷新用户信息
              </Button>
              */}
          </Col>

          <Col md="6" xs="12" className="pull-right">
            <h3>
              <span className={user.isFetching ? '' : 'hidden'} style={{ backgroundColor: '#ccc' }}>
                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
              </span>
              <span className={user.isFetching ? 'hidden' : ''}>{user.nickname}</span>
              <small> uid: {user.uid} </small>
            </h3>
          </Col>
        </Row>
        <Collapse in={this.state.open} className="">
          <Row>
            <Col sm="6">
              <ItemHorizontal label="uid">{user.uid}</ItemHorizontal>
              <ItemHorizontal label="手机号">{user.phone}</ItemHorizontal>
              <ItemHorizontal label="用户名">{user.uname}</ItemHorizontal>
            </Col>
            <Col sm="6">
              <ItemHorizontal label="注册时间">
                {formatTime(user.regTime * 1000)}
              </ItemHorizontal>
              <ItemHorizontal label="最近登录时间">
                {formatTime(user.lastLogin * 1000)}
              </ItemHorizontal>
            </Col>
          </Row>
        </Collapse>
      </div>
    );
  }
}

UserBaseInfo.propTypes = {
  user: React.PropTypes.object.isRequired,
  dispatch: React.PropTypes.func.isRequired,
};


export default connectEntity(UserBaseInfo, ['user']);

