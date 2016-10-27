import {
  connectEntity,
  formatTime,
  fixedMoney,
} from '../../../libs/functions';
import {
  Row,
  Col,
} from 'widget/react/bootstrap';

import {
  ItemHorizontal,
} from 'widget/ezList/components';

import {
  transDormStatus,
  transDormVerifiedStatus,
  transDormRole,
  transDormFreezeType,
  transDormFreezeStatus,
} from '../../../consts';

// 是否被全额冻结
const isFullFreeze = (dorm) => dorm.freezeStatus !== 0;

// 是否启用冻结
const isFreeze = (dorm) => dorm.freezeType !== 0;

// 店长可提现金额
const dormCanRewardMoney = (dorm) => {
  if (isFullFreeze(dorm)) {
    return 0;
  }

  if (isFreeze(dorm)) {
    if (dorm.freezeMoney <= 0) {
      return dorm.money;
    }
    return Math.max(0, dorm.money - dorm.freezeMoney);
  }

  return dorm.money;
};

// 店长可提现金额说明
const dormCanRewardMoenyRemark = (dorm) => {
  if (isFullFreeze(dorm)) {
    return (
      <ul>
        <li>
          店长账户被全额冻结，所以用户可提现金额为0
        </li>
        <li>
          冻结类型为「{transDormFreezeStatus(dorm.freezeStatus)}」，详见下面「账户冻结详情」
        </li>
      </ul>
    );
  }

  if (isFreeze(dorm)) {
    return (
      <ul>
        <li>
          冻结状态为「{transDormFreezeType(dorm.freezeType)}」，冻结金额为：{dorm.freezeMoney || 0}元
        </li>
        <li>可提现资金 = 余额 - 冻结金额</li>
      </ul>
    );
  }

  return (
    <ul>
      <li>
        「{transDormFreezeType(dorm.freezeType)}」
      </li>
    </ul>
  );
};

const Info = ({
  dorm = {},
  children
}) => {
  const site = dorm.site || {};

  return (
    <div className="detail-box">
      <h4 className="lead">店长个人信息</h4>
      <Row>
        <Col md="6">
          <ItemHorizontal labelSize="4" label="店长ID">
            {dorm.dormId}
          </ItemHorizontal>
          <ItemHorizontal labelSize="4" label="姓名">
            {dorm.name}
          </ItemHorizontal>
          <ItemHorizontal labelSize="4" label="邮箱">
            {dorm.email}
          </ItemHorizontal>
          <ItemHorizontal labelSize="4" label="申请开店时间">
            {formatTime(dorm.addTime * 1000)}
          </ItemHorizontal>
          <ItemHorizontal labelSize="4" label="角色">
            {
              dorm.role &&
              dorm.role
                .map(item => transDormRole(item))
                .join(',')
            }
          </ItemHorizontal>
          <ItemHorizontal labelSize="4" label="状态">
            {transDormStatus(dorm.status)}
          </ItemHorizontal>
          <ItemHorizontal labelSize="4" label="审核状态">
            {transDormVerifiedStatus(dorm.verifiedStatus)}
          </ItemHorizontal>
        </Col>
        <Col md="6">
          <ItemHorizontal labelSize="4" label="用户ID">
            {dorm.uid}
          </ItemHorizontal>
          <ItemHorizontal labelSize="4" label="手机号">
            {dorm.phone}
          </ItemHorizontal>
          <ItemHorizontal labelSize="4" label="开户银行">
            {dorm.bankId}
          </ItemHorizontal>
          <ItemHorizontal labelSize="4" label="开户网点">
            {dorm.openAccount}
          </ItemHorizontal>
          <ItemHorizontal labelSize="4" label="开户城市">
            {dorm.openLocation}
          </ItemHorizontal>
          <ItemHorizontal labelSize="4" label="银行卡">
            {dorm.cardNumber}
          </ItemHorizontal>
        </Col>
      </Row>

      <br />
      <h4 className="lead">资金详情</h4>
      <Row>
        <Col md="6">
          <ItemHorizontal labelSize="4" label="余额">
            ￥ {dorm.money}
          </ItemHorizontal>
        </Col>
        <Col md="6">
          <ItemHorizontal labelSize="4" label="欠款">
            ￥ {dorm.overdraft}
          </ItemHorizontal>
        </Col>

        <Col md="12">
          <ItemHorizontal warp labelSize="2" label="可提现资金">
            ￥ {fixedMoney(dormCanRewardMoney(dorm))}

            <br />
            <span className="text-muted">
              {dormCanRewardMoenyRemark(dorm)}
            </span>
          </ItemHorizontal>
        </Col>
      </Row>

      <div className={isFullFreeze(dorm) ? '' : 'hidden'}>
        <br />
        <h4 className="lead">账户冻结详情</h4>
        <Row>
          <Col md="6">
            <ItemHorizontal labelSize="4" label="账户冻结类型">
              {transDormFreezeStatus(dorm.freezeStatus)}
            </ItemHorizontal>
          </Col>

          <Col md="6">

            <ItemHorizontal labelSize="4" label="账户冻结时间">
              {formatTime(dorm.freezeTime * 1000)}
            </ItemHorizontal>

          </Col>

          <Col md="12">
            <ItemHorizontal warp labelSize="2" label="冻结说明">
              {dorm.freezeRemark}
            </ItemHorizontal>
          </Col>
        </Row>
      </div>

      <br />
      <h4 className="lead">地址信息</h4>
      <Row>
        <Col md="6">
          <ItemHorizontal labelSize="4" label="城市名称">
            {site.cityName}
          </ItemHorizontal>

          <ItemHorizontal labelSize="4" label="区域名称">
            {site.zoneName}
          </ItemHorizontal>

          <ItemHorizontal labelSize="4" label="学校名称">
            {site.siteName}
          </ItemHorizontal>

        </Col>
        <Col md="6">
          <ItemHorizontal labelSize="4" label="所在楼栋">
            {dorm.dormentry}
          </ItemHorizontal>

          <ItemHorizontal labelSize="4" label="详细地址">
            {dorm.deliveryAddress}
          </ItemHorizontal>

        </Col>
      </Row>
      {children}
    </div>
  );
};

Info.propTypes = {
  children: React.PropTypes.object,
  params: React.PropTypes.object,
  dorm: React.PropTypes.object,
};

export default connectEntity(Info, ['dorm']);
