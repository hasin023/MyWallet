"use strict";

//DOM Elements
const typeInput = document.querySelector(".add__type");
const descriptionInput = document.querySelector(".add__description");
const valueInput = document.querySelector(".add__value");
const AddBtn = document.querySelector(".add__btn");
///////////////////////////////////

//Variabless
let budget, income, expenses;

// Budget Controller
const budgetController = (function () {
  // Some code
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
    // 1. Get the field input data
    const input = uiCtrl.getInput();
    // 2. Add the item to the budget controller
    // 3. Add the item to the UI
    // 4. Calculate the budget
    // 5. Display the budget on the UI
  };

  return {
    init: function () {
      console.log("Application has started");
      setupEventListeners();
    },
  };
})(budgetController, uiController);

controller.init();
