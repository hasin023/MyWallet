"use strict";

//DOM Elements
const typeInput = document.querySelector(".add__type");
const descriptionInput = document.querySelector(".add__description");
const valueInput = document.querySelector(".add__value");
const AddBtn = document.querySelector(".add__btn");
const incomeContainer = document.querySelector(".income__list");
const expensesContainer = document.querySelector(".expenses__list");
const budgetValue = document.querySelector(".budget__value");
const budgetIncomeValue = document.querySelector(".budget__income--value");
const budgetExpensesValue = document.querySelector(".budget__expenses--value");
const budgetExpensesPercentage = document.querySelector(
  ".budget__expenses--percentage"
);
const container = document.querySelector(".container");
///////////////////////////////////

// Class

class Expense {
  constructor(id, description, value) {
    this.id = id;
    this.description = description;
    this.value = value;
    this.percentage = -1;
  }

  calcPercentage(totalIncome) {
    if (totalIncome > 0) {
      this.percentage = Math.round((this.value / totalIncome) * 100);
    } else {
      this.percentage = -1;
    }
  }

  getPercentage() {
    return this.percentage;
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

    deleteItem: function (type, id) {
      let ids, index;
      ids = data.allItems[type].map(function (current) {
        return current.id;
      });
      index = ids.indexOf(id);
      if (index !== -1) {
        data.allItems[type].splice(index, 1);
      }
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

    calculatePercentages: function () {
      // Calculate percentages
      data.allItems.exp.forEach(function (current) {
        current.calcPercentage(data.totals.inc);
      });
    },

    getPercentages: function () {
      // Read percentages from the budget controller
      const allPerc = data.allItems.exp.map(function (current) {
        return current.getPercentage();
      });
      return allPerc;
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
  const formatNumber = function (num, type) {
    let numSplit, int, dec;
    num = Math.abs(num);
    num = num.toFixed(2);
    numSplit = num.split(".");
    int = numSplit[0];
    if (int.length > 3) {
      int = int.substr(0, int.length - 3) + "," + int.substr(int.length - 3, 3);
    }
    dec = numSplit[1];
    return (type === "exp" ? "-" : "+") + " " + int + "." + dec;
  };

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
          <div class="item clearfix" id="inc-${obj.id}">
          <div class="item__description">${obj.description}</div>
          <div class="right clearfix">
          <div class="item__value">${formatNumber(obj.value, type)}</div>
          <div class="item__delete">
          <button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button>
          </div>
          </div>
          </div>
          `;
      } else if (type === "exp") {
        html = `
          <div class="item clearfix" id="exp-${obj.id}">
          <div class="item__description">${obj.description}</div>
          <div class="right clearfix">
          <div class="item__value">${formatNumber(obj.value, type)}</div>
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

    deleteListItem: function (selectorID) {
      const el = document.getElementById(selectorID);
      el.parentNode.removeChild(el);
    },

    clearFields: function () {
      descriptionInput.value = "";
      valueInput.value = "";
      descriptionInput.focus();
    },

    displayBudget: function (obj) {
      let type;

      if (obj.budget > 0) {
        type = "inc";
      } else {
        type = "exp";
      }

      budgetValue.textContent = formatNumber(obj.budget, type);
      budgetIncomeValue.textContent = formatNumber(obj.totalIncome, "inc");
      budgetExpensesValue.textContent = formatNumber(obj.totalExpenses, "exp");

      if (obj.percentage > 0) {
        budgetExpensesPercentage.textContent = obj.percentage + "%";
      } else {
        budgetExpensesPercentage.textContent = "---";
      }
    },

    displayPercentages: function (percentages) {
      const fields = document.querySelectorAll(".item__percentage");

      const nodeListForEach = function (list, callback) {
        for (let i = 0; i < list.length; i++) {
          callback(list[i], i);
        }
      };

      nodeListForEach(fields, function (current, index) {
        if (percentages[index] > 0) {
          current.textContent = percentages[index] + "%";
        } else {
          current.textContent = "---";
        }
      });
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

    container.addEventListener("click", ctrlDeleteItem);
  };

  const updateBudget = function () {
    // Calculate the budget
    budgetController.calculateBudget();

    // Return the budget
    const budget = budgetController.getBudget();

    // Display the budget on the UI
    uiCtrl.displayBudget(budget);
  };

  const updatePercentages = function () {
    // Calculate percentages
    budgetCtrl.calculatePercentages();

    // Read percentages from the budget controller
    const percentages = budgetCtrl.getPercentages();

    // Update the UI with the new percentages
    uiCtrl.displayPercentages(percentages);
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

    // Calculate and update percentages
    updatePercentages();
  };

  const ctrlDeleteItem = function (e) {
    let itemID, splitID, type, id;
    itemID = e.target.parentNode.parentNode.parentNode.parentNode.id;
    console.log(itemID);

    if (itemID) {
      splitID = itemID.split("-");
      type = splitID[0];
      id = parseInt(splitID[1]);
    }

    // Delete the item from the data structure
    budgetCtrl.deleteItem(type, id);

    // Delete the item from the UI
    uiCtrl.deleteListItem(itemID);

    // Update and show the new budget
    updateBudget();

    // Calculate and update percentages
    updatePercentages();
  };

  return {
    init: function () {
      console.log("Application has started");
      setupEventListeners();
    },
  };
})(budgetController, uiController);

controller.init();
