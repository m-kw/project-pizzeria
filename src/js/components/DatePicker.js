import {select, settings} from './../settings.js';
import {utils} from './../utils.js';
import BaseWidget from './BaseWidget.js';

class DatePicker extends BaseWidget {
  constructor(wrapper) {
    super(wrapper, utils.dateToStr(new Date()));

    this.dom.input = this.dom.wrapper.querySelector(select.widgets.datePicker.input);

    this.initPlugin();
  }

  initPlugin() {
    this.minDate = new Date(this.value);
    this.maxDate = utils.addDays(this.minDate, settings.datePicker.maxDaysInFuture);

    flatpickr(this.dom.input, {
      defaultDate: this.minDate,
      minDate: this.minDate,
      maxDate: this.maxDate,
      disable: [
        function(date) {
          return (date.getDay() === 1);
        }
      ],
      locale: {
        firstDayOfWeek: 1,
      },
      onChange: function(selectedDates, dateStr) {
        this.value = dateStr;
      }
    });

  }

  parseValue(value) {
    return value;
  }

  isValid() {
    return true;
  }

  renderValue() {}
}

export default DatePicker;
