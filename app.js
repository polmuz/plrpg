$(function(){
  window.Member = Backbone.Model.extend({
    defaults: {
	name: "",
	modifier: 0,
	card_modifier: 0
    }
  });

  window.MemberList = Backbone.Collection.extend({
    model: Member,
    localStorage: new Store("members")
  });

  window.Members = new MemberList;

  window.MemberView = Backbone.View.extend({
    tagName: "li",
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
      // this.model.name = this.input[0].value;
      // this.model.modifier = parseInt(this.input[1].value, 10);
      // this.model.card_modifier = parseInt(this.input[2].value, 10);
      // this.model.save();
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
      "click #refresh-total": "refreshTotal"	
    },
    addMember: function(){
      var view = new MemberView({model: Members.create()});
      this.$("#member-list").append(view.render().el);
    },
    refreshTotal: function(){
      var total = 0;
      Members.each(function(member){
        total += member.attributes.modifier + member.attributes.card_modifier;
      });
      $('#total').text(total.toString());
    }
  });
   
  window.App = new AppView;
});
