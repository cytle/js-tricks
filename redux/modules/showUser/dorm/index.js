import { Component } from 'widget/react';
import { connectEntity } from '../../../libs/functions';
import {
  dormDrink,
} from '../../../drinks';
import RoleNav from '../roleNav';
import { ROLE_DORM } from '../../../consts';

class Dorm extends Component {
  componentDidMount() {
    this.fetchDorm();
  }
  componentDidUpdate() {
    this.fetchDorm();
  }

  fetchDorm() {
    const dorm = this.props.dorm;
    if (dorm && dorm.dormId) {
      return this
        .context
        .dispatch(dormDrink.findIfNeed(dorm.dormId))
        .then(data => data, response => response);
    }
    return this
      .context
      .dispatch(dormDrink.findByUid(this.context.uid))
      .then(data => data, response => response);
  }


  render() {
    return (
      <RoleNav
        {...this.props}
        roleObj={this.props.dorm}
        selectedRole={ROLE_DORM}
        uid={this.context.uid}
      >
        {this.props.children}
      </RoleNav>);
  }
}

Dorm.propTypes = {
  dorm: React.PropTypes.object,
  selectedRole: React.PropTypes.string,
  children: React.PropTypes.any,
};

Dorm.contextTypes = {
  uid: React.PropTypes.string,

  route: React.PropTypes.object,
  dispatch: React.PropTypes.object,
  params: React.PropTypes.object,

};

export default connectEntity(Dorm, ['dorm']);
