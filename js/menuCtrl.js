LoquiApp.controller('menuCtrl', function($scope, model){

  $('.btn-group a').click(function(e) {
    console.log("inne");
    $('.btn-group a.active').removeClass('active');
    var $this = $(this);
    if (!$this.hasClass('active')) {
        $this.addClass('active');
    }
    e.preventDefault();
});


});
