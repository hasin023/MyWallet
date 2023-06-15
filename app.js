"use strict";

//DOM Elements
const typeInput = document.querySelector(".add__type");
const descriptionInput = document.querySelector(".add__description");
const valueInput = document.querySelector(".add__value");
const AddBtn = document.querySelector(".add__btn");
const incomeContainer = document.querySelector(".income__list");
const expensesContainer = document.querySelector(".expenses__list");
///////////////////////////////////

// Class

class Expense {
  constructor(id, description, value) {
    this.id = id;
    this.description = description;
    this.value = value;
  }
}

class Income {
  constructor(id, description, value) {
    this.id = id;
    this.description = description;
    this.value = value;
  }
}

// Budget Controller
const budgetController = (function () {
  let data = {
    allItems: {
      exp: [],
      inc: [],
    },
    totals: {
      exp: 0,
      inc: 0,
    },
  };

  return {
    addItem: function (type, des, val) {
      let newItem, ID;

      if (data.allItems[type].length > 0) {
        ID = data.allItems[type][data.allItems[type].length - 1].id + 1;
      } else {
        ID = 0;
      }

      if (type === "exp") {
        newItem = new Expense(ID, des, val);
      } else if (type === "inc") {
        newItem = new Income(ID, des, val);
      }

      data.allItems[type].push(newItem);

      return newItem;
    },
  };
})();

// UI Controller
const uiController = (function () {
  return {
    getInput: function () {
      return {
        type: typeInput.value,
        description: descriptionInput.value,
        value: valueInput.value,
      };
    },

    addListItem: function (obj, type) {
      let html;

      if (type === "inc") {
        html = `
          <div class="item clearfix" id="${obj.id}">
          <div class="item__description">${obj.description}</div>
          <div class="right clearfix">
          <div class="item__value">${obj.value}</div>
          <div class="item__delete">
          <button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button>
          </div>
          </div>
          </div>
          `;
      } else if (type === "exp") {
        html = `
          <div class="item clearfix" id="${obj.id}">
          <div class="item__description">${obj.description}</div>
          <div class="right clearfix">
          <div class="item__value">${obj.value}</div>
          <div class="item__percentage">21%</div>
          <div class="item__delete">
          <button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button>
          </div>
          </div>
          </div>
          `;
      }

      // Insert the HTML into the DOM

      if (type === "inc") {
        incomeContainer.insertAdjacentHTML("beforeend", html);
      } else if (type === "exp") {
        expensesContainer.insertAdjacentHTML("beforeend", html);
      }
    },
  };
})();

// Global App Controller
const controller = (function (budgetCtrl, uiCtrl) {
  const setupEventListeners = function () {
    AddBtn.addEventListener("click", ctrlAddItem);

    document.addEventListener("keypress", function (e) {
      if (e.key === "Enter") {
        ctrlAddItem();
      }
    });
  };

  const ctrlAddItem = function () {
    // Get the field input data
    const input = uiCtrl.getInput();
    //. Add the item to the budget controller
    const newItem = budgetCtrl.addItem(
      input.type,
      input.description,
      input.value
    );
    // Add the item to the UI
    uiCtrl.addListItem(newItem, input.type);
    // Calculate the budget
    // Display the budget on the UI
  };

  return {
    init: function () {
      console.log("Application has started");
      setupEventListeners();
    },
  };
})(budgetController, uiController);

controller.init();
