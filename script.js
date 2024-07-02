if ($('body').hasClass('top-page')) {
  $('.ms-container').multiscroll({
    anchors: ['top', '', '','','',''],
	  loopTop: false,
	  loopBottom: true,
    navigation: true,
    navigationPosition: 'right',
  });
}

$(function() {
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
  });