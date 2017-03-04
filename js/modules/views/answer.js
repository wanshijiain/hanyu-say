define(function (require, exports, module) {
    var options = {
        page: "#answer",   // 页面ID
        params: {
            questionId:'1011'
        }, // 请求参数
        url: 'buyer/queryMyquestion',  // 请求地址
        templateId: 'answerTmp',  // 模板ID
        updateParams: function() {
            var question = Core.Params.get('question');
            params.questionId = question.id;
            options.url = question.isMine ? 'buyer/queryMyquestion' : 'buyer/listenQuestion';
        }
    };
    var params = options.params;

    function initEvent() {
        var $page = $(options.page);
        if(Core.init.hasInitEvent($page)) return;
        Core.Page.initPage(options);
        $page.on('click', '.facebook-name', function () {
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