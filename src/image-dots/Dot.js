import React from 'react';

const defaultProps = {
  dotRadius: 1,
};

export default class Dot extends React.Component {
  onMouseDown = (e) => {
      e.stopPropagation();
      this.props.moveDot(this.props.i);
  }

  render() {
    const { dotX, dotY, styles, dotRadius } = this.props;
    return (
      <div
        className="react-image-dot"
        onMouseDown={this.onMouseDown}
        style={{
          ...styles,
          height: dotRadius * 2,
          width: dotRadius * 2,
          transform: `translate(${-dotRadius}, ${-dotRadius})`,
          top: dotY || 0,
          left: dotX || 0
        }}
      />
    );
  }
}

Dot.defaultProps = defaultProps;
