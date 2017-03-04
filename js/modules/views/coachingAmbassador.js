define(function (require, exports, module) {
    var options = {
        page: "#coachingAmbassador"
    };
    function initEvent() {
        var $page = $(options.page);
        if(Core.init.hasInitEvent($page)) return;

        $page.on('refresh', ".pull-to-refresh-content", function(e) {
            updateContent(true);
        });
    }
    function setName() {
        var info = Core.Buyer.getBuyer('info') || {};
        $("#who-am-i").text(info['name']);
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