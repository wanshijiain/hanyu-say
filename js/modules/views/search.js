define(function (require, exports, module) {
    var options = {
        page: "#search",   // 页面ID
        params: {
            title:null
        }, // 请求参数
        url: 'buyer/articles',  // 请求地址
        templateId: 'searchList'  // 模板ID
    };
    var params = options.params;

    var timer = null;
    function Search(keyword) {
        params.title = keyword;
        Core.Page.loadPage(options, true);
    }
    function initEvent() {
        var $page = $(options.page);
        if(Core.init.hasInitEvent($page)) return;
        Core.Page.initPage(options);
        $page.on('click', '.item-content', function () {
            var id = $(this).data('id');
            Core.Params.set('articleId', id);
            Core.Page.changePage.call(this, 'article.html');
        }).on('click', '.part-tag', function () {
            var part = $(this).data('part');
            var text = $(this).data('text');
            Core.Params.set("partType",{
                part:part,
                text:text
            });
            Core.Page.changePage.call(this,'tagList.html');
        });
        Core.Page.initPage(options);
        Core.App.searchbar('.searchbar',{
            customSearch: true,
            onSearch: function(e, data) {
                Search(data.query);
            },
            onClear: function () {
                Search(null);
            }
        });
    }

    function updateTop() {
        Core.Service.post('buyer/article/parts', {}, function (data) {
            var $page = $(options.page);
            var html = Core.Template.render('partTab', data);
            $page.find('.new_container').html(html);
        });
    }

    return exports = {
        init: function () {
            console.log("页面js初始化成功");
            initEvent();
            updateTop();
        }
    };
});