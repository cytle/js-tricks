```javascript
// base
{
  isFetching: boolean,   // 是否正在fetch
  didInvalidate: true,   // 是否无效
  lastUpdated: integer,  // 最后更新时间
}

// list
{
  currentPage: integer,  // 当前页
  prePage: integer,      // 每页数量
  total: integer,        // 总条数
  items: arrayOfInteger, // id组成的列表
}

{
  // 都是id索引
  app: {
    selectedUser: [uid],

    // 当前列表
    usersList: [],

    // 记录用户信息，各项当前列表
    users: {
      [uid]: {
        selectedRole: string // 角色，user、dorm、supplier
        dorm: {
          dormId: integer,
          dormItems: {list},
          orders: {list},
        },
        user: {
          uid: integer,
          orders: {list},

        },
        supplier: {
          supplierId: integer,
          warehouse: {
            id: integer,
            purchaseOrders: {list},

          }
        }

        // ...

      }
    }
  },
  entities: {
    users: {
      [uid]: {
        uid: integer,
        uname: uname,
        // ...
      }
    },
    dorms: {
      [dorm_id]: {

      }
    },
    dormItems: {
      [item_id]: {
        item_id: integer,
        rid: integer,
        // ...
      }
    }
  }
}

```
