class BudgetCalculator {
    constructor() {
        this.budgetFeedback = document.getElementById("budget-feedback");
        this.expenseFeedback = document.getElementById("expense-feedback");
        this.noExpensesFeedback = document.getElementById("no-expenses-feedback");
        this.budgetForm = document.getElementById("budget-form");
        this.budgetInput = document.getElementById("budget-input");
        this.budgetAmount = document.getElementById("budget-amount");
        this.expenseAmount = document.getElementById("expense-amount");
        this.balance = document.getElementById("balance");
        this.balanceAmount = document.getElementById("balance-amount");
        this.expenseForm = document.getElementById("expense-form");
        this.expenseNameInput = document.getElementById("expense-name-input");
        this.expenseAmountInput = document.getElementById("expense-amount-input");
        this.expenseList = document.getElementById("expense-list");
        this.expenseItemList = [];
        this.expenseItemID = 0;
    };

    // Total Expense method
    totalExpense() {
      let total = 0;
      if (this.expenseItemList.length > 0) {
        total = this.expenseItemList.reduce(function(totalValue, currentValue) {
          totalValue += currentValue.amount
          return totalValue;
        }, 0);
      }
      this.expenseAmount.textContent = total;
      return total;
    }

    // Show Balance method
    showBalance() {
        const expense = this.totalExpense();
        const total = parseInt(this.budgetAmount.textContent) - expense;
        
        // Change the colour of the balance amount to red if the amount is less than 0
        if (total < 0) {
          this.balance.classList.add("text-danger");
        } else if (total >= 0 && this.balance.classList.contains("text-danger")) {
          this.balance.classList.remove("text-danger");
        }

        this.balanceAmount.textContent = total;
    }

    // Submit Budget Form method
    submitBudgetForm() {
      const value = this.budgetInput.value;
      
      // Display the budget feedback if the data submitted is incorrect
      if (value === "" || value < 0) {
        this.budgetFeedback.classList.remove("d-none");
        this.budgetFeedback.textContent = "Input value cannot be empty or negative.";
        // Hide the expense feedback message after a few seconds
        const self = this;
        setTimeout(function(){
          self.budgetFeedback.classList.add("d-none");
          self.budgetFeedback.textContent = "";
        }, 4000);
      } else {
         // Update the budget amount
        this.budgetAmount.textContent = value;
        // Clear the form
        this.budgetInput.value = "";
        // Calculate and disply the balance
        this.showBalance();
      }
    }

    // Add Expense method
    addExpense(expense) {
      // Create and add a new HTML expense item to the expense list table
      const tr = document.createElement("tr");
      tr.innerHTML = `<td>
                        <h3>${expense.name}</h3>
                      </td>
                      <td>
                        <h3>$ ${expense.amount}</h3>
                      </td>
                      <td>
                        <a href="#" class="btn btn-outline-secondary edit" data-id="${expense.id}">Edit</a>
                        <a href="#" class="btn btn-outline-danger delete" data-id="${expense.id}">Delete</a>
                      </td>`
      ;
      this.expenseList.appendChild(tr);

      // Remove the no expenses feedback if it is still showing
      if (!this.noExpensesFeedback.classList.contains("d-done")){
        this.noExpensesFeedback.classList.add("d-none");
        this.noExpensesFeedback.textContent = "";
      }
    }

    // Submit Expense Form method
    submitExpenseForm() {
      const expenseNameValue = this.expenseNameInput.value;
      const expenseAmountValue = this.expenseAmountInput.value;
      
      // Display the expense feedback if the data submitted is incorrect
      if (expenseNameValue === "" || expenseAmountValue === "" || expenseAmountValue < 0) {
        this.expenseFeedback.classList.remove("d-none");
        this.expenseFeedback.textContent = "Values cannot be empty or negative.";
        // Hide the expense feedback message after a few seconds
        const self = this;
        setTimeout(function(){
          self.expenseFeedback.classList.add("d-none");
          self.expenseFeedback.textContent = "";
        }, 4000);
      } else {
        let amount = parseInt(expenseAmountValue);
        // Clear the form
        this.expenseNameInput.value = "";
        this.expenseAmountInput.value = "";

        // Create a new expense object with the submitted values
        let expense = {
          id: this.expenseItemID,
          name: expenseNameValue,
          amount: amount
        }
        
        // Increment the ID
        this.expenseItemID++;
        // Add the new expense object to the expenseItemList array
        this.expenseItemList.push(expense);
        // Add the expense the expense list table
        this.addExpense(expense);
        // Calculate and disply the balance
        this.showBalance();
      }
    }

    // Edit Expense method
    editExpense(element) {
      let id = parseInt(element.dataset.id);
      let parent = element.parentElement;

      // Remove the listed expense item from the DOM
      this.expenseList.removeChild(parent.parentElement);

      // Get the item with the matching ID from the expenseItemList array
      let expense = this.expenseItemList.filter(function(item){
        return item.id === id;
      });
      // Populate the expense form fields with the relevant item values
      this.expenseNameInput.value = expense[0].name;
      this.expenseAmountInput.value = expense[0].amount;
      this.expenseNameInput.focus();

      // Remove the item being edited and update the expenseItemList array
      let tempList = this.expenseItemList.filter(function(item){
        return item.id !== id;
      });
      this.expenseItemList = tempList;
      
      // Update the balance amount
      this.showBalance();
      
      // Display feedback if there are no expenses and reset expenseItemID
      if (this.totalExpense() <= 0 && this.noExpensesFeedback.classList.contains("d-none")) {
        this.noExpensesFeedback.textContent = "No expenses added to the list.";
        this.noExpensesFeedback.classList.remove("d-none");
        this.expenseItemID = 0;
      }
    }
    
    // Delete expense method
    deleteExpense(element) {
      let id = parseInt(element.dataset.id);
      let parent = element.parentElement;
      this.expenseList.removeChild(parent.parentElement);

      // Remove the item being deleted and update the expenseItemList array
      let tempList = this.expenseItemList.filter(function(item){
        return item.id !== id;
      });
      this.expenseItemList = tempList;
      
      // Update the balance amount
      this.showBalance();

      // Display feedback if there are no expenses and reset expenseItemID
      if (this.totalExpense() <= 0 && this.noExpensesFeedback.classList.contains("d-none")) {
        this.noExpensesFeedback.textContent = "No expenses added to the list.";
        this.noExpensesFeedback.classList.remove("d-none");
        this.expenseItemID = 0;
      }
    }

}

function eventListeners() {
  const budgetForm = document.getElementById("budget-form");
  const expenseForm = document.getElementById("expense-form");
  const expenseList = document.getElementById("expense-list");

  // New instance of the BudgetCalculator class
  const budgetCalculator = new BudgetCalculator();

  // Budget form submit event listener
  budgetForm.addEventListener("submit", function(event) {
    event.preventDefault();
    budgetCalculator.submitBudgetForm();
  });

  // Expense form submit event listener
  expenseForm.addEventListener("submit", function(event) {
    event.preventDefault();
    budgetCalculator.submitExpenseForm();
  });

  // Edit/delete expense button click event listener
  expenseList.addEventListener("click", function(event) {
    if (event.target.classList.contains("edit")) {
      event.preventDefault();
      budgetCalculator.editExpense(event.target);
    } else if (event.target.classList.contains("delete")) {
      event.preventDefault();
      budgetCalculator.deleteExpense(event.target);
    }
  });

}

document.addEventListener("DOMContentLoaded", function(){
  eventListeners();
});