let customerId = 0;
let mealId = 0;
let deliveryId = 0;
let employerId = 0;

const store = { customers: [], meals: [], deliveries: [], employers: [] };

class Customer {
  constructor(name, employer = {}) {
    this.id = ++customerId;
    this.name = name;
    this.employerId = employer.id;
    store.customers.push(this);
  }

  meals() {
    return this.deliveries().map(delivery => {
      return delivery.meal();
    });
  }

  deliveries() {
    return store.deliveries.filter(delivery => {
      return delivery.customerId === this.id;
    });
  }

  // reduceMealPrice(agg, el, i, arr) { //how is this not defined when used below?
  //   return agg + el.price;
  // }
  totalSpent() {
    return this.meals().reduce(function(agg, el, i, arr) {
      return agg + el.price;
    }, 0);
  }
}

class Meal {
  constructor(title, price) {
    this.id = ++mealId;
    this.title = title;
    this.price = price;
    store.meals.push(this);
  }

  deliveries() {
    return store.deliveries.filter(
      function(delivery) {
        return delivery.mealId === this.id;
      }.bind(this)
    );
  }

  customers() {
    return this.deliveries().map(function(delivery) {
      return delivery.customer();
    });
  }

  static byPrice() {
    return store.meals.sort(function(a, b) {
      return b.price - a.price;
    });
  }
}

class Delivery {
  constructor(meal, customer) {
    this.id = ++deliveryId;
    if (meal) {
      //this conditional is showing that arguments dont need to be passed in. conditionals are here to pass tests.  Makes no sense in real world to have a delivery join table that doesnt need the data from the tables its joining
      this.mealId = meal.id;
      if (customer) {
        this.customerId = customer.id;
      }
    }
    store.deliveries.push(this);
  }
  setMeal() {
    this.mealId = meal.id;
  }
  setCustomer() {
    this.customerId = customer.id;
  }

  meal() {
    return store.meals.find(meal => {
      return meal.id === this.mealId;
    });
  }

  customer() {
    return store.customers.find(customer => {
      return customer.id === this.customerId;
    });
  }
}

class Employer {
  constructor(name) {
    this.id = ++employerId;
    this.name = name;
    store.employers.push(this);
  }

  employees() {
    return store.customers.filter(customer => {
      return customer.employerId == this.id;
    });
  }

  deliveries() {
    return this.employees().map(function(employee) {
      return employee.deliveries()[0];
    });
  }
  deliveries() {
    let allDeliveries = this.employees().map(employee => {
      return employee.deliveries();
    });
    let merged = [].concat.apply([], allDeliveries);
    return merged;
  }

  meals() {
    const allMeals = this.deliveries().map(function(delivery) {
      return delivery.meal();
    });
    return allMeals.filter(function(item, position) {
      return allMeals.indexOf(item) === position; //if the index of the item is the same as the position, its the first time its been seen.  Else, its a duplicate, and will return false
      // filter is called with 3 arguments. the value of the element, the index, and the ful array being traversed. position is the index argument.
    });
  }

  mealTotals() {
    let result = {};
    let totalMeals = this.deliveries().map(delivery => {
      return delivery.meal();
    });
    // debugger;
    totalMeals.forEach(meal => {
      result[meal.id] = 0;
      // debugger;
    }); //set keys of each unique meal.id, and values of each to 0
    totalMeals.forEach(meal => {
      result[meal.id] += 1;
      // debugger;
    }); // go back through, and increment each time a meal.id occurs.
    // debugger;
    return result;
  }
}
