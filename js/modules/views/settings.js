define(function (require, exports, module) {
    var options = {
        page: "#settings"
    };
    function initEvent() {
        var $page = $(options.page);
        if(Core.init.hasInitEvent($page)) return;

        $page.on('refresh', ".pull-to-refresh-content", function(e) {
            updateContent(true);
        }).on('click', '.cleanCache', function () {
            Core.App.confirm('清除缓存后会重启应用', '是否清除？', function() {
                Core.Native.clearCache(function () {
                    location.reload();
                });
            });
        }).on('click', '.logout', function (e) {
            e.preventDefault();
            Core.Buyer.LoginOut();
            return false;
        });
    }
    function setName() {
        var info = Core.Buyer.getBuyer('info') || {};
        $("#nickname").text(info['name']);
    }

    function updateContent(force) {
        if(force || !Core.Buyer.getBuyer('info')) {
            Core.Buyer.updateMyInfo(function () {
                setName();
            });
        } else {
            setName();
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