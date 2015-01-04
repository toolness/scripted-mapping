define(function(require) {
  var React = require('react');

  var Search = React.createClass({
    getDefaultProps: function() {
      return {
        changeDelay: 300
      };
    },
    handleSubmit: function(e) {
      e.preventDefault();
      this.cancelTimeout();
      this.updateQuery();
    },
    handleChange: function() {
      this.cancelTimeout();
      this.timeout = window.setTimeout(this.updateQuery,
                                       this.props.changeDelay);
    },
    updateQuery: function() {
      this.props.onChange(this.refs.search.getDOMNode().value);
    },
    cancelTimeout: function() {
      window.clearTimeout(this.timeout);
      delete this.timeout;
    },
    componentWillUnmount: function() {
      this.cancelTimeout();
    },
    render: function() {
      return (
        <form className={this.props.className} role="search" onSubmit={this.handleSubmit}>
          <div className="form-group">
            <input ref="search" type="text" className="form-control" placeholder="Search" onChange={this.handleChange} defaultValue={this.props.defaultQuery}/>
          </div>
        </form>
      );
    }
  });

  return Search;
});
