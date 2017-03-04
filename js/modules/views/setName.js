define(function(require, exports, module) {
    var options = {
        page: "#setName"
    };

    function getFormData(isValid) {
        var formData = Core.App.formToJSON('#setNameForm');
        if (isValid) {
            if (!formData['name']) {
                Core.App.alert("请输入昵称！");
                return null;
            }
        }
        return formData;
    }

    function initEvent() {
        var $page = $(options.page);
        if(Core.init.hasInitEvent($page)) return;

        $page.on('click', '.set-name', function () {
            var formData = getFormData(true);
            if (!formData) {
                return false;
            }
            var data = $.extend({}, formData);
            var info = Core.Buyer.getBuyer('info');
            data['loginName'] = info['loginName'];
            Core.Service.postFile(' /buyer/info/modifyMyInfo', data, function () {
                Core.App.alert("修改昵称成功！", function () {
                    Core.Page.changePage('personalInfo.html');
                });
            });
            return false;
        });
    }
    return exports = {
        init: function () {
            console.log("页面js初始化成功");
            initEvent();
        }
    };

});
