define(function (require, exports, module) {
    var options = {
        page: "#vipRenew",
        params: {

        }, // 请求参数
        url: 'buyer/home/queryMyInfo',  // 请求地址
        templateId: 'vipTmp'  // 模板ID
    };
    function updatePrices() {
        var year = $('#years').val() || 1;
        var type = $('#vipRenew input[name="pay"]:radio:checked').val();
        if(type == 'pointsPay') {
            $('#needs').html((year*3650)+'积分');
        } else {
            $('#needs').html((year*365)+'元');
        }
    }
    function initEvent() {
        var $page = $(options.page);
        if(Core.init.hasInitEvent($page)) return;
        Core.Page.initPage(options);
        updatePrices();
        $('#vipRenew input, #vipRenew select').bind('input propertychange change', function() {
            updatePrices();
        });
        $page.on('click', ".vipReNew", function() {
            var year = $('#years').val() || 1;

            var type = $('#vipRenew input[name="pay"]:radio:checked').val();
            if(!type) {
                Core.App.alert('请选择正确的支付方式');
                return;
            }
            var params ={
                type: 'MEMBER',
                count: year * 12
            };
            if(type == 'pointsPay') {
                params ={
                    payType:'COMMISSION',
                    year: year
                };
                Core.Service.post('buyer/info/becomeVip.json', params, function () {
                    Core.App.alert('续费成功',function () {
                        Core.Page.changePage('vipHome.html');
                    });
                });
            } else if (type == 'aliPay') {
                Core.Service.post('buyer/alipayRecharge', params, function (data) {
                    cordova.plugins.AliPay.pay(data,function success(e){
                        Core.App.alert("续费成功",function () {
                            Core.Page.changePage('vipHome.html');
                        });
                    },function error(e){
                        Core.App.alert("续费失败，原因为: " + (e && e.memo));
                    });
                });
            } else if(type == 'wechatPay') {
                Core.Service.post('buyer/weixinRecharge', params, function (data) {
                    Wechat.sendPaymentRequest(data, function () {
                        Core.App.alert("续费成功",function () {
                            Core.Page.changePage('vipHome.html');
                        });
                    }, function (reason) {
                        Core.App.alert("续费失败，原因为: " + reason);
                    });
                });
            }
        })
    }
    return exports = {
        init: function () {
            console.log("页面js初始化成功");
            initEvent();
        }
    };
});