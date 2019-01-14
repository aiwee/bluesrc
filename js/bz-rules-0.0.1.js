if (typeof require === 'function') {
    var Blues = require('./bz-core-2.0.0');
}
;(function(root, factory) {
    if (typeof exports === 'object') {
        module.exports = factory(window, document)
    } else {
        root.Condition = factory(window, document)
    }
})(this, function(w, d) {
    'use strict';
    var CN = function (options) {
        options = options || {};
        this.o = {};
        for (var k in CN.defaultOptions) {
            if (CN.defaultOptions.hasOwnProperty(k)) {
                if (options.hasOwnProperty(k))
                    this.o[k] = options[k];
                else
                    this.o[k] = CN.defaultOptions[k];
            }
        }
        if (this.o.triggers == null)
            return;
        this.init();
    };
    CN.prototype = {
        init: function() {
            var cn = this;
            if (Blues.check.ifArray(cn.o.triggers)) {
                for (var i = 0; i < cn.o.triggers.length; i++)
                    cn.triggers(cn.o.triggers[i]);
            } else if (typeof cn.o.triggers === 'string')
                cn.triggers(cn.o.triggers);
            else return;
        },
        triggers: function(trigger) {
            var cn = this;
            var events = Blues.convert.objectToArray(cn.o.events);
            if (Blues.check.ifArray(events)) {
                for (var i = 0; i < events.length; i++) {
                    var evntName = events[i][0];
                    var evntTarget = events[i][1];
                    var targets = Blues.convert.objectToArray(evntTarget);
                    cn.events(trigger, evntName, targets);
                }
            }
        },
        events: function(trigger, evntName, targets) {
            var cn = this;
            if (evntName == 'click' || evntName == 'change' || evntName == 'focus' || evntName == 'blur') {
                bzDom(trigger).on(evntName, function() {
                    for (var j = 0; j < targets.length; j++) {
                        cn.setactions(targets[j], cn.o.targets);
                    }
                });
            }
            if (evntName == 'select') {
                bzDom(trigger).on('change', function() {
                    var selected = this.value;
                    for (var j = 0; j < targets.length; j++) {
                        cn.onselect(selected, targets[j]);
                    }
                });
            }
            if (evntName == 'toggle') {
                bzDom(trigger).toggle(function() {
                    for (var j = 0; j < targets.length; j++) {
                        cn.setactions(targets[j]);
                    }
                }, function() {
                    for (var j = 0; j < targets.length; j++) {
                        cn.setactions(targets[j]);
                    }
                });
            }
            if (evntName == 'blur') {
                bzDom(trigger).on(evntName, function() {
                    for (var j = 0; j < targets.length; j++) {
                        cn.setactions(targets[j], trigger);
                    }
                });
            }
            // if (evntName == 'valid') {
            //
            // }
            // if (evntName == 'invalid') {
            //
            // }
        },
        // ontoggle: function(targets) {
        //     var targetIds = targets[1];
        //     for (var l = 0; l < targetIds.length; l++) {
        //         var targetId = targetIds[l];
        //         if (Blues.check.ifIdentifier(targetId) && bzDom(targetId).exist()) {
        //             bzDom(targetId).toggle();
        //         }
        //     }
        // },
        onselect: function(selected, target) {
            var cn = this;
            var setName = target[0];
            if (selected === setName) {
                var setValue = target[1];
                var targets = Blues.convert.objectToArray(setValue);
                for (var j = 0; j < targets.length; j++) {
                    cn.setaction(targets[j][0], targets[j][1]);
                }
            }
        },
        setactions: function(targets, trigger) {
            var cn = this;
            var actName = targets[0],
                actions = targets[1];
            if (typeof actions === 'string') {
                cn.setaction(actName, actions);
            } else if (Blues.check.ifArray(actions)) {
                for (var k = 0; k < actions.length; k++) {
                    cn.setaction(actName, actions[k]);
                }
            } else if (Blues.check.ifObject(actions)) {
                var _actions = Blues.convert.objectToArray(actions);
                for (var k = 0; k < _actions.length; k++) {
                    cn.setaction(actName, _actions[k], trigger);
                }
            }
        },
        setaction: function(actname, actions, trigger) {
            var cn = this;
            if (typeof actions === 'string') {
                cn.action(actions, actname);
            } else if (Blues.check.ifArray(actions) && actname != 'valid') {
                var tarName = actions[0],
                    actVal = actions[1];
                cn.action(tarName, actname, actVal);
            } else if(Blues.check.ifArray(actions) && actname == 'valid') {
                var tarName = actions[0],
                    actVal = actions[1];
                if (actname === 'valid') {
                    var inpt = bzDom(trigger);
                    if (typeof inpt.onattr('data-rules') === 'string') {
                        if (inpt.ifclass('valid'))
                            cn.action(actVal, tarName, actname, trigger);
                    } else {
                        if (bzDom(trigger).onattr('valid') == '')
                            cn.action(actVal, tarName, actname, trigger);
                    }


                }
            }
        },
        action: function(target, actname, actvalue, trigger) {
            if (actname == 'toggle')
                bzDom(target).toggle();
            if (actname == 'toggleclass')
                bzDom(target).toggleclass(actvalue);
            if (actname == 'onclass')
                bzDom(target).onclass(actvalue);
            if (actname == 'offclass')
                bzDom(target).offclass(actvalue);
            if (actname == 'hide')
                bzDom(target).hide();
            if (actname == 'show')
                bzDom(target).show();
            if (actname == 'disable')
                bzDom(target).el.disabled = true;
            if (actname == 'enable')
                bzDom(target).el.disabled = false;
            if (actname == 'checkon')
                bzDom(target).checkon();
            if (actname == 'checkoff')
                bzDom(target).checkoff();
            if (actname == 'access') {
                var t = bzDom(target);
                if (t.el.disabled)
                    t.el.disabled = false;
                else
                    t.el.disabled = true;
            }
            if (actname == 'action' && Blues.check.ifFunction(actvalue))
                actvalue();
        }
    }
    CN.defaultOptions = {
        triggers: null,       //   #selector or [#selector1, #selector2, etc]
        targets: null,        //   #selector or [#selector1, #selector2, etc]
        events: null,         //   {'triggerName1': 'triggerAct1', 'triggerName2': 'triggerAct2', etc }
    }
    var Condition = CN;
    return Condition;
});