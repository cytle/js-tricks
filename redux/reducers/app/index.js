import { combineReducers } from 'widget/redux';

import users from './users';
import { userDrink } from '../../drinks';

// 选择当前的用户
const selectedUser = (state = null, action) => {
  if (action.type === userDrink.SELECT_USER) {
    return action.uid;
  }
  return state;
};


// 选择当前的角色
const selectedRole = (state = null, action) => {
  if (action.type === userDrink.SELECT_ROLE) {
    return action.role;
  }
  return state;
};

const usersList = userDrink.users.reducer;

const app = combineReducers({
  selectedUser,

  selectedRole,

  // 当前列表
  usersList,

  // 实际信息
  users,

});

export default app;
