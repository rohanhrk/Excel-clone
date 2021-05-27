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

        // ********** find char of i **********
        let ch = exp[i];

        // ********** if operand comes **********
        if (isNumber(ch)) {
            operands.push(parseInt(ch));
        }

        // ********** if opening bracket comes **********
        else if (ch == '(') {
            operators.push(ch);
        }

        // ********** if operator comes **********
        else if (ch == '-' || ch == '+' || ch == '*' || ch == '/') {
            while (operators.size() > 0 && operators.peek() != '(' && precedence(ch) <= precedence(operators.peek())) {
                let operand2 = operands.pop();
                let operand1 = operands.pop();
                let oparator = operators.pop();

                let ans = calculate(operand1, operand2, oparator);
                operands.push(ans);
            }
            operators.push(ch);
        }

        // ********** closing bracket **********
        else if (ch == ')') {
            while (operators.size() > 0 && operators.peek() != '(') {
                let operand2 = operands.pop();
                let operand1 = operands.pop();
                let oparator = operators.pop();

                let ans = calculate(operand1, operand2, oparator);
                operands.push(ans);
            }
            if (operators.size() > 0) {
                operators.pop();
            }
        }
    }

    // ********** if operator stack is not empty **********
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
function calculate(val1, val2, op) {
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

// ********** check current char is number or not **********
function isNumber(n) {
    return !isNaN(parseInt(n))
}