import RoleNav from '../roleNav';
import { connectEntity } from '../../../libs/functions';
import { ROLE_USER } from '../../../consts';

const User = (props, context) => {
  return (
    <RoleNav
      {...props}
      roleObj={props.user}
      selectedRole={ROLE_USER}
      uid={context.uid}
    >
      {props.children}
    </RoleNav>);
};

User.propTypes = {
  children: React.PropTypes.any,
  user: React.PropTypes.any,
};

User.contextTypes = {
  uid: React.PropTypes.string
};

export default connectEntity(User, ['user']);
