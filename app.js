$(function(){
  window.Member = Backbone.Model.extend({
    defaults: {
	name: "",
	modifier: 0,
	card_modifier: 0,
	last_progress: 0,
	last_total: 0
    },
    totalModifiers: function() {
      return this.attributes.modifier + this.attributes.card_modifier;
    },
    totalProgress: function() {
      var last_total = this.totalModifiers() + this.attributes.last_progress;
      if (last_total < 0) {
	  last_total = 0;
      }
      this.set({'last_total': last_total});
      return last_total;
    }
  });

  window.MemberList = Backbone.Collection.extend({
    model: Member,
    localStorage: new Store("members")
  });

  window.Members = new MemberList;

  window.MemberView = Backbone.View.extend({
    tagName: "tr",
    template: _.template($("#member-template").html()),
    events: {
      "keypress .member-input": "updateOnEnter",
      "click .delete-member": "clear"
    },

    initialize: function() {
      this.model.bind('change', this.render, this);
      this.model.bind('destroy', this.remove, this);
    },

    render: function() {
      $(this.el).html(this.template(this.model.toJSON()));
      return this;
    },

    updateOnEnter: function(e){
      if (e.keyCode != 13) return;
      this.input = this.$('.member-input');
      this.model.save({
		       name: this.input[0].value,
      		       modifier: parseInt(this.input[1].value, 10),
      		       card_modifier: parseInt(this.input[2].value, 10)
		      }
      		     );
    },
    clear: function(){
      this.model.destroy();
    }
  });

  window.AppView = Backbone.View.extend({
    el: $("#members-app"),
    initialize: function () {
	Members.fetch();
	var that = this;
	Members.each(
	  function(member){
	    var view = new MemberView({model: member});
	    that.$("#member-list").append(view.render().el);
	  }
	);
    },
    events: {
      "click #add-member": "addMember",
      "click #refresh-total": "calculateDailyTotal",
      "click #toggle-admin-fields": "toggleAdminFields"
    },
    addMember: function(){
      var view = new MemberView({model: Members.create()});
      this.$("#member-list").append(view.render().el);
    },
    calculateDailyTotal: function(){
      var total = 0;
      Members.each(function(member){
	var dice = parseInt($("#dice-number")[0].value, 10);
        var progress = Math.floor(Math.random() * dice);
        member.set({'last_progress': progress});
        total += member.totalProgress();
      });
      $('#total').text(total.toString());
    },
    toggleAdminFields: function() {
      $.each($('.admin-only'), function(i, el) {
        $(el).toggle();
      });
    }
  });
   
  window.App = new AppView;
});
