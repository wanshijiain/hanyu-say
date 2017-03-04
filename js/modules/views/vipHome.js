define(function (require, exports, module) {
    var options = {
        page: "#vipHome"
    };
    function initEvent() {
        var $page = $(options.page);
        if(Core.init.hasInitEvent($page)) {
            updateContent(true);
            return;
        }

        $page.on('refresh', ".pull-to-refresh-content", function(e) {
            updateContent(true);
        }).on('click', ".sign-in", function() {
            Core.Service.post('buyer/signIn', {}, function () {
                Core.App.alert('签到成功', '获得5积分！');
            });
        }).on('click', '.yjfk-btn', function () {
            Core.App.alert('请添加微信：1989260，反馈意见。');
        }).on('click', '.tagLink', function () {
            var part = $(this).data('part');
            var text = $(this).data('text');
            Core.Params.set("partType",{
                part:part,
                text:text
            });
            Core.Page.changePage.call(this,'tagList.html');
        });
    }

    function queryMyAccount() {
        Core.Service.post('buyer/info/queryMyAccounts', {}, function (result) {
            availableAmountFormat = result[1]['availableAmountFormat'] || 0;
            $('.jifen').text(availableAmountFormat);
        });
    }
    function setAvatar() {
        var info = Core.Buyer.getBuyer('info') || {};
        var add = Core.Buyer.getBuyer('additional') || {};
        $("#userName").text(info['name']);
        var avatar  =  info['avatar'];
        if(!info['avatar']){
            avatar = basePath + "static/images/touxiang.png";
        }else if(avatar.indexOf('http') == 0){
            avatar = info['avatar'];
        }
        else {
            avatar = ServerUrl+"files/"+info['avatar']
        }
        $('#avatar').attr('src',avatar);
        if(!add['vip']){
            $('#vipTag').removeClass('btn-vip').addClass('btn-nonvip');
        } else {
            $('#vipTag').addClass('btn-vip').removeClass('btn-nonvip');
        }
    }

    function updateContent(force) {
        if(force || !Core.Buyer.getBuyer('info')) {
            Core.Buyer.updateMyInfo(function () {
                setAvatar();
                queryMyAccount();
            });
        } else {
            setAvatar();
            queryMyAccount();
        }
    }
    return exports = {
        init: function () {
            console.log("页面js初始化成功");
            initEvent();

            updateContent(true);
            $(document).on('pagebeforeshow', function () {
                updateContent(true);
            })
        }
    };
});