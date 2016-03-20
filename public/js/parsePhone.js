function parsePhone(phoneString) {
    
    //phoneString = "(559) 877.2218/559-297-0706";
    
    var parsedPhoneArray = [];
    
    if (phoneString.length > 1) {
        
        var phoneArray = [];
        
        if (phoneString.search(",") != -1) {
            // phone numbers are delimited by ,
            phoneArray = phoneString.split(",");
        } else if (phoneString.search("/") != -1) {
            // phone numbers delimited by /
            phoneArray = phoneString.split("/");
        } else {
            // only 1 phone number
            phoneArray = [phoneString];
        }
        
        //phone numbers are delimited by /
        
        phoneArray.forEach(function(phoneNum) {
            
            var phoneRegex = /\d{3,4}/g;
            
            var digitArray = [];
            
            for (var i = 0; i < 3; i++) {
                // get all three parts of the phone number
                digitArray.push(phoneRegex.exec(phoneNum));
            }
            
            parsedPhoneArray.push("(" + digitArray[0] + ")" + " " + digitArray[1] + "-" + digitArray[2]);
            
        });
        
    } else {
        parsedPhoneArray.push("");
    }
    //console.log(parsedPhoneArray);
    return parsedPhoneArray;
}

module.exports = parsePhone;