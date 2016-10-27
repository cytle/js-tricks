import { Component } from 'widget/react';
import { connectEntity } from '../../../libs/functions';
import {
  supplierDrink,
  warehouseDrink
} from '../../../drinks';
import RoleNav from '../roleNav';
import { ROLE_SUPPLIER } from '../../../consts';


class Supplier extends Component {
  componentDidMount() {
    this.fetchSupplier();
    this.fetchWarehouse();
  }
  componentDidUpdate() {
    this.fetchSupplier();
    this.fetchWarehouse();
  }

  fetchSupplier() {
    const supplier = this.props.supplier;
    if (supplier && supplier.supplierId) {
      return this
        .context
        .dispatch(supplierDrink.findIfNeed(supplier.supplierId))
        .then(data => data, response => response);
    }
    return this
      .context
      .dispatch(supplierDrink.findByUid(this.context.uid))
      .then(data => data, response => response);
  }

  fetchWarehouse() {
    const supplier = this.props.supplier;
    if (supplier && ! supplierDrink.supplierIsWarehouse(supplier)) {
      return false;
    }

    const warehouse = this.props.warehouse;

    if (warehouse && warehouse.id) {
      return this
        .context
        .dispatch(warehouseDrink.findIfNeed(warehouse.id))
        .then(data => data, response => response);
    }

    return this
        .context
        .dispatch(warehouseDrink.findByUid(this.context.uid))
        .then(data => data, response => response);
  }

  render() {
    return (
      <RoleNav
        {...this.props}
        roleObj={this.props.supplier}
        selectedRole={ROLE_SUPPLIER}
        uid={this.context.uid}
      >
        {this.props.children}
      </RoleNav>);
  }
}

Supplier.propTypes = {
  supplier: React.PropTypes.object,
  warehouse: React.PropTypes.object,
  selectedRole: React.PropTypes.string,
  children: React.PropTypes.any,
};

Supplier.contextTypes = {
  uid: React.PropTypes.string,

  route: React.PropTypes.object,
  dispatch: React.PropTypes.object,
  params: React.PropTypes.object,

};

export default connectEntity(Supplier, ['supplier', 'warehouse']);
