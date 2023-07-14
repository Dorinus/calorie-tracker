class CalorieTracker {
  constructor() {
    this._calorieLimit = Storage.getCalorieLimit();
    this._totalCalories = Storage.getTotalCalories(0);
    this._meals = Storage.getMeals();
    this._workouts = Storage.getWorkouts();

    this._displayCaloriesTotal();
    this._displayCaloriesLimit();
    this._displayCaloriesConsumed();
    this._displayCaloriesBurned();
    this._displayCaloriesRemaining();
    this._displayCaloriesProgress();
  }

  addMeal(meal) {
    this._meals.push(meal);
    this._totalCalories += meal.calories;
    Storage.updateTotalCalories(this._totalCalories);
    Storage.addMeal(meal);
    this._displayNewMeal(meal);
    this._render();
  }

  addWorkout(workout) {
    this._workouts.push(workout);
    this._totalCalories -= workout.calories;
    Storage.updateTotalCalories(this._totalCalories);
    Storage.addWorkout(workout);
    this._displayNewWorkout(workout);
    this._render();
  }

  removeMeal(id) {
    const mealIndex = this._meals.findIndex((meal) => meal.id === id);
    const meal = this._meals[mealIndex];
    this._meals.splice(mealIndex, 1);
    this._totalCalories -= meal.calories;
    Storage.updateTotalCalories(this._totalCalories);
    Storage.removeMeal(id);
    this._render();
  }

  removeWorkout(id) {
    const workoutIndex = this._workouts.findIndex(
      (workout) => workout.id === id
    );
    const workout = this._workouts[workoutIndex];
    this._workouts.splice(workoutIndex, 1);
    this._totalCalories += workout.calories;
    Storage.updateTotalCalories(this._totalCalories);
    Storage.removeWorkout(id);
    this._render();
  }

  reset() {
    this._totalCalories = 0;
    this._meals = [];
    this._workouts = [];
    Storage.reset();
    this._render();
  }

  setLimit(calorieLimit) {
    this._calorieLimit = calorieLimit;
    Storage.setCalorieLimit(calorieLimit);
    this._displayCaloriesLimit();
    this._render();
  }

  loadItems() {
    this._meals.forEach((meal) => this._displayNewMeal(meal));
    this._workouts.forEach((workout) => this._displayNewWorkout(workout));
  }

  _displayCaloriesTotal() {
    const totalCalorieElement = document.getElementById('calories-total');
    totalCalorieElement.innerHTML = this._totalCalories;
  }

  _displayCaloriesLimit() {
    const limitCalorieElement = document.getElementById('calories-limit');
    limitCalorieElement.innerHTML = this._calorieLimit;
  }

  _displayCaloriesConsumed() {
    const consumedCalorieElement = document.getElementById('calories-consumed');
    const consumed = this._meals.reduce(
      (total, meal) => total + meal.calories,
      0
    );
    consumedCalorieElement.innerHTML = consumed;
  }

  _displayCaloriesBurned() {
    const burnedCalorieElement = document.getElementById('calories-burned');
    const burned = this._workouts.reduce(
      (total, meal) => total + meal.calories,
      0
    );
    burnedCalorieElement.innerHTML = burned;
  }

  _displayCaloriesRemaining() {
    const caloriesRemainingElement =
      document.getElementById('calories-remaining');
    const remaining = this._calorieLimit - this._totalCalories;
    caloriesRemainingElement.innerHTML = remaining;
    const progressElement = document.getElementById('calorie-progress');

    if (remaining < 0) {
      caloriesRemainingElement.parentElement.parentElement.classList.remove(
        'bg-light'
      );
      caloriesRemainingElement.parentElement.parentElement.classList.add(
        'bg-danger'
      );
      progressElement.classList.remove('bg-success');
      progressElement.classList.add('bg-danger');
    } else {
      caloriesRemainingElement.parentElement.parentElement.classList.add(
        'bg-light'
      );
      caloriesRemainingElement.parentElement.parentElement.classList.remove(
        'bg-danger'
      );
      progressElement.classList.remove('bg-danger');
      progressElement.classList.add('bg-success');
    }
  }

  _displayCaloriesProgress() {
    const progressEl = document.getElementById('calorie-progress');
    const percentage = (this._totalCalories / this._calorieLimit) * 100;
    const width = Math.min(percentage, 100);
    progressEl.style.width = `${width}%`;
  }

  _displayNewMeal(meal) {
    const mealList = document.getElementById('meal-items');
    const mealEl = document.createElement('div');
    mealEl.classList.add('card', 'my-2');
    mealEl.setAttribute('data-id', meal.id);
    mealEl.innerHTML = `
    <div class="card-body">
    <div class="d-flex align-items-center justify-content-between">
      <h4 class="mx-1">${meal.name}</h4>
      <div
        class="fs-1 bg-primary text-white text-center rounded-2 px-2 px-sm-5"
      >
        ${meal.calories}
      </div>
      <button class="delete btn btn-danger btn-sm mx-2">
        <i class="fa-solid fa-xmark"></i>
      </button>
    </div>
  </div>
    `;

    mealList.appendChild(mealEl);
  }

  _displayNewWorkout(workout) {
    const workoutList = document.getElementById('workout-items');
    const workoutEl = document.createElement('div');
    workoutEl.classList.add('card', 'my-2');
    workoutEl.setAttribute('data-id', workout.id);
    workoutEl.innerHTML = `
    <div class="card-body">
    <div class="d-flex align-items-center justify-content-between">
      <h4 class="mx-1">${workout.name}</h4>
      <div
        class="fs-1 bg-secondary text-white text-center rounded-2 px-2 px-sm-5"
      >
        ${workout.calories}
      </div>
      <button class="delete btn btn-danger btn-sm mx-2">
        <i class="fa-solid fa-xmark"></i>
      </button>
    </div>
  </div>
    `;

    workoutList.appendChild(workoutEl);
  }

  _render() {
    this._displayCaloriesTotal();
    this._displayCaloriesConsumed();
    this._displayCaloriesBurned();
    this._displayCaloriesRemaining();
    this._displayCaloriesProgress();
  }
}

class Meal {
  constructor(name, calories) {
    this.id = Math.random().toString(16).slice(2);
    this.name = name;
    this.calories = calories;
  }
}

class Workout {
  constructor(name, calories) {
    this.id = Math.random().toString(16).slice(2);
    this.name = name;
    this.calories = calories;
  }
}

class Storage {
  static getCalorieLimit(defaultLimit = 2000) {
    let calorieLimit;
    if (localStorage.getItem('calorieLimit') === null) {
      calorieLimit = defaultLimit;
    } else {
      calorieLimit = +localStorage.getItem('calorieLimit');
    }
    return calorieLimit;
  }

  static setCalorieLimit(calorieLimit) {
    localStorage.setItem('calorieLimit', calorieLimit);
  }

  static getTotalCalories(defaultCalories = 0) {
    let totalCalories;
    if (localStorage.getItem('totalCalories') === null) {
      totalCalories = defaultCalories;
    } else {
      totalCalories = +localStorage.getItem('totalCalories');
    }
    return totalCalories;
  }

  static updateTotalCalories(calories) {
    localStorage.setItem('totalCalories', calories);
  }

  static getMeals() {
    let meals;
    if (localStorage.getItem('meals') === null) {
      meals = [];
    } else {
      meals = JSON.parse(localStorage.getItem('meals'));
    }
    return meals;
  }

  static addMeal(meal) {
    const meals = Storage.getMeals();
    meals.push(meal);
    localStorage.setItem('meals', JSON.stringify(meals));
  }

  static removeMeal(id) {
    const meals = Storage.getMeals();
    const filteredMeals = meals.filter((meal) => meal.id !== id);
    localStorage.setItem('meals', JSON.stringify(filteredMeals));
  }

  static getWorkouts() {
    let workouts;
    if (localStorage.getItem('workouts') === null) {
      workouts = [];
    } else {
      workouts = JSON.parse(localStorage.getItem('workouts'));
    }
    return workouts;
  }

  static addWorkout(workout) {
    const workouts = Storage.getWorkouts();
    workouts.push(workout);
    localStorage.setItem('workouts', JSON.stringify(workouts));
  }

  static removeWorkout(id) {
    const workouts = Storage.getWorkouts();
    const filteredWorkouts = workouts.filter((workout) => workout.id !== id);
    localStorage.setItem('workouts', JSON.stringify(filteredWorkouts));
  }

  static reset() {
    localStorage.clear();
  }
}

class App {
  constructor() {
    this._tracker = new CalorieTracker();
    this._tracker.loadItems();

    this._loadEventListeners();
  }

  _loadEventListeners() {
    document
      .getElementById('meal-form')
      .addEventListener('submit', this._newItem.bind(this, 'meal'));

    document
      .getElementById('workout-form')
      .addEventListener('submit', this._newItem.bind(this, 'workout'));

    document
      .getElementById('meal-items')
      .addEventListener('click', this.removeItem.bind(this, 'meal'));

    document
      .getElementById('workout-items')
      .addEventListener('click', this.removeItem.bind(this, 'workout'));

    document
      .getElementById(`filter-meals`)
      .addEventListener(`keyup`, this._filterItems.bind(this, `meal`));

    document
      .getElementById(`filter-workouts`)
      .addEventListener(`keyup`, this._filterItems.bind(this, `workout`));

    document
      .getElementById('reset')
      .addEventListener('click', this._reset.bind(this));

    document
      .getElementById('limit-form')
      .addEventListener('submit', this._setLimit.bind(this));
  }

  _newItem(type, e) {
    e.preventDefault();

    const name = document.getElementById(`${type}-name`);
    const calories = document.getElementById(`${type}-calories`);

    if (name === '' || calories === '') {
      alert('Please fill in the form');
      return;
    }

    if (type === 'meal') {
      const meal = new Meal(name.value, +calories.value);
      this._tracker.addMeal(meal);
    } else {
      const workout = new Workout(name.value, +calories.value);
      this._tracker.addWorkout(workout);
    }

    name.value = '';
    calories.value = '';

    const collapse = document.getElementById(`collapse-${type}`);
    const bsCollapse = new bootstrap.Collapse(collapse, { toggle: true });
  }

  removeItem(type, e) {
    if (
      e.target.classList.contains('delete') ||
      e.target.classList.contains('fa-xmark')
    ) {
      const id = e.target.closest(`.card`).getAttribute('data-id');
      type === 'meal'
        ? this._tracker.removeMeal(id)
        : this._tracker.removeWorkout(id);

      e.target.closest(`.card`).remove();
    }
  }

  _filterItems(type, e) {
    const input = e.target.value.toLowerCase();
    const items = document.querySelectorAll(`#${type}-items .card`);

    items.forEach((item) => {
      const name =
        item.firstElementChild.firstElementChild.textContent.toLowerCase();
      if (name.indexOf(input) === -1) {
        item.style.display = `none`;
      } else {
        item.style.display = `block`;
      }
    });
  }

  _reset() {
    this._tracker.reset();
    document.getElementById('meal-items').innerHTML = '';
    document.getElementById('workout-items').innerHTML = '';
    document.getElementById('filter-meals').value = '';
    document.getElementById('filter-workouts').value = '';
  }

  _setLimit(e) {
    e.preventDefault();
    const limit = document.getElementById('limit');

    if (limit.value === '') {
      alert('Please enter a limit');
      return;
    }
    this._tracker.setLimit(limit.value);
    limit.value = '';

    const modalEl = document.getElementById('limit-modal');
    const modal = bootstrap.Modal.getInstance(modalEl);
    modal.hide();
  }
}

const app = new App();
