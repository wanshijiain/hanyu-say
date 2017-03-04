define(function (require, exports, module) {
    var options = {
        page: "#fundsDetail",   // 页面ID
        params: {
            accType:'COMMISSION'
        }, // 请求参数
        url: 'buyer/info/queryMyAccountRecords',  // 请求地址
        templateId: 'fundsDetailTmp' // 模板ID
    };
    var params = options.params;

    function initEvent() {
        var $page = $(options.page);
        if(Core.init.hasInitEvent($page)) return;
        Core.Page.initPage(options);
    }

    return exports = {
        init: function () {
            console.log("页面js初始化成功");
            initEvent();
        }
    };
});