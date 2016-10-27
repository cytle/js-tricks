import {
  IconLoading
} from 'widget/ezList/components';

import { userRole, roleItems } from '../../consts';

import { Nav, NavItem } from 'widget/react/bootstrap';

const getCreateHref = (uid, selectedRole) => (page) => {
  return `#/custom/query/users/${uid}/${selectedRole}/${page}`;
};

const allUserRoles = Object.keys(roleItems);

const RoleNav = (
{
  uid,
  selectedRole,
  roleObj,
  children,
  params,
  location
}) => {
  let fetchInfo;
  if (! roleObj || roleObj.isFetching) {
    fetchInfo = (
      <span className="text-muted">
        <IconLoading />
        &nbsp;&nbsp;正在获取中
      </span>);
  } else if (roleObj.lastReceivedError) {
    fetchInfo = (
      <span className="text-danger">
        未获取到，{roleObj.lastReceivedErrorResponse.msg || '未知错误'}
      </span>);
  }

  const createHref = getCreateHref(params.uid, selectedRole);

  const items = roleItems[selectedRole] || {};
  const keys = Object.keys(items);


  return (
    <div style={{ position: 'relative' }}>
      <span style={{ position: 'absolute', right: 10, top: 10 }}>
        {fetchInfo}
      </span>
      <h4 className="lead">

        {allUserRoles.map(role => {
          if (role === selectedRole) {
            return (
              <span style={{ marginLeft: 10 }}>
                {userRole[selectedRole]}
              </span>
            );
          }

          return (
            <small>
              <a
                href={`#/custom/query/users/${uid}/${role}`}
                className="text-muted"
                style={{ marginLeft: 10 }}
              >
                {userRole[role]}
              </a>
            </small>

          );
        })}

        &nbsp;&nbsp;

      </h4>
      <div className="role-nav">
        <div style={{ 'overflow-x': 'auto' }} >
          <Nav
            bsStyle="tabs"
            activeHref={'#' + location.pathname}
            style={{
              'min-width': 94 * keys.length
            }}
          >
            {keys.map(
              name => <NavItem href={createHref(name)}>{items[name]}</NavItem>
            )}
          </Nav>
        </div>
        <div
          style={{
            backgroundColor: '#FFF',
            padding: '15px',
            border: '1px solid #ddd',
            borderWidth: '0px 1px',
          }}
        >
          {children}
        </div>
      </div>
    </div>
  );
};

RoleNav.propTypes = {
  uid: React.PropTypes.string,
  children: React.PropTypes.any,
  roleObj: React.PropTypes.object,
  params: React.PropTypes.object,
  location: React.PropTypes.object,
  selectedRole: React.PropTypes.string,
};

export default RoleNav;
