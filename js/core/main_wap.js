var basePath = (function () {
    var pagePath = location.href.match(/[a-zA-Z0-9:_./\-]*\/page\//)[0];
    return pagePath.replace('/page/', '/');
})();

var timeOut = 15;   //请求超时时间
var ServerUrl = '/';
var BaseSeajsPref = basePath + 'js/module/page/';

function getParameter(name, url) {
    var value = String(url || location).match(new RegExp('[?&]' + name + '=([^&#]*)([&#]?)', 'i'));
    return value ? value[1] : null;
}

seajs.config({
    base: basePath,
    alias: {
        'jquery': 'static/libs/jquery/jquery-3.1.1.min',
        'core': 'js/core/core',
        'cookie': 'static/libs/jquery-cookie/jquery-cookie-1.4.1.min',
        'md5': 'js/module/common/md5',
        'sha': 'static/libs/others/sha',
        'alisdk': 'js/module/common/AlimamaSDK'
    }
});

var injectScript = function(url, onload, onerror) {
    var script = document.createElement("script");
    script.onload = onload;
    script.onerror = onerror;
    script.src = url;
    document.head.appendChild(script);
};

window.isWeixinBrowser = /micromessenger/i.test(navigator.userAgent);

function showWeixinTip(type) {
    var action = type ? 'show' : 'hide';
    if(null == type || type === 'auto') {
        action = isWeixinBrowser ? 'show' : 'hide';
    }
    if(action === 'show') {
        $('.weixinTip').addClass('active');
    } else {
        $('.weixinTip').removeClass('active');
    }
}

injectScript(basePath + 'static/libs/framework7/js/framework7.min.js', function () {

    window.isWap = true;

    seajs.use(['jquery', 'core'], function (_, Core) {
        Core.init();
    });

});
