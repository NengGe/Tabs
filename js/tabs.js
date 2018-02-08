(function (window,undefined) {
    function toArray(arr) {
        return Array.prototype.slice.call(arr);
    }
    var G = function (selector, context) {
        return new G.fn.init(selector, context);
    }
    //得到一个元素得所有父元素。
    var getParents = function(args){
        var arr = [];
        (function fn(args){
            if(args.parentNode){
                arr.push(args.parentNode);
                fn(args.parentNode);
            }else{
                return arr;
            }
        })(args);
        return arr;
    }
    var indexof = [].indexOf;

    G.fn = G.prototype = {
        constructor: G,
        init: function (selector, context) {
            this.length = 0;
            var context = context || document;
            if (selector[0] === '#') {
                this[0] = document.getElementById(selector.substr(1));
                this.length = 1;
            } else if (typeof selector == 'string' && selector.indexOf('#') !== 0) {
                var aNode = context.querySelectorAll(selector);
                for (var i = 0; i < aNode.length; i++) {
                    this[i] = aNode[i];
                }
                this.length = aNode.length;
            } else if (typeof selector == 'object') {
                if (selector.length) {
                    var len = selector.length;
                    for (var i = 0; i < len; i++) {
                        this[i] = selector[i];
                    }
                    this.length = len;
                } else {
                    this[0] = selector;
                    this.length = 1;
                }
            } else {
                //function的情况。
            }
            this.selector = selector;
            this.context = context;
            return this;
        },
        length: 0,
        on: function (evType, callback) {
            for (var i = 0; i < this.length; i++) {
                this[i].addEventListener(evType, callback);
            }
        },
        size: function () {
            return this.length;
        },
        is:function(args){
            var aArgs = document.querySelectorAll(args);
            if(args){
                for(var i = 0;i < this.length;i++){
                    if(indexof.call(aArgs,this[i]) != -1){
                        return true;
                    }
                }
                return false;
            }
        },
        get: function (index) {
            return this[index];
        },
        children: function (args) {
            if (!args) {
                return G(this[0].children);
            }
            if (args) {
                var selector = args;
                return G(selector, this[0]);
            }
        },
        parent: function () {
            return G(this[0].parentNode);
        },
        parents: function (args) {
            var parents = getParents(this[0]),
                arr = [];
            if(!args){
                return G(parents);
            }else{
                for(var i = 0,len = parents.length;i < len;i++){
                    if(G(parents[i]).is(args)){
                        arr.push(parents[i]);
                    }
                }
                return G(arr);
            }
        },
        eq: function (index) {
            return G(this[index]);
        },
        siblings: function () { //注意上下文的使用。
            var parent = this[0].parentNode;
            if (arguments.length) {
                var selector = arguments[0],
                    oInit = G(selector, parent),
                    arr = [];
                for (var i = 0; i < oInit.length; i++) {
                    if (oInit[i] !== this[0])
                        arr.push(oInit[i]);
                }
                return G(arr);
            } else {
                var children = toArray(parent.children);
                var index = children.indexOf(this[0]);
                children.splice(index, 1);
                return G(children);
            }
        },
        hide:function(){
            for(var i = 0;i < this.length;i++){
                this[i].style.display = 'none';
            }
        },
        show:function(){
            for(var i = 0;i < this.length;i++){
                this[i].style.display = 'block';
            }
        },
        removeClass: function (str) {
            for (var i = 0; i < this.length; i++) {
                var oldClassName = this[i].className.split(' ');
                var index = oldClassName.indexOf(str);
                if (index !== -1) {
                    oldClassName.splice(index, 1);
                    this[i].className = oldClassName.join(' ');
                }
            }
            return this;
        },
        addClass: function (str) {
            for (var i = 0; i < this.length; i++) {
                var oldClassName = this[i].className.split(' ');
                var index = oldClassName.indexOf(str);
                if (index === -1) {
                    oldClassName.push(str);
                    this[i].className = oldClassName.join(' ').replace(/\s^/,'');
                }
            }
            return this;
        },
        attr: function () {
            //设置属性
            if (arguments.length == 2) {
                this[0].setAttribute(arguments[0], arguments[1]);
            }
            //得到属性
            if (arguments.length == 1) {
                return this[0].getAttribute(arguments[0]);
            }
        },
        index: function (args) {
            if (!args) {
                return indexof.call(this.parent().children(), this[0]);
            } else {
                var aInit = G(args, this.parent()[0]);
                return indexof.call(aInit, this[0]);
            }
        }
    }
    G.fn.init.prototype = G.fn = G.prototype;
    
    G.isArray = function (obj) {
        return Object.prototype.toString.call(obj) === "[object Array]";
    }
    G.extend = G.fn.extend = function (copy, obj1, obj2) {
        var obj = obj1 || {};
        //浅拷贝
        if (typeof arguments[0] == 'object') {
            if (arguments.length == 2) {
                for (var key in obj2) {
                    obj[key] = obj2[key];
                }
            } else {
                return this;
            }
        } else {//深拷贝
            if (copy) {
                for (var key in obj2) {
                    var prop = obj2[key];
                    if (prop == obj2) {
                        continue;
                    }
                    if (typeof obj2[key] === 'object') {
                        obj[key] = G.isArray(obj2[key]) ? [] : {};
                        arguments.callee(copy, obj[key], obj2[key]);
                    } else {
                        obj[key] = obj2[key]
                    }
                }
            }
        }
        return obj;
    }

    //扩展选项卡插件   缺点：定制性不够
    G.fn.Tabs = function (opt) {
        var def = {evType:'click'};
        var newOpt = G.extend(true,def,opt);
        G('.tabs-ul li').on(newOpt.evType,function(){
            var index = G(this).index('li');
            G(this).addClass('active').siblings('li').removeClass('active');
            var id = G('.content').eq(index).attr('id');
            G('.content').hide(); //所有的content消失。
            G('#' + id).show();
        });
    }


    window.G = G;
})(window);