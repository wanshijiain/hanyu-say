cordova.define("cordova-plugin-offbye-alipay.AliPay", function(require, exports, module) {
var exec = require('cordova/exec');

exports.pay = function (paymentInfo, successCallback, errorCallback) {   
		if(!paymentInfo){
			errorCallback && errorCallback("Please enter order information");  
		}else{
			exec(successCallback, errorCallback, "AliPay", "pay", [paymentInfo]);
		}
};

});
