/**
 * cordova运行环境
 */
(function (require, exports) {
    'use strict';
    var pluginName = 'ZjhPlugin';

    function updateHandler() {
        Core.App.alert('请升级最新应用版本才能使用此功能', function () {
            window.updateVersionHandler && updateVersionHandler(false);
        });
    }

    function init() {
        //注册返回按钮事件
        var block = false;
        document.addEventListener("backbutton", function () {
            if($('.popup.modal-in').length) {
                Core.App.closeModal('.popup.modal-in');
                return;
            }
            var activePage = Core.mainView.activePage;
            var pageName = activePage.name;
            if (pageName == 'login' || pageName == 'studyHome') {
                if (block) {
                    return false;
                }
                block = true;
                Core.App.confirm('确认退出', '温馨提示', function () {
                    block = false;
                    Core.Native.exit();
                }, function () {
                    block = false;
                });
                return false;
            }
            Core.Native.back();
        }, false); //返回键

        Core.Utils.checkUpdate();
    }
    var lowAppVerTip = '当前版本过低，请升级最新版本后，才能使用此功能。';
    function getErrMsg(data, defErrMsg) {
        return data === 'Invalid action' ? lowAppVerTip : (data || defErrMsg || '操作失败');
    }
    function defaultFailHandler(data, defErrMsg) {
        // Core.App.alert(getErrMsg(data, defErrMsg));
    }
    var pkgAlias = {
        TB: {
            name: '淘宝',
            android: 'com.taobao.taobao',
            ios: 'taobao://'
        },
        TM: {
            name: '天猫',
            android: 'com.tmall.wireless',
            ios: 'tmall://'
        },
        JD: {
            name: '京东',
            android: 'com.jingdong.app.mall',
            ios: 'openApp.jdMobile://'
        },
        MLS: {
            name: '美丽说',
            android: 'com.meilishuo',
            ios: 'meilishuo://'
        },
        MGJ: {
            name: '蘑菇街',
            android: 'com.mogujie',
            ios: 'mogujie://'
        }
    };
    var shareViaConfigs = {
        "WX.PYQ": {
            android: {
                handler: function (type, message, subject, fileOrFileArray, url, succ, fail) {
                    if(fileOrFileArray && !message) {
                        message = '';
                    }
                    return window.plugins.socialsharing.shareVia('com.tencent.mm/com.tencent.mm.ui.tools.ShareToTimeLineUI', message,
                        subject, fileOrFileArray, url, succ, fail);
                }
            },
            ios: {
                handler: function (type, message, subject, fileOrFileArray, url, succ, fail) {
                    if(fileOrFileArray && message) {
                        message = null;
                    }
                    return window.plugins.socialsharing.shareVia('com.tencent.xin.sharetimeline', message,
                        subject, fileOrFileArray, url, succ, fail);
                }
            }
        },
        "WX.HY": {
            android: {
                handler: function (type, message, subject, fileOrFileArray, url, succ, fail) {
                    if(fileOrFileArray && message) {
                        message = null;
                    }
                    return window.plugins.socialsharing.shareVia('com.tencent.mm/com.tencent.mm.ui.tools.ShareImgUI', message,
                        subject, fileOrFileArray, url, succ, fail);
                }
            },
            ios: {
                handler: function () {
                    return exports.shareWechat.apply(exports, arguments);
                }
            }
        },
        "QQ.HY": {
            android: {
                via: 'com.tencent.mobileqq/com.tencent.mobileqq.activity.JumpActivity'
            },
            ios: {
                via: 'com.tencent.mqq.ShareExtension'
            }
        },
        "QQ.KJ": {
            android: {
                via: 'com.tencent.mobileqq/com.tencent.mobileqq.activity.qfileJumpActivity'
            },
            ios: {
                via: 'com.tencent.mqq.ShareExtension'
            }
        },
        "XL.WB": {
            android: {
                via: 'com.sina.weibo/com.sina.weibo.composerinde.ComposerDispatchActivity'
            },
            ios: {
                via: 'com.apple.social.sinaweibo'
            }
        }
    };

    exports = window.envAdaptor = {
        isReady: function () {     // 是否已就绪
            return window.cordova && window.deviceready;
        },
        ready: function (succ) {  // 当环境准备就绪时执行，如果已就绪，直接执行
            if(typeof succ !== 'function') {
                return;
            }
            if(exports.isReady()) {
                succ();
            } else {
                document.addEventListener("deviceready", succ, false);
            }
        },
        init: function (cb) {   // 原生接口初始化
            init();
            typeof cb === 'function' && cb();
        },
        systemCopy: function (text, succ, fail) {
            cordova.exec(succ, fail || defaultFailHandler, pluginName, 'systemCopy', [text])
        },
        systemPaste: function (succ, fail) {
            cordova.exec(succ, fail || defaultFailHandler, pluginName, 'systemPaste', [])
        },
        getPicture: function (options, succ) {
            options = $.extend({
                quality: 60,
                targetWidth: 480,
                targetHeight: 480,
                encodingType: Camera.EncodingType.JPEG,
                destinationType: Camera.DestinationType.DATA_URL
            }, options);
            navigator.camera.getPicture(function (imageData) {
                var base = "data:image/png;base64," + imageData;
                succ(base);
            }, defaultFailHandler, options);
        },
        getPictureFromLib: function (options, succ) {
            options = $.extend({
                quality: 60,
                sourceType: Camera.PictureSourceType.PHOTOLIBRARY,
                encodingType: Camera.EncodingType.JPEG,
                destinationType: Camera.DestinationType.DATA_URL,
                allowEdit: true,
                targetWidth: 480,
                targetHeight: 480
            }, options);
            navigator.camera.getPicture(function (imageData) {
                var base = "data:image/png;base64," + imageData;
                succ(base);
            }, defaultFailHandler, options);
        },
        imagePicker: function (options, succ) {
            var auto = !options.width;
            options = $.extend({
                maximumImagesCount: 1,
                width: 360,
                height: 640,
                quality: 40
            }, options);
            options.count && (options.maximumImagesCount = options.count);
            if(auto) {
                if(options.quality >= 90) {
                    options.width = 1024;
                    options.height = null;
                } else if (options.quality >= 60) {
                    options.width = 720;
                    options.height = 960;
                }
            }
            window.imagePicker.getPictures(
                function (results) {
                    if (results.length > 0) {
                        $.each(results, function (i, v) {
                            v['img'] = "data:image/png;base64," + v['img'];
                        });
                        succ(results);
                    }
                }, defaultFailHandler, options
            );
        },
        openApp: function (type, succ, fail) {
            var pkg = type;
            var config;
            if(config = pkgAlias[type]) {
                pkg = config[Device.os.toLowerCase()] || type;
            }
            cordova.exec(succ, fail || defaultFailHandler, pluginName, 'openApp', [pkg]);
        },
        share: function (message, subject, fileOrFileArray, url, succ, fail) {
            Core.toast();
            window.plugins.socialsharing.share(message, subject, fileOrFileArray, url, succ, defaultFailHandler)
        },
        shareVia: function (type, message, subject, fileOrFileArray, url, succ, fail) {
            if(!type) {
                return exports.share(message, subject, fileOrFileArray, url, succ, fail);
            }
            var config = shareViaConfigs[type];
            if(!config) {
                Core.App.alert('分享类型传值不正确，请联系客服');
                return;
            }
            config = config && config[Device.ios ? 'ios' : 'android'] || {};
            if(config.handler) {
                return config.handler.apply(exports, arguments);
            } else if(config.via) {
                Core.toast();
                return window.plugins.socialsharing.shareVia(config.via, message, subject, fileOrFileArray, url, succ, defaultFailHandler)
            } else {
                return exports.share(message, subject, fileOrFileArray, url, succ, fail);
            }
        },
        shareWechat: function (type, message, subject, fileOrFileArray, succ, fail) {
            var options = {};
            options.scene = type;
            message = message || '';
            if(!fileOrFileArray) {
                options.text = message;
            } else {
                options.message = {
                    title: '指尖客分享',
                    description: message,
                    thumb: fileOrFileArray,
                    media: {
                        type: Wechat.Type.IMAGE,
                        image: fileOrFileArray
                    }
                };
            }
            Wechat.share(options, succ, defaultFailHandler);
        },
        onLogin: function(userInfo) {
            try {
                ZjhNative.onLogin(function (msg) {
                    console.info(msg);
                }, userInfo);
            } catch (ex) {
            }
        },
        getPackageInfo: function(succ) {
            return cordova.exec(succ, defaultFailHandler, pluginName, "getPackageInfo", []);
        },
        clearCache: function (succ) {
            if(Device.android) {
                navigator.app.clearCache();
                typeof succ === 'function' && succ();
            } else {
                return cordova.exec(succ, defaultFailHandler, pluginName, "clearCache", []);
            }
        },
        openBrowser: function (url, succ) {  // 在浏览器中打开链接
            var ref = cordova.InAppBrowser.open(encodeURI(url), '_system');
            typeof succ === 'function' && succ(ref);
        },
        loadPage: function (options) {    // 默认方式加载页面
            options = options || {};
            if (typeof options === 'string') {
                options = {
                    url: options
                };
            }
            if(options.url && Core.mainView.params.domCache) {
                var url = options.url;
                if (url && url.indexOf('#') === 0) {
                    options.pageName = url.split('#')[1];
                    delete options.url;
                } else if(url && url.indexOf('http') == 0) {
                    if(Device.ios && url.match(/www.alimama.com\/user\/limit_status.htm/)) {
                        if(!Core.Config.getConfig('customUA')) {
                            return updateHandler();
                        }
                        cordova.InAppBrowser.open(encodeURI(url), '_blank', 'toolbarposition=top,title=检查信息完整性,enableViewportScale=yes,userAgent=Mozilla/5.0 (Linux; U; Android 5.1.1; zh-cn; Mi-4c Build/LMY47V) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/53.0.2785.146 Mobile Safari/537.36 XiaoMi/MiuiBrowser/8.5.14');
                    } else {
                        cordova.InAppBrowser.open(encodeURI(url), '_system');
                    }
                    return;
                } else {
                    var pageName = url.match(/^\.*\/?([^?]*)(\?.*)?$/)[1].replace(/\//g, '_').replace(/\.html$/, '');
                    if($("#" + pageName).length) {
                        options.pageName = pageName;
                        delete options.url;
                    }
                }
            }
            var query = options.query || $(this).data('query') || $(this).data() || {};
            if(options.url && options.url.indexOf('?')) {
                query = $.extend(query, Dom7.parseUrlQuery(options.url));
            }
            options.query = query;
            Core.mainView.router.load(options);
        },
        setTitle: function (options) {
            if(typeof options === 'string') {
                options = { title: options }
            }
            $(Core.mainView.activePage.container).find('.navbar .center').text(options.title);
        },
        back: function (options) {    // 返回上一页
            var activePage = Core.mainView.activePage;
            if($(activePage.container).hasClass('has-form')) {
                Core.App.confirm('是否离开当前页面？', '温馨提示', function () {
                    Core.mainView.router.back(options);
                });
                return false;
            }
            if(activePage.name == 'studyHome') {
                return;
            }
            Core.mainView.router.back(options);
        },
        exit: function (options) {     // 退出
            navigator.app.exitApp();
        },
        splashscreen: function (action) {     // 启动页操作
            if(!action) {
                return;
            }
            if(navigator.splashscreen && navigator.splashscreen[action]) {
                navigator.splashscreen[action]();
            } else {
                setTimeout(function () {
                    exports.splashscreen(action);
                }, 100);
            }
        },
        getTbIdForUrl: function (url, secc, fail) {
            cordova.exec(function(goodId) {
                if(goodId) {
                    var goodType = goodId.charAt(goodId.length - 1) == ' ' ? 'tmall' : 'taobao';
                    goodId = goodId.trim();
                    var url = 'https://detail.' + goodType + '.com/item.htm?id=' + goodId;
                    typeof secc === 'function' && secc(goodId, goodType, url);
                }
            }, function (data) {
                var errMsg = getErrMsg(data, "获取商品ID失败");
                if(typeof fail === 'function') {
                    fail(errMsg);
                } else {
                    Core.App.alert(errMsg);
                }
            }, pluginName, "getTbIdForUrl", [url]);
        }
    };
    exports.ready(function () {
        exports.splashscreen('hide');
    });
    return exports;
})();