define(function (require, exports, module) {
    var options = {
        page: "#personalInfo"
    };
    function initEvent() {
        var $page = $(options.page);
        if(Core.init.hasInitEvent($page)) return;

        $page.on('refresh', ".pull-to-refresh-content", function(e) {
            updateContent(true);
        }).on('click', '.changeAvatar', function () {
            var that = $(this);
            var buttons = [
                {
                    text: '拍照',
                    onClick: function () {
                        Core.Native.getPicture({
                            width: 400,
                            height: 400,
                            quality: 60
                        }, function (imageData) {
                            uploadAvatar(imageData, that);
                        });
                    }
                },
                {
                    text: '选择照片',
                    onClick: function () {
                        Core.Native.getPictureFromLib({
                            width: 400,
                            height: 400,
                            quality: 60
                        }, function (imageData) {
                            uploadAvatar(imageData, that);
                        });
                    }
                },
                {
                    text: '取消',
                    color: 'red'
                }
            ];
            Core.App.actions(buttons);
        })
    }
    function setAvatar() {
        var info = Core.Buyer.getBuyer('info') || {};
        $("#phoneNumber").text(info['loginName']);
        $("#userid").text(info['name']);
        var avatar  =  info['avatar'];
        if(!info['avatar']){
            avatar = basePath + "static/images/touxiang.png";
        }else if(avatar.indexOf('http') == 0){
            avatar = info['avatar'];
        }
        else {
            avatar = ServerUrl+"files/"+info['avatar']
        }
        $('#headpic').attr('src',avatar);
    }
    function uploadAvatar(base64, that) {
        Core.Service.postFile('buyer/info/modifyAvatar', {
            files: [
                {
                    key: "avatar_",
                    base: base64
                }
            ]
        }, function (data) {
            var tmp  = Core.Buyer.getBuyer();
            tmp['info']['avatar']= data['avatar'];
            Core.Buyer.setBuyer(tmp);
            setAvatar();
            Core.App.alert('头像上传成功');
        });
    }

    function updateContent(force) {
        if(force || !Core.Buyer.getBuyer('info')) {
            Core.Buyer.updateMyInfo(function () {
                setAvatar();
            });
        } else {
            setAvatar();
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