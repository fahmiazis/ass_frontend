import React, { Component } from 'react'
import NumberFormat from "react-number-format";

export default class NumberInput extends Component {
    state = {
        value: ""
      };

      render() {
        return (
          <NumberFormat
            placeholder="Please fill with numbers"
            isNumericString={true}
            thousandSeparator="."
            decimalSeparator=","
            value={this.state.value}
            onValueChange={vals => this.setState({ value: vals.formattedValue })}
            {...this.props}
          />
        );
      }
}
