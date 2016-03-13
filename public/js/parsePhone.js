function parsePhone(phoneString) {
    
    console.log(phoneString.length);
    var parsedPhoneArray = [];
    
    if (phoneString.length > 1) {
        var phoneArray = phoneString.split("/");
        
        phoneArray.forEach(function(phoneNum) {
             var digitArray = phoneNum.split(".");
            parsedPhoneArray.push("(" + digitArray[0] + ")" + " " + digitArray[1] + "-" + digitArray[2]);
        });
    } else {
        parsedPhoneArray.push("");
    }
    
    return parsedPhoneArray;
}

module.exports = parsePhone;