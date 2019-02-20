function createErrorHandlingFn(Regular) {
  return function errorHandling(info, error, vm) {
    try {
      let lastParentHasErrorHanlder = vm;
      while(lastParentHasErrorHanlder && !lastParentHasErrorHanlder._errorHandler) {
        lastParentHasErrorHanlder = vm.$parent;
      }

      if (lastParentHasErrorHanlder && lastParentHasErrorHanlder._errorHandler) { // vm error handling 
        lastParentHasErrorHanlder._errorHandler(info, error, vm);
      } else if (Regular._errorHandler) { // global error handling
        Regular._errorHandler(info, error, vm);
      } else { // default error handling
        console.error(info, error, vm);
      }
    } catch(err) {
      console.error('global errorHandler eror', err);
      console.error(info, error, vm);
    }
  }
}

module.exports = createErrorHandlingFn
