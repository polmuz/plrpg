$(function(){
  window.Member = Backbone.Model.extend({
    defaults: {
	name: "Member Name",
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
      "keypress .member-input": "updateMember"
    },

    initialize: function() {
      this.model.bind('change', this.render, this);
      this.model.bind('destroy', this.remove, this);
    },

    render: function() {
      $(this.el).html(this.template(this.model.toJSON()));
      return this;
    },

    updateMember: function(e){
      this.input = this.$('.member-input');
      this.model.save({name: this.input[0].value,
		       modifier: parseInt(this.input[1].value),
		       card_modifier: parseInt(this.input[2].value)}
		     );
    }
			
  });


});

$('#add-member').bind('click', function() {
  var view = new MemberView({model: new Member()});
  this.$("#member-list").append(view.render().el);
  return false;
});
