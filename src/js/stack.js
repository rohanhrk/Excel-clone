// ================================================================= Stack class =================================================================
class myStack {
    constructor() {
        this.arr = [];
        this.s = -1;
    }

    push(x) {
        this.arr.push(x);
        this.s++;
    }

    pop() {
        if (this.s == -1) return "err";
        this.s--;
        return this.arr.pop();
    }
    peek() {
        if (this.s == -1) return "err";
        return this.arr[this.s];
    }

    size() {
        return this.s + 1;
    }


}

// ================================================================= Evaluate function =================================================================
function eval(formula) {
    let exp = formula.split(" ");
    let operands = new myStack();
    let operators = new myStack();

    for (let i = 0; i < exp.length; i++) {
        let ch = exp[i];

        if (ch == '(') {
            operators.push(ch);
        } else if (isNumber(ch)) {
            operands.push(parseInt(ch));
        } else if (ch == '+' || ch == '-' || ch == '*' || ch == '/') {
            while (operators.size() > 0 && operators.peek() != '(' &&
                precedence(ch) <= precedence(operators.peek())) {
                let val2 = operands.pop();
                let val1 = operands.pop();
                let op = operators.pop();

                let opval = operation(val1, val2, op);
                operands.push(opval);
            }
            operators.push(ch);
        } else if (ch == ')') {
            while (operators.size() > 0 && operators.peek() != '(') {
                let val2 = operands.pop();
                let val1 = operands.pop();
                let op = operators.pop();

                let opval = operation(val1, val2, op);
                operands.push(opval);
            }
            if (operators.size() > 0) {
                operators.pop();
            }
        }
    }

    while (operators.size() > 0) {
        let val2 = operands.pop();
        let val1 = operands.pop();
        let op = operators.pop();

        let opval = operation(val1, val2, op);
        operands.push(opval);
    }

    let val = operands.pop();
    return val;
}

// ================================================================= Precedance check  =================================================================
function precedence(op) {
    if (op == '+') {
        return 1;
    } else if (op == '-') {
        return 1;
    } else if (op == '*') {
        return 2;
    } else {
        return 2;
    }
}

// ================================================================= operation =================================================================
function operation(val1, val2, op) {
    if (op == '+') {
        return val1 + val2;
    } else if (op == '-') {
        return val1 - val2;
    } else if (op == '*') {
        return val1 * val2;
    } else {
        return val1 / val2;
    }
}


function isNumber(n) {
    return !isNaN(parseInt(n))
}