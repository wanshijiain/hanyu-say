define(function (require, exports, module) {
    var options = {
        page: "#addFunds"
    };
    function initEvent() {
        var $page = $(options.page);
        if(Core.init.hasInitEvent($page)) return;
        $('#funds').bind('input propertychange', function() {
            $('#need').html(($(this).val())/10+'元');
        });
        $page.on('click', ".addfunds", function() {
            var type = $('#addFunds input[name="pay"]:radio:checked').val();
            if(!type) {
                Core.App.alert('请选择正确的支付方式');
                return;
            }
            var funds = $('#funds').val();
            var params ={
                type: 'INTEGRAL',
                count: funds
            };
            if(type == 'aliPay') {
                Core.Service.post('buyer/alipayRecharge', params, function (data) {
                    cordova.plugins.AliPay.pay(data,function success(e){
                        Core.App.alert("充值成功",function () {
                            Core.Page.changePage('vipHome.html');
                        });
                    },function error(e){
                        Core.App.alert("充值失败，原因为: " + (e && e.memo));
                    });
                });
            } else if(type == 'wechatPay') {
                Core.Service.post('buyer/weixinRecharge', params, function (data) {
                    Wechat.sendPaymentRequest(data, function () {
                        Core.App.alert("充值成功",function () {
                            Core.Page.changePage('vipHome.html');
                        });
                    }, function (reason) {
                        Core.App.alert("充值失败，原因为: " + reason);
                    });
                });
            }
        })
    }

    function queryMyAccount() {
        Core.Service.post('buyer/info/queryMyAccounts', {}, function (result) {
            availableAmountFormat = result[1]['availableAmountFormat'] || 0;
            $('#jifen').text(availableAmountFormat);
        });
    }

    function updateContent(force) {
        if(force || !Core.Buyer.getBuyer('info')) {
            Core.Buyer.updateMyInfo(function () {
                queryMyAccount();
            });
        } else {
            queryMyAccount();
        }
    }
    return exports = {
        init: function () {
            console.log("页面js初始化成功");
            initEvent();

            updateContent(true);
            $(document).on('pagebeforeshow', function () {
                updateContent();
            })
        }
    };
});