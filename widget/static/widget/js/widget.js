(function() {
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  this.WidgetAdmin = (function() {

    WidgetAdmin.options_forms = {};

    function WidgetAdmin() {
      this.setupWidgetForms = __bind(this.setupWidgetForms, this);
      this.setupAdmin = __bind(this.setupAdmin, this);
      var not_impl;
      not_impl = $('a.not-implemented');
      if (not_impl.length > 0) not_impl.each(function(i) {});
      this;
    }

    WidgetAdmin.prototype.setupAdmin = function() {
      var _this = this;
      $(".widget_class select").bind("change", function(e) {
        var type;
        type = $(e.currentTarget).find("option:selected").attr("value");
        if (!(type in _this.options_forms)) {
          return $.getJSON('/widget/options/' + type, function(data) {
            if (data.valid) {
              _this.options_forms[type] = data.opts;
              $("#options-form-holder").html(data.opts);
              return data;
            }
          });
        } else {
          return $("#options-form-holder").html(_this.options_forms[type]);
        }
      });
      return this;
    };

    WidgetAdmin.prototype.setupWidgetForms = function() {
      var expose,
        _this = this;
      $("#widget-form").adminForm({
        preSubmit: this.preSubmit,
        resultParsed: this.resultParsed
      });
      expose = {
        color: "#333",
        loadSpeed: 200,
        opacity: 0.9
      };
      $.each($('.widget-add-link'), function(i) {
        var link, onBeforeLoad, overlay;
        link = $(this);
        onBeforeLoad = function() {
          var slot_field, slot_name;
          slot_field = $("#widget-form").find("input[name=widgetslot]").get(0);
          slot_name = link.parents(".widget-wrapper").attr("id");
          return slot_field.value = slot_name;
        };
        overlay = {
          onBeforeLoad: onBeforeLoad,
          closeOnEsc: true,
          expose: expose,
          closeOnClick: true,
          close: ':button'
        };
        return link.overlay(overlay);
      });
      $("#edit-widget-form").adminForm({
        resultParsed: this.onEditData
      });
      $('.widget-edit-link').click(function(e) {
        var widget_id, widget_title;
        widget_id = e.currentTarget.id.split("-")[1];
        widget_title = e.currentTarget.parentElement.parentElement.parentElement.id;
        return _this.onEditForm(e.currentTarget, widget_id, widget_title);
      });
      return this;
    };

    WidgetAdmin.prototype.onEditForm = function(link, widget_id, widget_title) {
      var editUrl, options, widget;
      widget = this;
      editUrl = "/widget/edit/" + widget_id + "/";
      options = {
        url: editUrl,
        success: function(data) {
          widget.onEditData(null, data, widget_title);
          return $("#edit-widget-form").get(0).setAttribute("action", editUrl);
        }
      };
      $.ajax(options);
      return this;
    };

    WidgetAdmin.prototype.onEditData = function(e, params, widget_title) {
      var js, optHolder, _i, _len, _ref;
      if (params.status === true) {
        location.reload();
      } else {
        optHolder = $("#edit-widget-form").find('fieldset#widget-options').find(".options");
        $("#editForm h3#title").text("Edit " + widget_title);
        switch (params.type) {
          case "ef":
            optHolder.empty();
            optHolder.prepend(params.data);
            if (params.extra_js) {
              _ref = params.extra_js;
              for (_i = 0, _len = _ref.length; _i < _len; _i++) {
                js = _ref[_i];
                eval(js);
              }
            }
            break;
          default:
            this;
        }
      }
      return this;
    };

    WidgetAdmin.prototype.preSubmit = function(e, form) {
      form.hide();
      $('#editable-loading').show();
      if (typeof tinyMCE !== "undefined") return tinyMCE.triggerSave();
    };

    WidgetAdmin.prototype.resultParsed = function(e, params) {
      var action, back, close, data, doer, form, listSet, optHolder, optSet, resetForm;
      if (params.status === true) {
        location.reload();
      } else {
        form = params.form;
        data = params.data.data;
        listSet = form.find('fieldset#widget-list');
        optSet = form.find('fieldset#widget-options');
        optHolder = form.find('fieldset#widget-options').find(".options");
        back = form.find("input[name=back]");
        close = form.find("input[name=close]");
        doer = form.find("input[name=do]");
        action = form.get(0).getAttribute("action");
        resetForm = function(form) {
          listSet = form.find('fieldset#widget-list');
          optSet = form.find('fieldset#widget-options');
          optHolder = form.find('fieldset#widget-options').find(".options");
          form.hide();
          listSet.show();
          optHolder.empty();
          optSet.hide();
          $("#editForm h3#title").text("Configure this Widget");
          form.get(0).setAttribute("action", action);
          back.hide();
          return doer.val("Choose");
        };
        switch (params.data.type) {
          case "fi":
            listSet.hide();
            doer.val("Save");
            optHolder.prepend(data);
            optSet.show();
            form.get(0).setAttribute("action", "/widget/create/");
            back.show();
            back.bind('click', function(event) {
              event.preventDefault();
              resetForm(form);
              return form.show();
            });
            close.bind('click', function(event) {
              return resetForm(form);
            });
            break;
          case "nf":
            break;
          default:
            $("#editForm h3#title").text("You are done! Click save");
            this;
        }
      }
      $('#editable-loading').hide();
      return form.show();
    };

    WidgetAdmin.prototype.wysihtml = function(id) {
      return $("#" + id).wysihtml5({
        "font-styles": true,
        "emphasis": true,
        "lists": true,
        "html": true
      });
    };

    WidgetAdmin.prototype.gloweditor = function(id) {
      var editor;
      return editor = new glow.widgets.Editor("#" + id, {
        theme: "dark"
      });
    };

    WidgetAdmin.prototype.doFormSave = function(event) {
      return console.log("Form Clicked");
    };

    WidgetAdmin.prototype.setupWidgetStatusHandler = function() {
      return this;
    };

    WidgetAdmin.prototype.setupSortableWidgets = function() {
      var stylesheet, updateOrdering;
      updateOrdering = function(event, ui) {
        var args, next;
        next = ui.item.next();
        next.css({
          '-moz-transition': 'none',
          '-webkit-transition': 'none',
          'transition': 'none'
        });
        setTimeout(next.css.bind(next, {
          '-moz-transition': 'border-top-width 0.1s ease-in',
          '-webkit-transition': 'border-top-width 0.1s ease-in',
          'transition': 'border-top-width 0.1s ease-in'
        }));
        args = {
          'ordering_from': $(this).sortable('toArray').toString(),
          'ordering_to': $(ui.item).parent().sortable('toArray').toString()
        };
        if (args['ordering_from'] !== args['ordering_to']) {
          args['moved_widget'] = $(ui.item).attr('id');
          args['moved_parent'] = $(ui.item).parent().parent().attr('id');
          if (args['moved_parent'] === 'widget-sortable') {
            delete args['moved_parent'];
          }
        } else {
          delete args['ordering_to'];
          delete args['widget_class_to'];
        }
        return $.post(window.__widget_ordering_url, args, function(data) {
          if (!data) {
            return alert("Error occured: " + data + "\nOrdering wasn't updated.");
          }
        });
      };
      stylesheet = $('style[name=impostor_size]')[0].sheet,
        rule = stylesheet.rules ? stylesheet.rules[0].style : stylesheet.cssRules[0].style,
      setPadding = function(atHeight) {
      rule.cssText = 'border-top-width: '+atHeight+'px';
      };
      $('.widget-sortable').sortable({
        handle: '.ordering',
        opacity: '.7',
        stop: updateOrdering,
        forcePlaceholderSize: true,
        placeholder: "ui-state-highlight",
        forcePlaceholderSize: true,
        placeholder: 'marker',
        revert: 150,
        start: function(ev, ui) {
          return setPadding(ui.item.height());
        }
      }).sortable('option', 'connectWith', '.widget-sortable');
      $('.widget-sortable').disableSelection();
      return this;
    };

    return WidgetAdmin;

  })();

}).call(this);
