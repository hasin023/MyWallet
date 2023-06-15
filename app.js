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
  const calculateTotal = function (type) {
    let sum = 0;
    data.allItems[type].forEach(function (current) {
      sum += current.value;
    });
    data.totals[type] = sum;
  };

  let data = {
    allItems: {
      exp: [],
      inc: [],
    },
    totals: {
      exp: 0,
      inc: 0,
    },
    budget: 0,
    percentage: -1,
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

    calculateBudget: function () {
      // Calculate total income and expenses
      calculateTotal("exp");
      calculateTotal("inc");
      // Calculate the budget: income - expenses
      data.budget = data.totals.inc - data.totals.exp;
      // Calculate the percentage of income that we spent
      if (data.totals.inc > 0) {
        data.percentage = Math.round((data.totals.exp / data.totals.inc) * 100);
      } else {
        data.percentage = -1;
      }
    },

    getBudget: function () {
      return {
        budget: data.budget,
        totalIncome: data.totals.inc,
        totalExpenses: data.totals.exp,
        percentage: data.percentage,
      };
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
        value: parseFloat(valueInput.value),
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

    clearFields: function () {
      descriptionInput.value = "";
      valueInput.value = "";
      descriptionInput.focus();
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

  const updateBudget = function () {
    // Calculate the budget
    budgetController.calculateBudget();
    // Return the budget
    const budget = budgetController.getBudget();
    // Display the budget on the UI
    console.log(budget);
  };

  const ctrlAddItem = function () {
    // Get the field input data
    const input = uiCtrl.getInput();
    //. Add the item to the budget controller
    if (input.description === "" || isNaN(input.value) || input.value <= 0) {
      return;
    }
    const newItem = budgetCtrl.addItem(
      input.type,
      input.description,
      input.value
    );
    // Add the item to the UI
    uiCtrl.addListItem(newItem, input.type);
    // Clear the fields
    uiCtrl.clearFields();
    // Calculate and update budget
    updateBudget();
  };

  return {
    init: function () {
      console.log("Application has started");
      setupEventListeners();
    },
  };
})(budgetController, uiController);

controller.init();
