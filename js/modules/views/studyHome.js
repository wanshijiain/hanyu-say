define(function (require, exports, module) {
    var options = {
        page: "#studyHome",   // 页面ID
        params: {
        }, // 请求参数
        url: 'buyer/articles',  // 请求地址
        templateId: 'articleList'  // 模板ID
    };
    var params = options.params;


    function initEvent() {
        var $page = $(options.page);
        if(Core.init.hasInitEvent($page)) return;
        Core.Page.initPage(options);
        $page.on('click', '.item-content', function () {
            var id = $(this).data('id');
            Core.Params.set('articleId', id);
            Core.Page.changePage.call(this, 'article.html');
        });

        Core.App.onPageReinit('studyHome', function () {
            var $page = $(options.page);
            Core.Page.initPage(options);
        });
    }

    function initSession() {
        seajs.use('cookie', function () {
            $.cookie.raw = true;
            var item = localStorage.getItem("rememberMeShike");
            item && $.cookie('rememberMeShike', item, {expires: 7, path: '/'});
        });
    }
    return exports = {
        init: function () {
            console.log("页面js初始化成功");
            initSession();
            initEvent();
            Core.Utils.checkUpdate();
        },
        initBanner: function () {
            return false;
        }
    };
});