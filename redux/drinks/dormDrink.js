import Drink from '../libs/drink';
import { getDorm, shouldFetch } from '../libs/functions';

class DormDrink extends Drink {

  get dorms() {
    return this.lists.dorms;
  }

  find(dormId) {
    const path = `/customer_service/dorms/${dormId}`;
    return this.base.fetchReceive(path)(dormId);
  }

  query(where = {}) {
    const path = `/customer_service/dorms?${$.param(where)}`;
    return this.dorms.fetchReceive(path)({ where });
  }

  findByUid(uid) {
    return (dispatch, getState) => {
      const obj = getDorm(getState(), uid);
      const keyName = this.base.keyName;

      if (shouldFetch(obj)) {
        if (obj[keyName]) {
          return dispatch(this.findIfNeed(obj[keyName]));
        }

        const path = `/customer_service/users/${uid}/dorm`;
        return dispatch(this.base.fetchReceive(path)(null, { uid }));
      }

      const entity = this.base.getEntity(getState(), obj[keyName]);
      if (entity) {
        return Promise.resolve(
          this.base.receive(
            entity
          ));
      }

      return Promise.resolve(
        this.base.receiveError(
          obj
        ));
    };
  }
}


export default new DormDrink({
  base: 'dorm',
  keyName: 'dormId',
  lists: {
    'dorms': { withPage: false },
  },
  options: {
    parse: dorm => {
      let role = dorm.role;

      dorm.role = [];

      for (let i = 0; i < 4; i++) {
        if (role & 1) {
          dorm.role.push(1 << i);
        }
        role = role >> 1;
      }
      return dorm;
    }
  }
});

