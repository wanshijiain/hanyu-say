define(function (require, exports, module) {
    var options = {
        page: "#article",   // 页面ID
        params: {
            id:'1000'
        }, // 请求参数
        url: 'buyer/article',  // 请求地址
        templateId: 'articleContainer',  // 模板ID
        updateParams: function() {
            var articleId = Core.Params.get('articleId');
            params.id = articleId;
        }
    };
    var params = options.params;

    function initEvent() {
        var $page = $(options.page);
        if(Core.init.hasInitEvent($page)) return;
        Core.Page.initPage(options, function () {
            var $video = $page.find('video');
            if($video.length == 0) {
                return;
            }
            seajs.use('video-js', function () {
                $video.each(function () {
                    var $v = $(this);
                    videojs(this, {
                        width: $v.width(),
                        height: $v.height()
                    }, function () {
                        $('.video-js button').addClass('no-fastclick');
                    });
                });
            });
        });
        $page.on('click', '.ask-btn', function () {
            var title = $(this).data('title');
            var id = $(this).data('id');
            Core.Params.set("article",{
                id:id,
                title:title
            });
            Core.Page.changePage.call(this,'studyQA.html');
        }).on('click', '.share-btn', function () {
            var articleId = $(this).data('id');
            var title = $(this).data('title');
            Core.Native.share({message:title},function () {
                var params = {
                    articleId:articleId,
                    state:'4'
                };
                Core.Service.post('buyer/collectArticle', params, function () {
                    Core.App.alert('分享成功！');
                });
            });
        }).on('click', '.collect-tag', function () {
            var articleId = $(this).data('id');
            var isMyCollect = $(this).data('mycollect');
            var params = {
                articleId:articleId,
                state:'3'
            };
            if(isMyCollect){
                Core.Service.post('buyer/cancelCollectArticle', params, function () {
                    Core.App.alert('已取消收藏！');
                    $(".icon-heart").removeClass("collected");
                    $(".collect").text("收藏");
                    $(".collect").removeClass("collected");
                    $(".collect-tag").data('mycollect',false);
                });
            }
            else {
                Core.Service.post('buyer/collectArticle', params, function () {
                    Core.App.alert('收藏成功！');
                    $(".icon-heart").addClass("collected");
                    $(".collect").text("已收藏");
                    $(".collect").addClass("collected");
                    $(".collect-tag").data('mycollect',true);
                });
            }
        })
    }

    return exports = {
        init: function () {
            console.log("页面js初始化成功");
            initEvent();
        }
    };
});