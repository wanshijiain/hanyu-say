define(function (require, exports, module) {
    var options = {
        page: "#collection",   // 页面ID
        params: {
            state:"3"
        }, // 请求参数
        url: 'buyer/queryMyArticles',  // 请求地址
        templateId: 'collectionTmp'// 模板ID
    };
    var params = options.params;


    function initEvent() {
        var $page = $(options.page);
        if(Core.init.hasInitEvent($page)){
            Core.Page.initPage(options);
            return;
        }
        Core.Page.initPage(options);



        $page.on('click', '.card-content', function () {
            var id = $(this).data('id');
            Core.Params.set('articleId', id);
            Core.Page.changePage.call(this, 'article.html');
        })
    }

    return exports = {
        init: function () {
            console.log("页面js初始化成功");
            initEvent();
        }
    };
});