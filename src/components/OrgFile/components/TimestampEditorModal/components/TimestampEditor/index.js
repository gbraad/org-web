import React, { PureComponent, Fragment } from 'react';

import './TimestampEditor.css';

import Switch from '../../../../../UI/Switch/';
import TabButtons from '../../../../../UI/TabButtons/';

import { renderAsText } from '../../../../../../lib/timestamps';

import _ from 'lodash';
import moment from 'moment';

export default class TimestampEditor extends PureComponent {
  constructor(props) {
    super(props);

    _.bindAll(this, [
      'handleActiveToggle',
      'handleDateChange',
      'handleAddRepeater',
      'handleRemoveRepeater',
      'handleRepeaterTypeChange',
      'handleRepeaterValueChange',
      'handleRepeaterUnitChange',
      'handleAddDelay',
      'handleRemoveDelay',
      'handleDelayTypeChange',
      'handleDelayValueChange',
      'handleDelayUnitChange',
    ]);
  }

  handleActiveToggle() {
    this.props.onChange(this.props.timestamp.update('isActive', isActive => !isActive));
  }

  handleDateChange(event) {
    const { onChange, timestamp } = this.props;

    const newDate = moment(event.target.value);
    const [newYear, newMonth, newDay, newDayName] = newDate.format('YYYY MM DD ddd').split(' ');
    onChange(
      timestamp
        .set('year', newYear)
        .set('month', newMonth)
        .set('day', newDay)
        .set('dayName', newDayName)
    );
  }

  handleAddTime(startOrEnd) {
    return () => {
      const { onChange, timestamp } = this.props;

      const [hourKey, minuteKey] =
        startOrEnd === 'start' ? ['startHour', 'startMinute'] : ['endHour', 'endMinute'];
      const [hour, minute] = moment()
        .format('HH:mm')
        .split(':');
      onChange(timestamp.set(hourKey, hour).set(minuteKey, minute));
    };
  }

  handleRemoveTime(startOrEnd) {
    return () => {
      const { onChange, timestamp } = this.props;

      const [hourKey, minuteKey] =
        startOrEnd === 'start' ? ['startHour', 'startMinute'] : ['endHour', 'endMinute'];
      onChange(timestamp.set(hourKey, null).set(minuteKey, null));
    };
  }

  handleTimeChange(startOrEnd) {
    return event => {
      const { onChange, timestamp } = this.props;

      const [hourKey, minuteKey] =
        startOrEnd === 'start' ? ['startHour', 'startMinute'] : ['endHour', 'endMinute'];
      let [hour, minute] = event.target.value.split(':');
      hour = hour.startsWith('0') ? hour.substring(1) : hour;
      onChange(timestamp.set(hourKey, hour).set(minuteKey, minute));
    };
  }

  handleAddRepeater() {
    const { onChange, timestamp } = this.props;
    onChange(
      timestamp
        .set('repeaterType', '+')
        .set('repeaterValue', 1)
        .set('repeaterUnit', 'h')
    );
  }

  handleRemoveRepeater() {
    const { onChange, timestamp } = this.props;
    onChange(
      timestamp
        .set('repeaterType', null)
        .set('repeaterValue', null)
        .set('repeaterUnit', null)
    );
  }

  handleRepeaterTypeChange(newRepeaterType) {
    const { onChange, timestamp } = this.props;
    onChange(timestamp.set('repeaterType', newRepeaterType));
  }

  handleRepeaterValueChange(event) {
    const { onChange, timestamp } = this.props;
    onChange(timestamp.set('repeaterValue', event.target.value));
  }

  handleRepeaterUnitChange(newRepeaterUnit) {
    const { onChange, timestamp } = this.props;
    onChange(timestamp.set('repeaterUnit', newRepeaterUnit));
  }

  handleAddDelay() {
    const { onChange, timestamp } = this.props;
    onChange(
      timestamp
        .set('delayType', '-')
        .set('delayValue', 1)
        .set('delayUnit', 'h')
    );
  }

  handleRemoveDelay() {
    const { onChange, timestamp } = this.props;
    onChange(
      timestamp
        .set('delayType', null)
        .set('delayValue', null)
        .set('delayUnit', null)
    );
  }

  handleDelayTypeChange(newDelayType) {
    const { onChange, timestamp } = this.props;
    onChange(timestamp.set('delayType', newDelayType));
  }

  handleDelayValueChange(event) {
    const { onChange, timestamp } = this.props;
    onChange(timestamp.set('delayValue', event.target.value));
  }

  handleDelayUnitChange(newDelayUnit) {
    const { onChange, timestamp } = this.props;
    onChange(timestamp.set('delayUnit', newDelayUnit));
  }

  renderTimeField(label, timeKey, hour, minute, showRemoveButton = true) {
    return (
      <div className="timestamp-editor__field-container timestamp-editor__field-container--inline">
        <div className="timestamp-editor__field-title">{label}:</div>
        <div className="timestamp-editor__field">
          {!!hour ? (
            <Fragment>
              <input
                type="time"
                value={`${hour.padStart(2, '0')}:${minute.padStart(2, '0')}`}
                onChange={this.handleTimeChange(timeKey)}
              />
              {showRemoveButton && (
                <i
                  className="fas fa-times timestamp-editor__icon"
                  onClick={this.handleRemoveTime(timeKey)}
                />
              )}
            </Fragment>
          ) : (
            <i
              className="fas fa-plus timestamp-editor__icon"
              onClick={this.handleAddTime(timeKey)}
            />
          )}
        </div>
      </div>
    );
  }

  renderRepeater() {
    const { repeaterType, repeaterValue, repeaterUnit } = this.props.timestamp.toJS();

    return (
      <div className="timestamp-editor__field-container">
        <div className="timestamp-editor__field-title">Repeater:</div>
        <div className="timestamp-editor__field timestamp-editor__field--delay-repeater">
          {!!repeaterType ? (
            <Fragment>
              <div>
                <TabButtons
                  buttons={['+', '++', '.+']}
                  selectedButton={repeaterType || '+'}
                  onSelect={this.handleRepeaterTypeChange}
                />
              </div>
              <input
                type="number"
                min="1"
                className="textfield delay-repeater-value-input"
                value={repeaterValue || 1}
                onChange={this.handleRepeaterValueChange}
              />
              <div>
                <TabButtons
                  buttons={'hdwmy'.split('')}
                  selectedButton={repeaterUnit || 'h'}
                  onSelect={this.handleRepeaterUnitChange}
                />
              </div>
              <i
                className="fas fa-times timestamp-editor__icon"
                onClick={this.handleRemoveRepeater}
              />
            </Fragment>
          ) : (
            <i className="fas fa-plus timestamp-editor__icon" onClick={this.handleAddRepeater} />
          )}
        </div>
      </div>
    );
  }

  renderDelay() {
    const { delayType, delayValue, delayUnit } = this.props.timestamp.toJS();

    return (
      <div className="timestamp-editor__field-container">
        <div className="timestamp-editor__field-title">Delay:</div>
        <div className="timestamp-editor__field">
          {!!delayType ? (
            <Fragment>
              <div>
                <TabButtons
                  buttons={['-', '--']}
                  selectedButton={delayType || '-'}
                  onSelect={this.handleDelayTypeChange}
                />
              </div>
              <input
                type="number"
                min="1"
                className="textfield delay-repeater-value-input"
                value={delayValue || 1}
                onChange={this.handleDelayValueChange}
              />
              <div>
                <TabButtons
                  buttons={'hdwmy'.split('')}
                  selectedButton={delayUnit || 'h'}
                  onSelect={this.handleDelayUnitChange}
                />
              </div>
              <i className="fas fa-times timestamp-editor__icon" onClick={this.handleRemoveDelay} />
            </Fragment>
          ) : (
            <i className="fas fa-plus timestamp-editor__icon" onClick={this.handleAddDelay} />
          )}
        </div>
      </div>
    );
  }

  render() {
    const { timestamp } = this.props;
    const {
      isActive,
      year,
      month,
      day,
      dayName,
      startHour,
      startMinute,
      endHour,
      endMinute,
      repeaterType,
      repeaterValue,
      repeaterUnit,
      delayType,
      delayValue,
      delayUnit,
    } = timestamp.toJS();

    return (
      <div>
        <div className="timestamp-editor__render">{renderAsText(timestamp)}</div>

        <div className="timestamp-editor__field-container timestamp-editor__field-container--inline">
          <div className="timestamp-editor__field-title">Active:</div>
          <div className="timestamp-editor__field">
            <Switch isEnabled={isActive} onToggle={this.handleActiveToggle} />
          </div>
        </div>

        <div className="timestamp-editor__field-container timestamp-editor__field-container--inline">
          <div className="timestamp-editor__field-title">Date:</div>
          <div className="timestamp-editor__field">
            <input
              type="date"
              ref={input => (this.dateInput = input)}
              onChange={this.handleDateChange}
              value={`${timestamp.get('year')}-${timestamp.get('month')}-${timestamp.get('day')}`}
            />
          </div>
        </div>

        {this.renderTimeField('Start time', 'start', startHour, startMinute, !endHour)}
        {!!startHour && this.renderTimeField('End time', 'end', endHour, endMinute)}

        {this.renderRepeater()}
        {this.renderDelay()}
      </div>
    );
  }
}
