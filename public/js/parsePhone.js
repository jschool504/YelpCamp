function parsePhone(phoneString) {
    
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
            // convert phone number to correct format
            
            if (phoneNum.charAt(0) != "(") {
                
                phoneNum = phoneNum.replace(/\s/, "");
                var digitArray;
                
                if (phoneNum.split(".").length == 3) {
                    
                    // phone number looks like "000.000.0000"
                    
                    digitArray = phoneNum.split(".");
                    
                } else if (phoneNum.split("-").length == 3) {
                    
                    // phone number looks like "000-000-0000"
                    
                    digitArray = phoneNum.split("-");
                    
                }
                
                parsedPhoneArray.push("(" + digitArray[0] + ")" + " " + digitArray[1] + "-" + digitArray[2]);
            } else {
                
                //phone number already in correct form, no processing needed
                
                parsedPhoneArray.push(phoneNum);
            }
            
        });
        
    } else {
        parsedPhoneArray.push("");
    }
    
    return parsedPhoneArray;
}

module.exports = parsePhone;