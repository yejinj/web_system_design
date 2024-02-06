'use strict';

const TaskTypeSelector = {
  A: 'A',
  B: 'B',
  C: 'C',
};

const Validator = {
  isEmpty: function (str) {
    return str === '';
  },

  isValidIndexInput: function (index) {
    if (this.isEmpty(index) || !(index >= 0 && index <= 2)) {
      alert('빈 문자열이 아니고 0과 2 사이의 인덱스를 입력하세요');
      return false;
    }
    return true;
  },

  isValidTimeInput: function (time) {
    if (this.isEmpty(time) || !(time >= 1 && time <= 10)) {
      alert('빈 문자열이 아니고 1과 10 사이의 시간을 입력하세요');
      return false;
    }
    return true;
  },

  isValidStatusInput: function (status) {
    if (this.isEmpty(status) || !['정상', '고장'].includes(status)) {
      alert('정상과 고장 중 하나를 입력하세요');
      return false;
    }
    return true;
  },

  isValidTaskTypeInput: function (taskType) {
    if (this.isEmpty(taskType) || !['A', 'B', 'C'].includes(taskType)) {
      alert('A, B, C 중 하나를 입력하세요');
      return false;
    }
    return true;
  },
};

class Timer {
  constructor(idx) {
    this.idx = idx;
    this.time = 0;
    this.isOperational = false;
  }

  setTime(time) {
    this.time = time;
  }

  setTimerStatus(status) {
    this.isOperational = status;
  }
}

document.addEventListener('DOMContentLoaded', () => {
  const timerNum = 3;
  const setTimerBtn = document.getElementById('setTimerBtn');
  const runTaskBtn = document.getElementById('runTaskBtn');
  const displayTimersBtn = document.getElementById('displayTimerBtn');

  const timers = [];
  const timerDivs = [];

  setTimerBtn.addEventListener('click', setTimer);
  runTaskBtn.addEventListener('click', runTask);
  displayTimersBtn.addEventListener('click', displayTimer);

  for (let idx = 0; idx < timerNum; idx++) {
    timers.push(new Timer(idx));
  }

  for (let idx = 0; idx < timerNum; idx++) {
    timerDivs.push(document.getElementById('timer' + String(idx)));
  }

  function setTimer() {
    let idx = prompt('타이머의 인덱스를 입력하세요(0~2):');
    if (!Validator.isValidIndexInput(idx)) {
      idx = prompt('타이머의 인덱스를 입력하세요(0~2):');
    }

    let time = prompt('타이머의 시간을 입력하세요(1~10):');
    if (!Validator.isValidTimeInput(time)) {
      time = prompt('타이머의 시간을 입력하세요(1~10):');
    }
    timers[idx].setTime(time);

    let status = prompt('타이머의 상태를 입력하세요(정상, 고장):');
    if (!Validator.isValidStatusInput(status)) {
      status = prompt('타이머의 상태를 입력하세요(정상, 고장):');
    }
    if (status === '정상') {
      timers[idx].setTimerStatus(true);
    } else if (status === '고장') {
      timers[idx].setTimerStatus(false);
    }
  }

  function displayTimer() {
    console.clear();
    for (let i = 0; i < timerNum; i++) {
      console.log(timers[i]);
    }
  }

  function getTaskType() {
    let taskType = prompt('실행할 태스크 타입을 입력하세요(A, B, C)');
    if (!Validator.isValidTaskTypeInput(taskType)) {
      taskType = prompt('실행할 태스크 타입을 입력하세요(A, B, C)');
    }
    return taskType;
  }

  function getPromiseMethod(taskType) {
    switch (taskType) {
      case TaskTypeSelector.A:
        return Promise.all.bind(Promise);
      case TaskTypeSelector.B:
        return Promise.allSettled.bind(Promise);
      case TaskTypeSelector.C:
        return Promise.race.bind(Promise);
    }
  }

  function runTask() {
    const taskType = getTaskType();
    const promiseMethod = getPromiseMethod(taskType);

    console.log('=================');
    const promises = [];
    for (let i = 0; i < timerNum; i++) {
      promises.push(
        new Promise((resolve, reject) => {
          setTimeout(() => {
            if (timers[i].isOperational) {
              console.log(`Timer ${i} Completed`);
              timerDivs[i].style.backgroundColor = 'green';
              resolve();
            } else {
              console.log(`Timer ${i} Failed`);
              timerDivs[i].style.backgroundColor = 'red';
              reject();
            }
          }, timers[i].time * 1000);
        })
      );
    }

    setTimeout(() => {
      for (let i = 0; i < timerNum; i++) {
        timerDivs[i].style.backgroundColor = 'white';
      }
    }, 4000);

    promiseMethod(promises)
      .then(() => {
        console.log('then() executed');
      })
      .catch(() => {
        console.log('catch() executed');
      });
  }
});
