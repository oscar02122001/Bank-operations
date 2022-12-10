'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

/////////////////////////////////////////////////
// Data

// DIFFERENT DATA! Contains movement dates, currency and locale

const account1 = {
  owner: 'Jonas Schmedtmann',
  movements: [200, 455.23, -306.5, 25000, -642.21, -133.9, 79.97, 1300],
  interestRate: 1.2, // %
  pin: 1111,

  movementsDates: [
    '2019-11-18T21:31:17.178Z',
    '2019-12-23T07:42:02.383Z',
    '2020-01-28T09:15:04.904Z',
    '2020-04-01T10:17:24.185Z',
    '2020-05-08T14:11:59.604Z',
    '2020-05-27T17:01:17.194Z',
    '2020-07-11T23:36:17.929Z',
    '2020-07-12T10:51:36.790Z',
  ],
  currency: 'EUR',
  locale: 'pt-PT', // de-DE
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,

  movementsDates: [
    '2019-11-01T13:15:33.035Z',
    '2019-11-30T09:48:16.867Z',
    '2019-12-25T06:04:23.907Z',
    '2020-01-25T14:18:46.235Z',
    '2020-02-05T16:33:06.386Z',
    '2020-04-10T14:43:26.374Z',
    '2022-10-31T18:49:59.371Z',
    '2022-11-01T12:01:20.894Z',
  ],
  currency: 'USD',
  locale: 'en-US',
};

const accounts = [account1, account2];

/////////////////////////////////////////////////
// Elements
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');
// const movementsDate = document.querySelectorAll('.movements__date')
/////////////////////////////////////////////////
// Functions

const daysMovements = function (date, locale) {

  const calcDayPassed = (day1, day2) => Math.round(Math.abs(day2 - day1) / (1000 * 60 * 60 * 24))
  const daysPassed = calcDayPassed(new Date(), date)

  if (daysPassed === 0) return 'Today'
  if (daysPassed === 1) return 'Yesterday'
  if (daysPassed <= 7) return `${daysPassed} days ago`;
  else {
    // const day = `${date.getDate()}`.padStart(2, 0)
    // const month = `${date.getMonth()+1}`.padStart(2, 0);
    // const year = date.getFullYear()
    // return `${day}/${month}/${year}`
    return Intl.DateTimeFormat(locale).format(date)
  }
}

const formattedMoney = function (value, locale, currency) {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: currency
  }).format(value)
}

const displayMovements = function (acc, sort = false) {
  containerMovements.innerHTML = '';

  const movs = sort ? acc.movements.slice().sort((a, b) => a - b) : acc.movements;

  movs.forEach(function (mov, i) {
    const type = mov > 0 ? 'deposit' : 'withdrawal';

    const date = new Date(acc.movementsDates[i])
    const displayDate = daysMovements(date, acc.locale)

    const formattedMov = formattedMoney(mov, acc.locale, acc.currency)

    const html = `
      <div class="movements__row">
        <div class="movements__type movements__type--${type}">${
      i + 1
    } ${type}</div>
     <div class = "movements__date" >${displayDate}</div>
        <div class="movements__value">${formattedMov}</div>
      </div>
    `;

    containerMovements.insertAdjacentHTML('afterbegin', html);
  });
};

const calcDisplayBalance = function (acc) {
  acc.balance = acc.movements.reduce((acc, mov) => acc + mov, 0);
  const formatBalance = formattedMoney(acc.balance, acc.locale, acc.currency)
  labelBalance.textContent = formatBalance
};

const calcDisplaySummary = function (acc) {
  const incomes = acc.movements
    .filter(mov => mov > 0)
    .reduce((acc, mov) => acc + mov, 0);
  const formatIn = formattedMoney(incomes, acc.locale, acc.currency)
  labelSumIn.textContent = formatIn

  const out = acc.movements
    .filter(mov => mov < 0)
    .reduce((acc, mov) => acc + mov, 0);
  const formatOut = formattedMoney(Math.abs(out), acc.locale, acc.currency)
  labelSumOut.textContent = formatOut

  const interest = acc.movements
    .filter(mov => mov > 0)
    .map(deposit => (deposit * acc.interestRate) / 100)
    .filter((int, i, arr) => {
      // console.log(arr);
      return int >= 1;
    })
    .reduce((acc, int) => acc + int, 0);
  const formatInter = formattedMoney(interest, acc.locale, acc.currency)
  labelSumInterest.textContent = formatInter
  // labelSumInterest.textContent = `${interest.toFixed(2)}€`;
};

const createUsernames = function (accs) {
  accs.forEach(function (acc) {
    acc.username = acc.owner
      .toLowerCase()
      .split(' ')
      .map(name => name[0])
      .join('');
  });
};
createUsernames(accounts);

const updateUI = function (acc) {
  // Display movements
  displayMovements(acc);

  // Display balance
  calcDisplayBalance(acc);

  // Display summary
  calcDisplaySummary(acc);
};


function startCalcTimer() {
  const tick = function () {
    const min = String(Math.floor(time / 60)).padStart(2, 0);
    const sec = String(time % 60).padStart(2, 0);

    labelTimer.textContent = `${min}:${sec}`

    if (time === 0) {
      clearInterval(timerBasic)
      labelWelcome.textContent = 'Log in to get started'
      containerApp.style.opacity = 0;
    }

    time--;
  }
  let time = 120

  tick()

  const timerBasic = setInterval(tick, 1000)
  return timerBasic;
}

///////////////////////////////////////
// Event handlers
let currentAccount, timerBasic;

btnLogin.addEventListener('click', function (e) {
  // Prevent form from submitting
  e.preventDefault();

  if (timerBasic) clearInterval(timerBasic)
  timerBasic = startCalcTimer()

  currentAccount = accounts.find(
    acc => acc.username === inputLoginUsername.value
  );
  console.log(currentAccount);

  if (currentAccount && currentAccount.pin === Number(inputLoginPin.value)) {
    // Display UI and message
    labelWelcome.textContent = `Welcome back, ${
      currentAccount.owner.split(' ')[0]
    }`;
    containerApp.style.opacity = 100;

    const now = new Date()
    // const day = `${now.getDate()}`.padStart(2, 0)
    // const month = `${now.getMonth()+1}`.padStart(2, 0);
    // const year = now.getFullYear()
    // const hour = `${now.getHours()}`.padStart(2, 0);
    // const min = `${now.getMinutes()}`.padStart(2, 0);
    const optonal = {
      hour: 'numeric',
      minute: 'numeric',
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      weekday: 'long',
    }
    // const locale = navigator.language;
    // console.log(locale);
    labelDate.textContent = new Intl.DateTimeFormat(currentAccount.locale, optonal).format(now)
    // labelDate.textContent = `${day}/${month}/${year}, ${hour}:${min}`


    // Clear input fields
    inputLoginUsername.value = inputLoginPin.value = '';
    inputLoginPin.blur();

    // Update UI
    updateUI(currentAccount);
  }
});

btnTransfer.addEventListener('click', function (e) {
  e.preventDefault();
  const amount = Number(inputTransferAmount.value);
  const receiverAcc = accounts.find(
    acc => acc.username === inputTransferTo.value
  );
  inputTransferAmount.value = inputTransferTo.value = '';

  if (
    amount > 0 &&
    receiverAcc &&
    currentAccount.balance >= amount &&
    receiverAcc.username !== currentAccount.username
  ) {
    // Doing the transfer
    currentAccount.movements.push(-amount);
    receiverAcc.movements.push(amount);
    currentAccount.movementsDates.push(new Date())
    receiverAcc.movementsDates.push(new Date())
    // Update UI
    updateUI(currentAccount);

    clearInterval(timerBasic)
    timerBasic = startCalcTimer()
  }
});

btnLoan.addEventListener('click', function (e) {
  e.preventDefault();

  const amount = Number(inputLoanAmount.value);

  if (amount > 0 && currentAccount.movements.some(mov => mov >= amount * 0.1)) {
    // Add movement
    setTimeout(function () {
      currentAccount.movements.push(amount)
      currentAccount.movementsDates.push(new Date())

      // Update UI
      updateUI(currentAccount);

      clearInterval(timerBasic)
      timerBasic = startCalcTimer()
    }, 3000)

  }
  inputLoanAmount.value = '';
});

btnClose.addEventListener('click', function (e) {
  e.preventDefault();

  if (
    inputCloseUsername.value === currentAccount.username &&
    Number(inputClosePin.value) === currentAccount.pin
  ) {
    const index = accounts.findIndex(
      acc => acc.username === currentAccount.username
    );
    console.log(index);
    // .indexOf(23)

    // Delete account
    accounts.splice(index, 1);

    // Hide UI
    containerApp.style.opacity = 0;
  }

  inputCloseUsername.value = inputClosePin.value = '';
});

let sorted = false;
btnSort.addEventListener('click', function (e) {
  e.preventDefault();
  displayMovements(currentAccount, !sorted);
  sorted = !sorted;
});

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// LECTURES

// console.log('ssssssss');


console.log((2.3764).toFixed(1));

const time = new Date()
console.log(time);

const newDate = new Date('Dec 02, 2001')
console.log(newDate);

console.log(newDate.getFullYear());
console.log(newDate.getDate());
console.log(newDate.getHours());

console.log(20n == 20n);

// const dateOl = new Date();
// console.log(dateOl);

const birthday4 = new Date(1995, 11, 17, 3, 24, 0)
console.log(birthday4);

const xxx = new Date(2001, 11, 2, 15, 44, 0)
console.log(xxx);

const mybirthDay = new Date(2001, 12, 2)
const dayNow = new Date(2022, 11, 3)

const calcAllDay = (day1, day2) => Math.round(Math.abs(day1 - day2) / (1000 * 60 * 60 * 24 * 365))
console.log(calcAllDay(mybirthDay, dayNow));


const perDate = new Date()
const options = {
  hour: 'numeric',
  minute: 'numeric',
  day: 'numeric',
  month: 'long',
  year: 'numeric',
  weekday: 'long',
}
const intDate = new Intl.DateTimeFormat('uz-Cyrl-Uz', options).format(perDate)
console.log(intDate);

const num = 345345543.43
console.log('Sry:', new Intl.NumberFormat('ar-QA').format(num));
console.log('Germany:', new Intl.NumberFormat('de-DE').format(num));

const num2 = 40898566.44
console.log(new Intl.NumberFormat('De-DE', {
  style: 'currency',
  currency: 'EUR'
}).format(num2));
console.log(new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'EUR'
}).format(num2));
console.log(new Intl.NumberFormat('ru-RU', {
  style: 'currency',
  currency: 'EUR'
}).format(num2));


const y = setTimeout(function () {
  console.log('eeeeeeeeeeeeeeeeeeeeeeeeeeee');
  console.log('mmmmmmmmmmmmmmmmmmmmmmmmmmmm');
}, 3000)

const ingrediants = ['onion', 'poteto']

const vagitablesTimer = setTimeout((ing1, ing2) =>
  console.log(`Here is your vgts with ${ing1} and ${ing2}`),
  3000,
  ...ingrediants
  //  'onion',
  //  'poteto',
)


//setInterval
// let timee = 185

// const u = setInterval(function () {
//   const new1 = new Date()
//   const hour = String(Math.floor(timee / 60)).padStart(2, 0)
//   const min = String(Math.floor(timee % 60)).padStart(2, 0)
//   const sec = String(Math.floor(min % 60)).padStart(2, 0)

//   if (min == 0 && sec == 0) {
//     clearTimeout(u)
//     containerApp.style.opacity = 100
//   }
//   labelWelcome.textContent = `${hour}:${min}:${sec}`;

//   timee--;

// }, 1000)

// setInterval(function () {
//   const i = new Date() 
//   const hour = i.getHours()
//   const min = i.getMinutes()
//   const sec = i.getSeconds()

//   labelWelcome.textContent = `${hour}:${min}:${sec}`
// }, 1000)