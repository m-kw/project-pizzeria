import {select, templates} from './../settings.js';
import AmountWidget from './AmountWidget.js';
import DatePicker from './DatePicker.js';

class Booking {
  constructor(bookingElem) {
    this.render(bookingElem);
    this.initWidgets();
  }

  render(bookingElem) {
    const generatedHTML = templates.bookingWidget();

    this.dom = {};

    this.dom.wrapper = bookingElem;
    this.dom.wrapper.innerHTML = generatedHTML;
    this.dom.peopleAmount = this.dom.wrapper.querySelector(select.booking.peopleAmount);
    this.dom.hoursAmount = this.dom.wrapper.querySelector(select.booking.hoursAmount);
    this.dom.datePicker = this.dom.wrapper.querySelector(select.widgets.datePicker.wrapper);
    console.log('this.dom.datePicker', this.dom.datePicker);
  }

  initWidgets() {
    this.peopleAmount = new AmountWidget(this.dom.peopleAmount);
    this.hoursAmount = new AmountWidget(this.dom.hoursAmount);

    this.datePicker = new DatePicker(this.dom.datePicker);
    console.log('datePicker', this.datePicker);
  }

}

export default Booking;
