define(function (require, exports, module) {
    var options = {
        page: "#tagList",   // 页面ID
        params: {
            part:"HOT"
        }, // 请求参数
        url: 'buyer/articles',  // 请求地址
        templateId: 'tagListTmp',// 模板ID
        updateParams: function() {
            var partType = Core.Params.get('partType');
            params.part = partType.part;
            var title = partType.text;
            $(".tagList").text(title);
        }
    };
    var params = options.params;

    function initEvent() {
        var $page = $(options.page);
        if(Core.init.hasInitEvent($page)) {
            Core.Page.loadPage(options, true);
            return;
        }
        Core.Page.initPage(options);

        $page.on('click', '.item-content', function () {
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