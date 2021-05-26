for (let i = 0; i < allCells.length; i++) {

    // **************************************** to save the user enetered value into db for later use ***************************************

    allCells[i].addEventListener("blur", function() {
        //  =========================================================  case 1 =========================================================
        //1.1.1
        let data = allCells[i].innerText; //get value from cell
        let address = addressInput.value; //get address from address bar
        let rid = allCells[i].getAttribute("rid"); //row id
        let cid = allCells[i].getAttribute("cid"); //col id
        let cellObject = sheetDB[rid][cid];


        // ========================================================= case 3 =========================================================
        //3.1.1
        //cell click -> no change
        // ui value == DB value 
        if (cellObject.value == data) {
            return;
        }

        // 3.1.2
        // formula -> manual set
        // manully value change -> remove previous formula from sheetDB and formula bar
        if (cellObject.formula) {
            removeFormula(cellObject, address);
            formulaBar.value = "";
        }

        // 1.1.2
        // update value in data base so later someone could use your value to evaluate their formula
        cellObject.value = data; //update value in data base(sheetDB)

        // 2.2.1
        // if you are updating your value then may someone has included you in their formula 
        // you need to tell them to evaluate their value
        updateChildren(cellObject);

        allCells[i].style.textAlign = "right";
        cellObject.hAlign = "right";
    })
}

// ========================================================= addEventListener on formula bar =========================================================
// formula bar -> formula set
formulaBar.addEventListener("keydown", function(e) {
    if (e.key == "Enter" && formulaBar.value) {
        // 1.2.1
        // get the formula
        let currentFormula = formulaBar.value;
        // get address name
        let address = addressInput.value;
        //get rid & cid
        let { rid, cid } = getRIDCIDfromAddress(address);
        let uiCellElement = document.querySelector(`.cell[rid="${rid}"][cid="${cid}"]`);
        let cellObject = sheetDB[rid][cid];

        //============================================================================================
        let prevFormula = cellObject.formula;

        if (prevFormula == currentFormula) {
            return;
        }

        //cycle Detection
        let isCycle = checkCycle(address, currentFormula);
        if (isCycle == true) {
            console.log("Cycle Detected");
            return;
        }
        console.log("Cycle Not Detected");
        //============================================================================================

        // 3.2.1
        // formula update
        // ui formula != db formula -> remove previous formula from sheet db
        if (currentFormula != cellObject.formula) {
            removeFormula(cellObject, address);
        }

        //1.2.2
        // Evaluate the formula -> get value
        let value = evaluateFormula(currentFormula);

        //1.2.3
        //  //jis cell cell ke liye apply kar rhe hai (address bar wala cell)
        // ui-> value update
        // db -> value, formula update 
        setCell(value, currentFormula);

        // ========================================================= case 2 =========================================================
        // 2.1.1
        // formula is equation -> which should always holds true
        // formula cell -> cell object -> name add
        // ( A1 + A2 ) -> B1 
        // -> B1 add in A1 & A2 cell object
        setParentCHArray(currentFormula, address);

        //3.2.2
        updateChildren(cellObject);

        uiCellElement.style.textAlign = "right";
        cellObject.hAlign = "right";
    }
})

// ========================================================= Evaluate formula =========================================================
function evaluateFormula(formula) {
    // ( A1 + A2 )
    let formulaTokens = formula.split(" "); // split on the base of spacing (" ") -> [(,A1,+,A2,)]
    for (let i = 0; i < formulaTokens.length; i++) {
        let ascii = formulaTokens[i].charCodeAt(0);
        // check ascii valid or not
        if (ascii >= 65 && ascii <= 90) {
            let { rid, cid } = getRIDCIDfromAddress(formulaTokens[i]); //find row id/col id
            let value = sheetDB[rid][cid].value; //get value from data base
            formulaTokens[i] = value; //put value on formula tokens -> basically A1 changing to 10
        }
    }
    // [(,10,+,20,)]
    let evaluatedFormula = formulaTokens.join(" ");
    // ( 10 + 20 )
    // eval() -> evaluates the expression
    let solvingValue = eval(evaluatedFormula);
    return solvingValue;
}

// ========================================================= set cell (update Ui & DB) =========================================================
function setCell(value, formula) {
    let uicellElem = findUICellElement();
    // update ui
    uicellElem.innerText = value;

    // db update 
    let { rid, cid } = getRIDCIDfromAddress(addressInput.value);
    sheetDB[rid][cid].value = value;
    sheetDB[rid][cid].formula = formula;
}

// ========================================================= register yourself as children of the parent(cells that are appearing in the formula) =========================================================
function setParentCHArray(formula, chAddress) {
    let formulaTokens = formula.split(" ");
    for (let i = 0; i < formulaTokens.length; i++) {
        let ascii = formulaTokens[i].charCodeAt(0);
        // ascii valid or not
        if (ascii >= 65 && ascii <= 90) {
            let { rid, cid } = getRIDCIDfromAddress(formulaTokens[i]);
            let parentObj = sheetDB[rid][cid]; //A1
            parentObj.children.push(chAddress); //A1.children.push(B1)-> A1=children:[B1]
        }
    }
}

//========================================================= update children =========================================================
function updateChildren(cellObject) {
    let children = cellObject.children; // get children array from sheetDb
    for (let i = 0; i < children.length; i++) {
        // children name
        let chAddress = children[i];
        let { rid, cid } = getRIDCIDfromAddress(chAddress);
        // 2d array
        let childObj = sheetDB[rid][cid];
        // get formula of children
        let chFormula = childObj.formula;
        let newValue = evaluateFormula(chFormula); //find value
        SetChildrenCell(newValue, chFormula, rid, cid);
        updateChildren(childObj);
    }
}

//========================================================= Set children cell (Update Ui and SheetDB) =========================================================
function SetChildrenCell(value, formula, rid, cid) {
    // let uicellElem = findUICellElement();
    // db update 
    let uiCellElement = document.querySelector(`.cell[rid="${rid}"][cid="${cid}"]`);
    uiCellElement.innerText = value; //value update in ui
    sheetDB[rid][cid].value = value; //value update in Data base
    sheetDB[rid][cid].formula = formula; //formula update in Data base
}

// ========================================================= Remove formula =========================================================
// parent -> children -> remove
// formula clear
function removeFormula(cellObject, myName) {
    //formula -> parent -> children remove yourself
    let formula = cellObject.formula; // ( A1 + A2 )
    let formulaTokens = formula.split(" "); // split on the base of spacing (" ") -> [(,A1,+,A2,)]
    for (let i = 0; i < formulaTokens.length; i++) {
        let ascii = formulaTokens[i].charCodeAt(0);
        if (ascii >= 65 && ascii <= 90) {
            let { rid, cid } = getRIDCIDfromAddress(formulaTokens[i]); // get row id & col id
            let parentObj = sheetDB[rid][cid]; // A1
            let idx = parentObj.children.indexOf(myName); // A1 -> children : [B1]
            parentObj.children.splice(idx, 1); //remove children B1 from parent A1
        }
    }
    cellObject.formula = ""; // remove formula ( A1 + A2 )
}

// ========================================================= Check Cycle  =========================================================
function checkCycle(address, newFormula) {
    let formulaTokens = newFormula.split(" ");

    let { rid, cid } = getRIDCIDfromAddress(address);
    let cellObject = sheetDB[rid][cid];
    let myChildren = cellObject.children;

    for (let i = 0; i < myChildren.length; i++) {
        let childAddress = myChildren[i];
        for (let i = 0; i < formulaTokens.length; i++) {
            let firstCharofToken = formulaTokens[i].charCodeAt(0);
            if (firstCharofToken >= 65 && firstCharofToken <= 90) {
                let parentAddress = formulaTokens[i]; // A1

                if (parentAddress == childAddress) {
                    alert("Cycle Detected!!");
                    return true;
                }
            }
        }

        return checkCycle(childAddress, newFormula);
    }
    return false;
}

// =========================================================== find row id / col id  ===========================================================
// dom element reference that is inside address bar  
function findUICellElement() {
    let address = addressInput.value; // get input from current address bar -> like address 'B1'
    let ricidObj = getRIDCIDfromAddress(address); // { rid: 0, cid: 1}
    let rid = ricidObj.rid; //0
    let cid = ricidObj.cid; //1
    let uiCellElement = document.querySelector(`.cell[rid="${rid}"][cid="${cid}"]`) //B1
    return uiCellElement; //B1
}
// Address (string)-> rid /cid
function getRIDCIDfromAddress(address) {
    let cid = Number(address.charCodeAt(0)) - 65; //Number(B=66)
    let rid = Number(address.slice(1)) - 1; //1 - 1
    return { "rid": rid, "cid": cid }; // rid = 0 , cid = 1 -> (0,1)
}