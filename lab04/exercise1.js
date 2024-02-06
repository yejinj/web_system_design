'use strict';

const StateSelector = {
  Pending: 'pending',
  Fulfilled: 'fulfilled',
  Rejected: 'rejected',
};

class MyPromise {
  constructor(executor) {
    this.state = StateSelector.Pending;
    this.value = null;
    this.errorMsg = null;
    this.onFulfilledCallbacks = [];
    this.onRejectedCallbacks = [];

    try {
      executor(this.resolve.bind(this), this.reject.bind(this));
    } catch (error) {
      this.reject(error);
    }
  }

  resolve(value) {
    if (this.state === StateSelector.Pending) {
      this.state = StateSelector.Fulfilled;
      this.value = value;
      this.onFulfilledCallbacks.forEach((callback) => {
        callback();
      });
    }
  }

  reject(errorMsg) {
    if (this.state === StateSelector.Pending) {
      this.state = StateSelector.Rejected;
      this.errorMsg = errorMsg;
      this.onRejectedCallbacks.forEach((callback) => {
        callback();
      });
    }
  }

  then(onFulfilled, onRejected) {
    return new MyPromise((resolve, reject) => {
      const handleFulfilled = () => {
        if (typeof onFulfilled === 'function') {
          try {
            const result = onFulfilled(this.value);
            if (result instanceof MyPromise) {
              result.then(resolve, reject);
            } else {
              resolve(result);
            }
          } catch (error) {
            reject(error);
          }
        } else {
          resolve(this.value);
        }
      };

      const handleRejected = () => {
        if (typeof onRejected === 'function') {
          try {
            const result = onRejected(this.errorMsg);
            if (result instanceof MyPromise) {
              result.then(resolve, reject);
            } else {
              resolve(result);
            }
          } catch (error) {
            reject(error);
          }
        } else {
          reject(this.errorMsg);
        }
      };

      switch (this.state) {
        case StateSelector.Fulfilled:
          handleFulfilled();
          break;
        case StateSelector.Rejected:
          handleRejected();
          break;
        case StateSelector.Pending:
          this.onFulfilledCallbacks.push(handleFulfilled);
          this.onRejectedCallbacks.push(handleRejected);
          break;
      }
    });
  }

  catch(onRejected) {
    return this.then(null, onRejected);
  }
}

const myPr = (val) =>
  new MyPromise((resolve, reject) => {
    if (val < 4) {
      setTimeout(() => {
        console.log(val);
        resolve(val);
      }, 2000);
    } else {
      reject('greater than or equal to 4!');
    }
  });

const num = 3;
myPr(num)
  .then((val) => {
    console.log(val + 1);
    return val + 1;
  })
  .then((val) => {
    console.log(val + 1);
    return val + 1;
  })
  .then((val) => {
    console.log(val + 1);
    return val + 1;
  })
  .catch((err) => console.log(`${err}`));
