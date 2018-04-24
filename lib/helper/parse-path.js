var Lexer = require('../parser/Lexer');

module.exports = function(path) {
  var tokens = new Lexer(path, { mode: 2, expression: true }).lex();
  var res = [];
  var i = 0;
  var valid = true;

  if (tokens[0].type !== 'IDENT') {
    valid = false;
  }

  while(i < tokens.length) {
    var token = tokens[i];
    var type = token && token.type;
    if (!token || type === 'EOF' || !valid) {
      break;
    }
    switch(type) {
      case 'IDENT':
        res.push(token.value);
        i++;
      break;
      case '[':
        var close = tokens[i + 2];
        var mediate = tokens[i + 1];
        if ( close
            && close.type === ']'
            && (mediate.type === 'STRING' || mediate.type === 'NUMBER')
        ) {
          res.push(mediate.value);
          i += 3;
        } else {
          valid = false;
        }
      break;
      case '.':
        i++;
      break;
      default:
        valid = false;
    }
  }

  if (!valid) {
    throw new Error('Regular.prototype.$watch don\'t support expression "' + path + '"');
    return;
  }
  return res;
}