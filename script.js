/* top_multiscroll */
$(function() {
  if ($('body').hasClass('top')) {
    $('.ms-container').multiscroll({
      anchors: ['top', '', '','','',''],
	    loopTop: false,
	    loopBottom: true,
      navigation: true,
      navigationPosition: 'right',
    });
  }

  /* common_viewport */
  var $viewport = $('meta[name="viewport"]');
  function switchViewport() {
    var value = $(window).outerWidth() > 360
    ? 'width=device-width,initial-scale=1'
    : 'width=360';
      
    if ($viewport.attr('content') !== value) {
      $viewport.attr('content', value);
    }
  }
    
  $(window).on('resize', switchViewport);
  switchViewport();

  /* page-common_current */
  $(".nav-item a").each(function(){
    if(this.href == location.href) {
      $(this).parents(".nav-item").addClass("current");
    }
  });
});