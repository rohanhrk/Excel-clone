let save = document.querySelector(".save");
let open = document.querySelector(".open");
let newElem = document.querySelector(".new");
let nameElem = document.querySelector(".name");

// ================================================================================ Save ================================================================================
// functionality -> download excel representation
save.addEventListener("click", function() {
    let name = nameElem.innerText;
    //2d arrayy save file 
    const data = JSON.stringify(sheetDB);
    // convert it into blob
    // data -> file like object convert
    const blob = new Blob([data], { type: 'application/json' });
    // convert it any type file into url
    const url = window.URL.createObjectURL(blob);
    let a = document.createElement("a");
    // content in that file
    a.href = url;
    // file download
    a.download = name + ".json";
    // anchor click
    a.click();
})

// ================================================================================ Open ================================================================================
// downloaded file -> open read 
// input type file -> change event file name
open.addEventListener("change", function() {
    // files array -> file accept-> multiple files get 
    let filesArray = open.files;

    let fileObj = filesArray[0];
    // file reader to read the file
    let fr = new FileReader(fileObj);
    // read as text 
    fr.readAsText(fileObj);

    fr.addEventListener("load", function() {
        let data = fr.result; //JSON file
        data = JSON.parse(data);
        let sheetArray = data;
        sheetDB = sheetArray;
        setUI();
    })
})


// ================================================================================ new ================================================================================
newElem.addEventListener("click", function() {

    initUI();
    let newSheetDB = cleanSheetDB();
    let activeSheet = document.querySelector(".sheet.active");
    let sheetIdx = activeSheet.getAttribute("idx");
    sheetDB = newSheetDB;
    sheetArray[sheetIdx] = newSheetDB;

})


function cleanSheetDB() {
    let newSheetDB = []; // Stores data of all cells present in the sheet
    for (let i = 0; i < 100; i++) {
        let row = [];
        for (let j = 0; j < 26; j++) {
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
            };
            row.push(cell);
        }
        newSheetDB.push(row);
    }
    return newSheetDB;
}