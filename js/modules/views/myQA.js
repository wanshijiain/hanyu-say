define(function (require, exports, module) {
    var options = {
        page: "#myQA",   // 页面ID
        params: {
            state: '0',
            pageSize:10
        }, // 请求参数
        url: 'buyer/questions',  // 请求地址
        templateId: 'myAsk'// 模板ID
    };
    var params = options.params;

    function initEvent() {
        var $page = $(options.page);
        if(Core.init.hasInitEvent($page)) return;
        Core.Page.initPage(options);
        $page.on('click', '.card-header', function () {
            var id = $(this).data('id');
            Core.Params.set('articleId', id);
            Core.Page.changePage.call(this, 'article.html');
        }).on('click', '.listen',function () {
            var $that = $(this);
            var questionId = $that.data('id');
            var params = {
                id: questionId,
                isMine: $that.data('mine')
            };
            Core.Params.set('questionId', params);
            Core.Page.changePage.call(this, 'answer.html');
        }).on('click', '#tabtwo',function () {
            var params = {
                state:1,
                pageSize:10
            };
            Core.Service.post('buyer/questions', params, function (dataresult) {
                var $page = $(options.page);
                var html = Core.Template.render('myListen', dataresult);
                $page.find('.new_container').html(html);
            });
        });
    }

    return exports = {
        init: function () {
            console.log("页面js初始化成功");
            initEvent();
        }
    };
});