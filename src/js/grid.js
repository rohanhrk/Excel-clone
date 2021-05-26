let leftCol = document.querySelector(".left_col");
let topRow = document.querySelector(".top_row");
let grid = document.querySelector(".grid");
let gritContainer = document.querySelector(".grid-container");
// **********
let addressInput = document.querySelector(".address-input");
let boldBtn = document.querySelector(".bold");
let underlineBtn = document.querySelector(".underline");
let italicBtn = document.querySelector(".italic");
let alignBtns = document.querySelectorAll(".align-container>*");
let leftAlign = document.querySelector(".left");
let centerAlign = document.querySelector(".center");
let rightAlign = document.querySelector(".right");
let colorElem = document.querySelector(".color");
let bgColorElem = document.querySelector(".bg-color");
// **********
let viewElem = document.querySelector(".view");
let fontSizeElem = document.querySelector(".font-size");
let fontFamilyElem = document.querySelector(".font-family");
// **********
let formulaBar = document.querySelector(".formula-input");
let rows = 100;
let cols = 26;


// ================================================================================ left_col ================================================================================
for (let i = 0; i < rows; i++) {
    let colBox = document.createElement("div");
    colBox.innerText = i + 1;
    colBox.setAttribute("class", "box");
    leftCol.appendChild(colBox);
}

// ================================================================================ top_row ================================================================================
for (let i = 0; i < cols; i++) {
    let cell = document.createElement("div");
    cell.innerText = String.fromCharCode(65 + i);
    // setAttribute
    cell.setAttribute("class", "cell top");
    topRow.appendChild(cell);
}

//================================================================================ grid ================================================================================
for (let i = 0; i < rows; i++) {
    let row = document.createElement("div");
    row.setAttribute("class", "row"); //row
    for (let j = 0; j < cols; j++) {
        let cell = document.createElement("div"); //col
        cell.setAttribute("class", "cell");
        cell.setAttribute("id", "cell");
        cell.setAttribute("rid", i);
        cell.setAttribute("cid", j);
        cell.setAttribute("contenteditable", "true");
        row.appendChild(cell);
    }
    grid.appendChild(row);
}

// ================================================================================ Create new Sheet ================================================================================
let btnContainer = document.querySelector(".add-sheet_btn-container");
let sheetList = document.querySelector(".sheet-list");
let firstSheet = document.querySelector(".sheet");
let topCell = document.querySelectorAll(".cell.top");
let leftbox = document.querySelectorAll(".box");
let allCells = document.querySelectorAll(".grid .cell");
// sheets aray -> bottom 
let sheetArray = [];

// 2d array -> current sheet
let sheetDB;
firstSheet.addEventListener("click", makeMeActive)
firstSheet.click();
btnContainer.addEventListener("click", function() {
    // create sheet 
    let AllSheets = document.querySelectorAll(".sheet");
    let lastSheet = AllSheets[AllSheets.length - 1]; //find last sheet
    let Lastidx = lastSheet.getAttribute("idx"); //index of last sheet
    Lastidx = Number(Lastidx); //convet string to number

    // <div class="sheet active" idx="1">Sheet 2</div>
    let Newsheet = document.createElement("div"); //create div element
    Newsheet.setAttribute("class", "sheet"); // class = "sheet"
    Newsheet.setAttribute("idx", `${Lastidx + 1}`); //idx = "0+1"
    Newsheet.innerText = `Sheet ${Lastidx + 2}`; //sheet 0+2
    sheetList.appendChild(Newsheet);
    for (let i = 0; i < AllSheets.length; i++) {
        AllSheets[i].classList.remove("active");
    }

    Newsheet.classList.add("active"); //make active new sheet
    Newsheet.style.Color = "green";
    // ================================================================================ Multiple sheet ================================================================================
    // (a)
    // new sheet create -> 3D array
    // ui ko empty kara do
    createSheet();

    // (b)
    // 3d array -> find sheetDB
    // current db sheet change
    // switch -> pointing on current sheet
    sheetDB = sheetArray[Lastidx + 1]; //2D array

    // (c)
    setUI();

    // new sheet create -> add event listener
    Newsheet.addEventListener("click", makeMeActive)
})

// ================================================================================ make me active ================================================================================
function makeMeActive(e) {
    // evnt listener  add 
    let sheet = e.currentTarget;
    let AllSheets = document.querySelectorAll(".sheet");
    for (let i = 0; i < AllSheets.length; i++) {
        AllSheets[i].classList.remove("active");
    }
    sheet.classList.add("active");

    let idx = sheet.getAttribute("idx");

    //sheet nhi he to sheet create kara do
    if (!sheetArray[idx]) {
        // only when you init the workbook
        createSheet();
    }
    // current set 
    sheetDB = sheetArray[idx];
    setUI();
}

//================================================================================ Create Sheet ================================================================================
function createSheet() {
    // create 2D array and push in sheet array
    let NewDB = [];
    for (let i = 0; i < rows; i++) {
        let row = [];
        for (let j = 0; j < cols; j++) {
            let cell = {
                bold: "normal",
                italic: "normal",
                underline: "none",
                hAlign: "center",
                fontFamily: "Arial",
                fontSize: "16",
                color: "black",
                bColor: "white",
                value: "",
                formula: "",
                children: []
            }

            // sheet -> cell ko empty kara do
            let elem = document.querySelector(`.grid .cell[rid='${i}'][cid='${j}']`);
            elem.innerText = "";

            row.push(cell);
        }
        NewDB.push(row); // 2D array
    }

    sheetArray.push(NewDB); //3D array-> push newDb (2D array) in  sheetArray (1D array)
}

//================================================================================ Init UI ================================================================================
function initUI() {
    for (let i = 0; i < allCells.length; i++) {
        allCells[i].style.fontWeight = "normal";
        allCells[i].style.fontStyle = "normal";
        allCells[i].style.textDecoration = "none";
        allCells[i].style.fontFamily = "Arial";
        allCells[i].style.fontSize = "16px";
        allCells[i].style.textAlign = "left";
        allCells[i].style.color = "black";
        allCells[i].style.backgroundColor = "white";
        allCells[i].innerText = "";
    }
}
//================================================================================ Set UI ================================================================================
function setUI() {
    allCells[0].click();
    for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {

            let elem = document.querySelector(`.grid .cell[rid='${i}'][cid='${j}']`);

            let value = sheetDB[i][j].value;
            let bold = sheetDB[i][j].bold;
            let italic = sheetDB[i][j].italic;
            let underline = sheetDB[i][j].underline;
            let hAlign = sheetDB[i][j].hAlign;
            let fontFamily = sheetDB[i][j].fontFamily;
            let fontSize = sheetDB[i][j].fontSize;
            let color = sheetDB[i][j].color;
            let bColor = sheetDB[i][j].bColor;

            elem.innerText = value;
            elem.style.fontWeight = bold;
            elem.style.fontStyle = italic;
            elem.style.textDecoration = underline;
            elem.style.textAlign = hAlign;
            elem.style.fontFamily = fontFamily;
            elem.style.fontSize = fontSize;
            elem.style.color = color;
            elem.style.backgroundColor = bColor;
        }
    }
}


//================================================================================ two way binding ================================================================================ 
for (let i = 0; i < allCells.length; i++) {
    allCells[i].addEventListener("click", function() {
        // address get current cell
        //UI(user interface)
        let rid = allCells[i].getAttribute("rid");
        let cid = allCells[i].getAttribute("cid");
        rid = Number(rid);
        cid = Number(cid);
        let address = `${String.fromCharCode(65 + cid)}${rid + 1}`;
        addressInput.value = address;
        let cellObject = sheetDB[rid][cid];

        // ================================================================= bold/underline/italic =================================================================
        // toolbar cell sync 
        // ********** bold **********
        if (cellObject.bold == "normal") {
            boldBtn.classList.remove("active-btn");
        } else {
            boldBtn.classList.add("active-btn");
        }

        // ********** underline **********
        if (cellObject.underline == "none") {
            underlineBtn.classList.remove("active-btn");
        } else {
            underlineBtn.classList.add("active-btn");
        }

        // ********** italic **********
        if (cellObject.italic == "normal") {
            italicBtn.classList.remove("active-btn");
        } else {
            italicBtn.classList.add("active-btn");
        }

        // ================================================================= Alignment =================================================================
        for (let i = 0; i < alignBtns.length; i++) {
            alignBtns[i].classList.remove("active-btn");
        }

        // ********** left aligment **********
        if (cellObject.hAlign == "left") {
            // left active
            leftAlign.classList.add("active-btn");
        }
        // ********** right alignment **********
        if (cellObject.hAlign == "right") {
            // right active
            rightAlign.classList.add("active-btn");
        }
        // ********** center alignment **********
        if (cellObject.hAlign == "center") {
            // center active
            centerAlign.classList.add("active-btn");
        }

        // ================================================================= font-size/font-family =================================================================
        // Font-Family
        let cellFont = cellObject.fontFamily;
        fontFamilyElem.value = cellFont;

        // Font-Size
        let cellSize = cellObject.fontSize;
        fontSizeElem.value = cellSize;

        // ================================================================= ******************** =================================================================
        for (let i = 0; i < topCell.length; i++) {
            topCell[i].classList.remove("active-btn");
        }
        topCell[cid].classList.add("active-btn");

        for (let i = 0; i < leftbox.length; i++) {
            leftbox[i].classList.remove("active-btn");
        }
        leftbox[rid + 1].classList.add("active-btn");

        // ==========================================================  Formula shown in formula bar ==========================================================
        if (cellObject.formula) {
            formulaBar.value = cellObject.formula;
        } else {
            formulaBar.value = "";
        }
    })
}

// ================================================================================  Horizontal alignment ================================================================================
// ********** left align **********
leftAlign.addEventListener("click", handleAlign);

// ********** center align **********
centerAlign.addEventListener("click", handleAlign);

// ********** right align **********
rightAlign.addEventListener("click", handleAlign);;

// ********** handle alingment function ************
function handleAlign(e) {
    let val = e.currentTarget;
    let alignName = val.classList[2];

    let address = addressInput.value;
    let { rid, cid } = getRIDCIDfromAddress(address);

    let cellElem = document.querySelector(`.grid .cell[rid='${rid}'][cid='${cid}']`);
    cellElem.style.textAlign = alignName;


    for (let i = 0; i < alignBtns.length; i++) {
        alignBtns[i].classList.remove("active-btn");
    }
    val.classList.add("active-btn");

    // Updating our temporary DB
    let cellObject = sheetDB[rid][cid];
    cellObject.hAlign = alignName;
}

//  ================================================================================ font size / font family ================================================================================
//  ********** font-size **********
fontSizeElem.addEventListener("change", function() {
    let val = fontSizeElem.value;
    let cellAddress = addressInput.value;
    let { rid, cid } = getRIDCIDfromAddress(cellAddress);
    let uiCellElement = document.querySelector(`.grid .cell[rid='${rid}'][cid='${cid}']`);
    uiCellElement.style.fontSize = val + "px";

    // Updating DB
    let cellObject = sheetDB[rid][cid];
    cellObject.fontSize = val;
})

// ********** font-family **********
fontFamilyElem.addEventListener("change", function() {
    let val = fontFamilyElem.value;
    let cellAddress = addressInput.value;
    let { rid, cid } = getRIDCIDfromAddress(cellAddress);
    let uiCellElement = document.querySelector(`.grid .cell[rid='${rid}'][cid='${cid}']`);
    uiCellElement.style.fontFamily = val;

    // Updating DB
    let cellObject = sheetDB[rid][cid];
    cellObject.fontFamily = val;
})

//================================================================================ bold/underline/italic ================================================================================
allCells[0].click(); //sheet open hote hi pehla cell pe click kara do

// ********** bold **********
boldBtn.addEventListener("click", function() {
    // Jispe cell click -> bold
    let uiCellElement = findUICellElement();
    let cid = uiCellElement.getAttribute("cid");
    let rid = uiCellElement.getAttribute("rid");
    let cellObject = sheetDB[rid][cid];
    if (cellObject.bold == "normal") {
        uiCellElement.style.fontWeight = "bold";
        boldBtn.classList.add("active-btn");
        cellObject.bold = "bold";
    } else {
        boldBtn.classList.remove("active-btn");
        uiCellElement.style.fontWeight = "normal";
        cellObject.bold = "normal";
    }
})

// ********** underline **********
underlineBtn.addEventListener("click", function() {
    // Jispe cell click -> bold
    let uiCellElement = findUICellElement();
    let cid = uiCellElement.getAttribute("cid");
    let rid = uiCellElement.getAttribute("rid");
    let cellObject = sheetDB[rid][cid];
    if (cellObject.underline == "none") {
        uiCellElement.style.textDecoration = "underline";
        underlineBtn.classList.add("active-btn");
        cellObject.underline = "underline";
    } else {
        underlineBtn.classList.remove("active-btn");
        uiCellElement.style.textDecoration = "none";
        cellObject.underline = "none";
    }
})

// ********** italic **********
italicBtn.addEventListener("click", function() {
    // Jispe cell click -> bold
    let uiCellElement = findUICellElement();
    let cid = uiCellElement.getAttribute("cid");
    let rid = uiCellElement.getAttribute("rid");
    let cellObject = sheetDB[rid][cid];
    if (cellObject.italic == "normal") {
        uiCellElement.style.fontStyle = "italic";
        italicBtn.classList.add("active-btn");
        cellObject.italic = "italic";
    } else {
        italicBtn.classList.remove("active-btn");
        uiCellElement.style.fontStyle = "normal";
        cellObject.italic = "normal";
    }
})

// ================================================================================ text color / cell color ================================================================================

// ********** text color **********
colorElem.addEventListener("change", function() {
    let val = colorElem.value;

    let address = addressInput.value;
    let { rid, cid } = getRIDCIDfromAddress(address);

    let cellElem = document.querySelector(`.grid .cell[rid='${rid}'][cid='${cid}']`);
    cellElem.style.color = val;


    //update db
    let cellObject = sheetDB[rid][cid];
    cellObject.color = val;


})

// ********** cell color fill **********
bgColorElem.addEventListener("change", function() {
    let val = bgColorElem.value;

    let address = addressInput.value;
    let { rid, cid } = getRIDCIDfromAddress(address);

    let cellElem = document.querySelector(`.grid .cell[rid='${rid}'][cid='${cid}']`);
    cellElem.style.backgroundColor = val;

    //update db
    let cellObject = sheetDB[rid][cid];
    cellObject.bColor = val;


})