module.exports = 
{
  // This is the function which will be called in the main file, which is dbfechData.js
  // The parameters 'server, username, password,database will be provided inside the function
  // when the function is called in the main file.
  localDateTime: function () 
  {
    let today = new Date();
    let day = today.getDate() + "";
    let month = (today.getMonth() + 1) + "";
    let year = today.getFullYear() + "";
    let hour = today.getHours() + "";
    let minutes = today.getMinutes() + "";
    let seconds = today.getSeconds() + "";

    day = checkZero(day);
    month = checkZero(month);
    year = checkZero(year);
    hour = checkZero(hour);
    mintues = checkZero(minutes);
    seconds = checkZero(seconds);

    return year + "-" + month + "-" + day + " " + hour + ":" + minutes + ":" + seconds;
    
  },

  incr_date: function(date_str) {
    var parts = date_str.split("-");
    var dt = new Date(
      parseInt(parts[0], 10),      // year
      parseInt(parts[1], 10) - 1,  // month (starts with 0)
      parseInt(parts[2], 10)       // date
    );
    dt.setDate(dt.getDate() + 1);
    parts[0] = "" + dt.getFullYear();
    parts[1] = "" + (dt.getMonth() + 1);
    if (parts[1].length < 2) {
      parts[1] = "0" + parts[1];
    }
    parts[2] = "" + dt.getDate();
    if (parts[2].length < 2) {
      parts[2] = "0" + parts[2];
    }
    return parts.join("-");
    }
};

function checkZero(data){
    if(data.length == 1){
      data = "0" + data;
    }
    return data;
  }

