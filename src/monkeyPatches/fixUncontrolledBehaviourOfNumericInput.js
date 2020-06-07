import React from "react";
import {getValueOrEmptyValue} from "@blueprintjs/core/lib/cjs/components/forms/numericInputUtils";
import {InputGroup, NumericInput, removeNonHTMLProps} from "@blueprintjs/core";

// This monkey patches https://github.com/palantir/blueprint/pull/4131 into this repository.

NumericInput.prototype.renderInput = function() {
  const inputGroupHtmlProps = removeNonHTMLProps(this.props, [
    "allowNumericCharactersOnly",
    "buttonPosition",
    "clampValueOnBlur",
    "className",
    "majorStepSize",
    "minorStepSize",
    "onButtonClick",
    "onValueChange",
    "selectAllOnFocus",
    "selectAllOnIncrement",
    "stepSize",
  ], true);
  return (
    <InputGroup
      autoComplete="off"
      {...inputGroupHtmlProps}
      intent={this.props.intent}
      inputRef={this.inputRef}
      large={this.props.large}
      leftIcon={this.props.leftIcon}
      onFocus={this.handleInputFocus}
      onBlur={this.handleInputBlur}
      onChange={this.handleInputChange}
      onKeyDown={this.handleInputKeyDown}
      onKeyPress={this.handleInputKeyPress}
      onPaste={this.handleInputPaste}
      rightElement={this.props.rightElement}
      value={getValueOrEmptyValue(this.props.value || this.state.value)}
    />
  );
}