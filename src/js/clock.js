function showTime(){
    const  date = new Date();
    const formattedTime = date.toLocaleTimeString('en-US');

    document.getElementById("MyClockDisplay").textContent = formattedTime;
    
    setInterval(showTime, 1000);
    
}

showTime();