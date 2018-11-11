import React from 'react';
import { Text } from 'react-native';

// export class MonoText extends React.Component {
//   render() {
//     return <StyledText {...this.props} style={[this.props.style, { fontFamily: 'space-mono' }]} />;
//   }
// }

export default class StyledText extends React.Component {
  render() {
    return <Text {...this.props} style={[this.props.style, { fontFamily: 'open-sans' }]} />;
  }
}