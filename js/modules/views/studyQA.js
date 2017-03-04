define(function (require, exports, module) {
    var options = {
        page: "#studyQA",   // 页面ID
        params: {
            articleId: '1000',
            pageSize:10
        }, // 请求参数
        url: 'buyer/questions',  // 请求地址
        templateId: 'askList',// 模板ID
        updateParams: function() {
            var article = Core.Params.get('article');
            params.articleId = article.id;
            var title = article.title;
            $(".title-name").text(title);
        }
    };
    var params = options.params;

    function getFormData(isCheck) {
        var $page = $(options.page);
        var data = Core.App.formToJSON('#question') || {};

        if(isCheck) {
            var notNullRules = {
                content:'提问内容'
            };

            for(var k in notNullRules) {
                if(!data[k]) {
                    var v = notNullRules[k];
                    Core.App.alert(v + '不能为空', function () {
                        $page.find('input[name="' + k + '"]').focus();
                    });
                    return null;
                }
            }
        }
        return data;
    }

    function initEvent() {
        var $page = $(options.page);
        if(Core.init.hasInitEvent($page)) return;
        Core.Page.initPage(options);
        $page.on('click', '.sub-question', function () {

            var data = getFormData(true);

            if(!data) {
                return false;
            }

            data["article.id"] = params.articleId;

            if(!data["open"].length){
                data["open"] = '1';
            }
            if(data["open"].length){
                data["open"].length --;
            }

            Core.Service.post('buyer/articlesQuestion', data, function (data) {
                var buyer = Core.Buyer.getBuyer() || {};
                buyer["article"] = data;
                Core.Buyer.setBuyer(buyer);
                Core.App.alert('问题提交成功，请耐心等待寒羽回答', function () {
                    Core.Page.back();
                });
            });
        }).on('click', '.card-header', function () {
            var id = $(this).data('id');
            if(!id) {
                return;
            }
            Core.Params.set('articleId', id);
            Core.Page.changePage.call(this, 'article.html');
        }).on('click', '.listen',function () {
            var questionId = $(this).data('id');
            var params = {
                id: questionId,
                isMine: true
            };
            Core.Params.set('question', params);
            Core.Page.changePage.call(this, 'answer.html');
        }).on('click', '.like',function () {
            var questionId = $(this).data('id');
            Core.Service.post('buyer/collectArticle', {
                articleId: questionId,
                state: 3
            }, function () {

            });
        }).on('click', '.ask',function () {
            var title = $(this).data('title');
            var id = $(this).data('id');
            Core.Params.set("article",{
                id:id,
                title:title
            });
            Core.Page.changePage.call(this,'studyQA.html');
        });
    }

    return exports = {
        init: function () {
            console.log("页面js初始化成功");
            initEvent();
        }
    };
});