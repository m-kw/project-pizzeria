import {select, templates, classNames, settings} from './../settings.js';
import {utils} from './../utils.js';
import AmountWidget from './AmountWidget.js';

class Product {
  constructor(id, data) {
    const thisProduct = this;

    thisProduct.id = id;
    thisProduct.data = data;

    thisProduct.renderInMenu();
    thisProduct.getElements();
    thisProduct.initAccordion();
    thisProduct.initOrderForm();
    thisProduct.initAmountWidget();
    thisProduct.processOrder();

    //console.log('new product: ', thisProduct);
  }

  renderInMenu() {
    const thisProduct = this;

    /* generate HTML based on template */
    const generatedHTML = templates.menuProduct(thisProduct.data);
    //// console.log('generated HTML: ', generatedHTML);

    /* create element using utils.createElementFromHTML */
    thisProduct.element = utils.createDOMFromHTML(generatedHTML);

    /* find menu container */
    const menuContainer = document.querySelector(select.containerOf.menu);

    /* add element to menu */
    menuContainer.appendChild(thisProduct.element);
  }

  getElements() {
    const thisProduct = this;

    thisProduct.accordionTrigger = thisProduct.element.querySelector(select.menuProduct.clickable);
    thisProduct.form = thisProduct.element.querySelector(select.menuProduct.form);
    thisProduct.formInputs = thisProduct.element.querySelectorAll(select.all.formInputs);
    thisProduct.cartButton = thisProduct.element.querySelector(select.menuProduct.cartButton);
    thisProduct.priceElem = thisProduct.element.querySelector(select.menuProduct.priceElem);
    thisProduct.imageWrapper = thisProduct.element.querySelector(select.menuProduct.imageWrapper);
    thisProduct.amountWidgetElement = thisProduct.element.querySelector(select.menuProduct.amountWidget);
  }

  initAccordion() {
    const thisProduct = this;

    /* find the clickable trigger
    const trigger = thisProduct.element.querySelector(select.menuProduct.clickable);
    // console.log('trigger: ', trigger); */

    /* START: click event listener to trigger */
    thisProduct.accordionTrigger.addEventListener('click', function(event) {
      event.preventDefault();

      thisProduct.element.classList.toggle(classNames.menuProduct.wrapperActive);

      const activeProducts = document.querySelectorAll(select.all.menuProductsActive);

      for (let activeProduct of activeProducts) {
        if (activeProduct !== thisProduct.element) {
          activeProduct.classList.remove(classNames.menuProduct.wrapperActive);
        }
      }
    });
  }

  initOrderForm() {
    const thisProduct = this;
    // console.log('initOrderForm');

    thisProduct.form.addEventListener('submit', function(event) {
      event.preventDefault();
      thisProduct.processOrder();
    });

    for (let input of thisProduct.formInputs) {
      input.addEventListener('change', function() {
        thisProduct.processOrder();
      });
    }

    thisProduct.cartButton.addEventListener('click', function(event) {
      event.preventDefault();
      thisProduct.processOrder();
      thisProduct.addToCart();
      thisProduct.setDefault();
    });
  }

  processOrder() {
    const thisProduct = this;
    // console.log('processOrder');

    const formData = utils.serializeFormToObject(thisProduct.form);
    // console.log('formData: ', formData);

    thisProduct.params = {};

    /* set price const with default price - thisProduct.data.price */
    let price = thisProduct.data.price;
    // console.log('price: ', price);

    /* START LOOP: for all params */
    const params = thisProduct.data.params;
    // console.log('params: ', params);

    for (let paramID in params) {
      const param = params[paramID];
      // console.log('param: ', param);
      // console.log('paramID: ', paramID);

      /* START LOOP: for all options of each param */
      for (let optionID in param.options) {
        const option = param.options[optionID];
        // console.log('option: ', option);
        // console.log('optionID: ', optionID);
        // console.log('options price: ', option.price);

        /* set checked option const - check if the option is checked */
        const checkedOption = formData.hasOwnProperty(paramID) && formData[paramID].indexOf(optionID) > -1;
        // console.log('checkedOption: ', checkedOption);

        /* START if checked option isn't default, increase price by option's price */
        if (checkedOption && !option.default) {
          price += option.price;
          // console.log('price: ', price);

          /* if default option isn't checked, decrease proce by option's price */
        } else if (option.default && !checkedOption) {
          price -= option.price;
          // console.log('price: ', price);
        }

        const images = thisProduct.imageWrapper.querySelectorAll('.' + paramID + '-' + optionID);
        // console.log('images: ', images);

        // if (checkedOption) {
        //   for (let image of images) {
        //     image.classList.add(classNames.menuProduct.imageVisible);
        //   }
        // } else {
        //   for (let image of images) {
        //     image.classList.remove(classNames.menuProduct.imageVisible);
        //   }
        // }

        for (let image of images) {
          if (checkedOption) {
            if (!thisProduct.params[paramID]) {
              thisProduct.params[paramID] = {
                label: param.label,
                options: {},
              };
            }
            thisProduct.params[paramID].options[optionID] = option.label;
            image.classList.add(classNames.menuProduct.imageVisible);
          } else {
            image.classList.remove(classNames.menuProduct.imageVisible);
          }
        }
      }
    }

    thisProduct.priceSingle = price;
    thisProduct.price = thisProduct.priceSingle * thisProduct.amountWidget.value;

    thisProduct.priceElem.innerHTML = thisProduct.price;

    //console.log('thisProduct.params', thisProduct.params);
  }

  initAmountWidget() {
    const thisProduct = this;

    thisProduct.amountWidget = new AmountWidget(thisProduct.amountWidgetElement);

    thisProduct.amountWidgetElement.addEventListener('updated', function() {
      thisProduct.processOrder();
    });
  }

  addToCart() {
    const thisProduct = this;

    thisProduct.name = thisProduct.data.name;
    thisProduct.amount = thisProduct.amountWidget.value;

    //app.cart.add(thisProduct);

    const event = new CustomEvent('add-to-cart', {
      bubbles: true,
      detail: {
        product: thisProduct,
      },
    });

    thisProduct.element.dispatchEvent(event);
  }

  setDefault() {
    const thisProduct = this;
    const formInputsArray = Array.prototype.slice.call(this.formInputs);
    this.selectElements(formInputsArray, 'checked');

    thisProduct.amount = settings.amountWidget.defaultValue;
    thisProduct.amountElem = thisProduct.element.querySelector(select.widgets.amount.input);
    thisProduct.amountElem.value = thisProduct.amount;

  }

  selectElements(elementsArray, toggleAttribute) {
    const params = this.data.params;
    for (let paramID in params) {
      const param = params[paramID];

      for (let optionID in param.options) {
        // console.log('optionID', optionID);
        const option = param.options[optionID];
        const inputToCheck = elementsArray.find(el => el.id === optionID);
        if (inputToCheck) {
          inputToCheck[toggleAttribute] = option.default;
        }
      }
    }
  }
}

export default Product;
