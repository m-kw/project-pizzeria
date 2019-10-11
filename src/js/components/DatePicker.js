import {select, settings} from './../settings.js';
import {utils} from './../utils.js';
import BaseWidget from './BaseWidget.js';

class DatePicker extends BaseWidget {
  constructor(wrapper) {
    super(wrapper, utils.dateToStr(new Date()));

    console.log('datePickerWrapper', wrapper);
    this.dom.input - this.dom.wrapper.querySelector(select.widgets.datePicker.input);
    console.log('datePicker input', this.dom.input);

    this.initPlugin();
  }

  initPlugin() {
    this.minDate = new Date(this.value);
    console.log('min.Date', this.minDate);
    this.maxDate = utils.addDays(this.minDate, settings.datePicker.maxDaysInFuture);
    console.log('maxDate', this.maxDate);

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
        firstDayOdWeek: 1,
      },
      onChange: function(selectedDates, dateStr) {
        this.value = dateStr;
        console.log('selectedDates', selectedDates);
      }
    });
  }
}

export default DatePicker;
