import React from 'react';
import ace from 'brace';
import 'brace/mode/javascript';
import 'brace/theme/tomorrow';

export default class Editor extends React.Component {
  componentDidMount() {
    this.ace = ace.edit(this.editor);
    this.ace.getSession().setMode('ace/mode/javascript');
    this.ace.setTheme('ace/theme/tomorrow');
  }

  componentWillUnmount() {
    if (this.ace) {
      this.ace.destroy();
      this.ace = null;
    }
  }

  render() {
    const styles = {
      position: 'absolute',
      top: 70,
      bottom: 0,
      left: 0,
      right: 0,
      borderRadius: 5,
    };

    return (
      <div style={styles} ref={(editor) => { this.editor = editor; }} />
    );
  }
}

