import Drink from '../libs/drink';
import { shouldFetch } from '../libs/functions';

class UserDrink extends Drink {
  get SELECT_USER() {
    return 'SELECT_USER';
  }

  get SELECT_ROLE() {
    return 'SELECT_ROLE';
  }

  get users() {
    return this.lists.users;
  }

  selectUser(uid) {
    return {
      type: this.SELECT_USER,
      uid
    };
  }

  selectRole(role) {
    return {
      type: this.SELECT_ROLE,
      role
    };
  }

  find(uid) {
    const path = `/customer_service/users/${uid}`;
    return this.base.fetchReceive(path)(uid);
  }

  query(where = {}) {
    const path = `/customer_service/users?${$.param(where)}`;
    return this.users.fetchReceive(path)({ where });
  }

  queryByUidsIfNeed(uids) {
    return (dispatch, getState) => {
      const state = getState();
      const getEntity = this.base.getEntity;
      const users = {};

      uids = [].filter.call(uids,
        (keyValue) => {
          const entity = getEntity(state, keyValue);
          users[keyValue] = entity;
          return shouldFetch(entity);
        }
      );

      if (uids.length > 0) {
        return dispatch(this.query({ uids }))
          .then(
            data => {
              data.every(user => (users[user.uid] = user));
              return Promise.resolve(users);
            },
            Promise.reject
          );
      }

      return Promise.resolve(users);
    };
  }
}

export default new UserDrink({
  base: 'user',
  keyName: 'uid',
  lists: {
    'users': { withPage: false },
  }
});

