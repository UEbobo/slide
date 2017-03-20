// JavaScript Document
(function($) {
    $.fn.slider = function(options) {

        //默认配置
        var defaults = {
            dataSource: [],
            animation: 'slide', //转换方式 fade淡入淡出 slide滚动
            stayTime: 3000, //停留时间
            switchTime: 300, // 切换的时间
            directionNav: true, //是否显示左右控制按钮 true&false
            controlNav: true, //是否显示下方控制按钮 true&false
            controlNavSeat: 'bottom', //下方控制按钮的位置  top&bottom
            progressBar: { // 进度条的相关配置
                show: true, // 是否显示
                backgroundColor: '#3385ff', // 进度条的颜色
                height: 5 // 进度条的高度
            }
        };

        // 定义对象
        var slider = {};

        // 配置项扩展
        var opts = $.extend({}, defaults, options);

        // 全局变量
        var GLOBAL = {
            SLIDER_DOM: this,
            SLIDER_WIDTH: this.width(),
            SLIDER_NUM: opts.dataSource.length // 数组的长度，也就是幻灯片的个数
        };

        // 变量t（循环函数）
        var t;

        // 变量time(次数)
        var time = 0;

        slider = {

            /**
             * [init 初始化]
             * @return {[type]} [description]
             */
            init: function() {
                var that = this;
                that.renderDom();
                that.eventHandle();
            },

            /**
             * [renderDom 渲染dom]
             * @return {[type]} [description]
             */
            renderDom: function() {
                var dataSource = opts.dataSource,
                    length = dataSource.length,
                    dot = '';
                dom = '<ul style="width:' + GLOBAL.SLIDER_WIDTH * GLOBAL.SLIDER_NUM + 'px">';
                for (var i = 0; i < dataSource.length; i++) {
                    var _this = dataSource[i];
                    dom += '<li>' +
                        '<a href="' + _this.link + '" target="_blank">' +
                        '<img style="width:' + GLOBAL.SLIDER_WIDTH + 'px" src=' + _this.src + '>' +
                        '</a>' +
                        '</li>';
                    if (i === 0) {
                        dot += '<a href="javaScript:void(null)" class="control-nav control-nav-selected"></a>'
                    } else {
                        dot += '<a href="javaScript:void(null)" class="control-nav"></a>'
                    };

                }
                dom += '</ul>';
                GLOBAL.SLIDER_DOM.append(dom);

                // 是否显示圆点控制按钮
                if (opts.controlNav) {

                    // 圆点位置控制
                    if (opts.controlNavSeat === 'top') {
                        var controlDom = '<div class="control-nav-wrap control-nav-wrap-top">'
                    } else if (opts.controlNavSeat === 'bottom') {
                        var controlDom = '<div class="control-nav-wrap control-nav-wrap-bottom">'
                    };
                    controlDom = controlDom + dot + '</div>'
                    GLOBAL.SLIDER_DOM.append(controlDom);
                };

                // 是否显示左右控制按钮
                if (opts.directionNav) {
                    var directionDom = '<div class="direction-nav direction-prev">' +
                        '<i></i>' +
                        '</div>' +
                        '<div class="direction-nav direction-next">' +
                        ' <i></i>' +
                        '</div>';
                    GLOBAL.SLIDER_DOM.append(directionDom);

                }


                // 是否显示进度条
                if (opts.progressBar && opts.progressBar.show) {
                    var style = 'style="background-color:' + opts.progressBar.backgroundColor + ';height:' + opts.progressBar.height + 'px"';
                    var progressDom = '<div id="progressBar" class="progress-bar"' + style + '></div>';
                    GLOBAL.SLIDER_DOM.append(progressDom);
                    slider.process();
                }

                // 效果
                this.effect();

            },

            /**
             * [effect 效果实现]
             * @return {[type]} [description]
             */
            effect: function() {

                if (opts.animation === 'slide') {

                    // 向左滑动
                    t = setInterval(function() {
                        time++;
                        slider.slither();
                    }, opts.stayTime);

                } else if (opts.animation === 'fade') {

                    // 淡入效果
                    t = setInterval(function() {
                        time++;
                        slider.fade();
                    }, opts.stayTime);
                };

            },
            slither: function(index) {
                var ul = GLOBAL.SLIDER_DOM.find('ul');

                // 判断是不是左右按钮点击进来的
                if (index || index == 0) {
                    time = index;
                };

                // 如果是最后一个
                if (GLOBAL.SLIDER_NUM <= time) {
                    time = 0;
                }

                // 圆点控制
                $('.control-nav-wrap a').eq(time).addClass('control-nav-selected').siblings().removeClass('control-nav-selected');
                ul.animate({
                    'left': '-' + GLOBAL.SLIDER_WIDTH * time + 'px'
                }, opts.switchTime, function() {
                    //slider.process();
                });
                slider.process();
            },

            fade: function(index) {

                // 判断是不是左右按钮点击进来的
                if (index || index == 0) {
                    time = index;
                };

                // 如果是最后一个
                if (GLOBAL.SLIDER_NUM <= time) {
                    time = 0;
                }

                // 效果实现
                $(GLOBAL.SLIDER_DOM.find('li')).hide();
                $(GLOBAL.SLIDER_DOM.find('li')[time]).fadeIn(opts.switchTime);
                $('.control-nav-wrap a').eq(time).addClass('control-nav-selected').siblings().removeClass('control-nav-selected');
                slider.process();
            },

            process: function() {
                if (opts.progressBar && opts.progressBar.show) {
                    $('#progressBar').stop(true, true).animate({
                        'width': '100%'
                    }, opts.stayTime, function() {
                        slider.processInit();
                    });
                }
            },
            processInit: function() {
                $('#progressBar').css({
                    'width': '0'
                })
            },

            renderAfter: function() {

            },

            /**
             * [eventHandle 事件处理]
             * @return {[type]} [description]
             */
            eventHandle: function() {

                // hover悬停
                GLOBAL.SLIDER_DOM.hover(function() {
                    clearInterval(t);
                }, function() {
                    slider.effect();
                });

                // 圆点点击
                $('.control-nav-wrap').on('click', 'a', function() {

                    slider.processInit();

                    var index = $(this).index();

                    if (opts.animation === 'slide') {
                        slider.slither(index);
                    } else if (opts.animation === 'fade') {
                        slider.fade(index);
                    };

                });

                // 向左导航点击
                $('.direction-prev').on('click', function(e) {

                    slider.processInit();

                    e.stopPropagation();
                    var index = $('.control-nav-selected').index();
                    index === 0 ? index = GLOBAL.SLIDER_NUM - 1 : index = index - 1;
                    if (opts.animation === 'slide') {
                        slider.slither(index);
                    } else if (opts.animation === 'fade') {
                        slider.fade(index);
                    };

                });

                // 向右导航点击
                $('.direction-next').on('click', function(e) {
                    e.stopPropagation();
                    var index = $('.control-nav-selected').index() + 1;
                    if (opts.animation === 'slide') {
                        slider.slither(index);
                    } else if (opts.animation === 'fade') {
                        slider.fade(index);
                    };

                });
            }

        };

        // 初始化
        slider.init();
    };


})(jQuery);
