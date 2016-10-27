import { PropTypes } from 'widget/react';
import {
  Form,
} from 'widget/react/bootstrap';
import IconLoading from '../iconLoading';


const getHandleSubmit = (onSubmit, location, router) => (event) => {
  event.preventDefault();

  const formData = new FormData(event.target);

  const query = {};

  for (const [name] of formData) {
    if (!(name in query)) {
      query[name] = formData.getAll(name).join(',').trim();
    }
  }
  for (const k in query) {
    if (! query[k]) {
      delete query[k];
    }
  }

  // 刷新路由
  router.push({ pathname: location.pathname, query });

  // 调用方法
  if (onSubmit) {
    onSubmit(query);
  }
};

const SearchForm = (props, { location, router }) => {
  const handleSubmit = getHandleSubmit(props.onSubmit, location, router);
  return (
    <div style={{ position: 'relative' }} className="ez-list-search-form">
      <Form
        {...props}
        onSubmit={handleSubmit}
        method="get"
      />
      <div
        className={(props.isFetching ? '' : 'hidden')}
        style={{
          position: 'absolute',
          width: '100%',
          height: '100%',
          backgroundColor: 'rgba(255, 255, 255, 0.5)',
          top: '0px',
          left: '0px',
          zIndex: '10',
          textAlign: 'center',
        }}
      >
        <span
          style={{
            position: 'absolute',
            zIndex: '11',
            top: '20%',
            color: '#555',
            fontSize: '16px',
          }}
        >
          <IconLoading />
        </span>
      </div>
    </div>
  );
};

SearchForm.contextTypes = {
  router: React.PropTypes.object.isRequired,
  location: React.PropTypes.object.isRequired,
};

SearchForm.propTypes = {
  onSubmit: PropTypes.func,
  isFetching: React.PropTypes.any,
};

export default SearchForm;
