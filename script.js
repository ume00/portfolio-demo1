/* top multiscroll */
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

  /* top synchronized video playback*/
  const $videos = $('.video');
  const $mainVideo = $videos.eq(0);
  
  function syncVideos() {
    $videos.each(function() {
      this.currentTime = 0;
      this.play();
    });
  }
  
  $(document).ready(syncVideos);
  $(window).on('pageshow', syncVideos);
  
  $mainVideo.on('play', function() {
    const mainVideoElement = this;
    $videos.each(function() {
      if (this !== mainVideoElement) {
        this.currentTime = mainVideoElement.currentTime;
        this.play();
      }
    });
  });
  
  $mainVideo.on('pause', function() {
    const mainVideoElement = this;
    $videos.each(function() {
      if (this !== mainVideoElement) {
        this.pause();
      }
    });
  });

  /* common viewport */
  const $viewport = $('meta[name="viewport"]');
  function switchViewport() {
    const value = $(window).outerWidth() > 360
    ? 'width=device-width,initial-scale=1'
    : 'width=360';
      
    if ($viewport.attr('content') !== value) {
      $viewport.attr('content', value);
    }
  }
    
  $(window).on('resize', switchViewport);
  switchViewport();

  /* common component loading */
  function loadComponent(selector, file, callback) {
    $(selector).load(file, function(response, status, xhr) {
      if (status === 'error') {
        console.error(`Error loading ${file}`);
      } else if (callback) {
        callback();
      }
    });
  }

  /* common page transition (Mobile Only)*/
  const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

  if (isMobile) {
    const pageTransition = function(e) {
      const $button = $(e.target).closest('.top-button-frame, .c-round-button-frame, .trial-ticket-wrapper');
    
      if ($button.length) {
        e.preventDefault();
        const href = $button.is('a') ? $button.attr('href') : $button.find('a').attr('href');
        const timeout = $button.hasClass('c-round-button-frame') ? 5000 : 2000;
        
        // アニメーション完了か5秒後のどちらか早い方で遷移
        const timeoutId = setTimeout(function() {
          window.location.href = href;
        }, timeout); 
        
        $button.one('transitionend', function() {
          clearTimeout(timeoutId);
          window.location.href = href;
        });
      }
    };
    $(document).on('click', pageTransition);
  }

  loadComponent('#header', './header.html', function() {
    /* common page current */
    $('.nav-item a').each(function(){
      if(this.href == location.href　|| this.href + '#' == location.href) {
        $(this).parents('.nav-item').addClass('current');
      }
    });
    
    /* header color change */
    const $headerChange = $('#header');
    const $header = $('.header-inner');
    const $sections = $('section, footer, .c-sec-top, .c-sec-inner');

    function headerColorChange() {
      let scrollTop = $(this).scrollTop();
      let headerHeight = $header.outerHeight() / 2;
      let shouldBeWhite = false;
      let hasDefault = false;
  
      $sections.each(function() {
        let $section = $(this);
        let sectionTop = $section.offset().top - headerHeight;
        let sectionBottom = sectionTop + $section.outerHeight();
  
        if (scrollTop >= sectionTop && scrollTop < sectionBottom) {
          if ($section.hasClass('hd-default')) {
            hasDefault = true;
          } else if ($section.hasClass('hd-change')) {
            shouldBeWhite = true;
          }
        }
      });

      if (hasDefault) {
        $headerChange.removeClass('hd-white');
      } else if (shouldBeWhite) {
        $headerChange.addClass('hd-white');
      } else {
        $headerChange.removeClass('hd-white');
      }
    }

    headerColorChange();
    $(window).on('scroll', headerColorChange);

    /* common pagechange wait*/
    if (isMobile) {
      $(document).on('click', pageTransition);
    }
  });
  loadComponent('#footer', './footer.html');

  /* nav */
  $('#header').on('click', '.nav-icon', function() {
      $('.nav-icon').toggleClass('active');
      $('.nav-bg').toggleClass('active');
  });

  /* nav window resize */
  $(window).resize(function() {
    if ($(window).width() >= 1024) {
      $('.nav-icon').removeClass('active');
      $('.nav-bg').removeClass('active');
    }
  });

  /* sec-title fixed */
  const $title = $('.c-secfst-title-en');
  const $fixedClass = $('.c-sec-top, .c-sec-inner');
  if ($title.length > 0) {
    let titleOffset = $title.offset().top;
    let isFixed = false;

    $(window).scroll(function() {
      const scrollPosition = $(this).scrollTop() + 88;

      if (scrollPosition >= titleOffset && !isFixed) {
        $fixedClass.addClass('fixed');
        isFixed = true;
      } else if (scrollPosition < titleOffset && isFixed) {
        $fixedClass.removeClass('fixed');
        isFixed = false;
      }
    });

    $(window).resize(function() {
      if (!isFixed) {
        titleOffset = $title.offset().top;
      }      
    });
  }

  /* instructor img click */
  let topPosition = 0;
  let leftPosition = 0;
  let descriptionHeight = 0;

  $('.instructor-img-content').on('click', function() {
    descriptionHeight = $('.instructor-description-wrapper').height();
    const $personWrapper = $(this).parents('.instructor-person-wrapper');

    if ($personWrapper.hasClass('show')) {
      return;
    }

    $('.instructor-person-wrapper').removeClass('show move');
    $personWrapper.addClass('show');
    $('.instructor-description-wrapper').addClass('description');

    /* img translate */
    const offset = $personWrapper.offset();
    const descriptionOffset = $('.instructor-description-wrapper.description').offset();
  
    topPosition = offset.top - descriptionOffset.top;
    leftPosition = offset.left - descriptionOffset.left;

    $personWrapper.css('--translateX', '0');
    $personWrapper.addClass('move');

    setTimeout(function () {
      $personWrapper.css({
        '--position': 'absolute',
        '--position-top':`${topPosition}px`,
        '--position-left': `${leftPosition}px`
      });

      $('.instructor-description-wrapper').css({
        'height': `${descriptionHeight}px`
      });

      setTimeout(function () {
        const leftMovePosition = window.innerWidth < 768 ? '50%' : '16px';
        descriptionHeight = window.innerWidth < 768 ? '920px' : '560px';

        requestAnimationFrame(function() {
          $personWrapper.css({
            '--position-top': '0px',
            '--position-left': leftMovePosition ,
            '--border-radius': '0',
            '--visibility': 'hidden',
            '--translateX' : '-50%',
            'transition' : 'all 1s'
          });

          $('.instructor-description-wrapper').css({
            'height': descriptionHeight
          });

          $('.instructor-person-wrapper:not(.show)').css({
            'position': 'absolute'
          });
        });

        /* page scroll */   
        const descRect = $('.instructor-description-wrapper.description')[0].getBoundingClientRect();
        const scrollTarget = window.innerWidth < 768 
          ? descRect.top + window.scrollY - 128 
          : descRect.top + window.scrollY - 176;
    
        $('html, body').animate({
          scrollTop: scrollTarget
        }, 1000);

        $personWrapper.find('.instructor-person-text-wrapper').addClass('text-show');
      }, 100);
    }, 500);
  });

  /* instructor description back */
  $('.instructor-return').on('click', function() {
    
    $('.instructor-person-text-wrapper').removeClass('text-show');
    
    const $personWrapper = $(this).parents('.instructor-person-wrapper');

    setTimeout(function () {
      $personWrapper.css({
        '--position': 'absolute',
        '--position-top': `${topPosition}px`,
        '--position-left': `${leftPosition}px`,
        '--border-radius': '',
        '--visibility': '',
        '--translateX' : ''
      });

      $('.instructor-description-wrapper').css({
        'height': ''
      });

      $('.instructor-person-wrapper:not(.show)').css({
        'position': ''
      });

      setTimeout(function () {
        $personWrapper.css({
          '--position': 'relative',
            '--position-top': '0px',
            '--position-left': '0px',
            'transition' : 'none'
        });
        $('.instructor-description-wrapper').removeClass('description');
        $('.instructor-person-wrapper').removeClass('show move');
        $('.instructor-img-wrapper').removeClass('position');
      }, 1000);
    }, 800);
  });

  /* class pagination */
  let currentPage = 1;
  let maxItem = 5;
  let itemNum = $('.class-list').length;
  let pageNum = Math.ceil( itemNum / maxItem);

  /* create　pagenation */
  if(pageNum > 1){
    let pageHtml = '<li  class="prev"><</li>';

    for (let i = 1; i <= pageNum;  i++) {
      pageHtml += '<li class="page-number" data-index="' + i + '">' + i + '</li>';
    }

    pageHtml += '<li class="next">></li>';

    $('.pagination').html(pageHtml);

    pageChange(currentPage);

  } else {
    $('.class-list').addClass('show');
  }

  /* change pagenation */
  function pageChange(currentPage) {
    $('.class-list').removeClass('show');
    $('.page-number').removeClass('current');
    $('.pagination').find('.off').removeClass('off');
    
    if (currentPage == 1) {
      $('.pagination > .prev').addClass('off');
    }
    
    if (currentPage == pageNum) {
      $('.pagination > .next').addClass('off');
    }

    $('.page-number[data-index="' + currentPage + '"]').addClass('current off');

    const start = maxItem * (currentPage - 1);
    for (var i = start; i < start + maxItem; i++) {
      $('.class-list').eq(i).addClass("show");
    }
  }

  $('.pagination').on('click', '.page-number', function() {
    currentPage = $(this).data('index');
    pageChange(currentPage);
  });

  $('.pagination').on('click', '.prev', function() {
    if (currentPage > 1) {
      currentPage --;
      pageChange(currentPage);
    }
  });

  $('.pagination').on('click', '.next', function() {
    if (currentPage < pageNum) {
      currentPage ++;
      pageChange(currentPage);
    }
  });

  /* class insert date */
  const today = new Date();
  const dayOfWeek = today.getDay();
    
  const saturday = new Date(today);
  if (dayOfWeek === 6) {
    saturday.setDate(today.getDate() + 7);
  } else {
    saturday.setDate(today.getDate() + (6 - dayOfWeek));
  }
    
  const days = ['日', '月', '火', '水', '木', '金', '土'];
    
  const formattedDate = 
    ('0' + (saturday.getMonth() + 1)).slice(-2) + '/' + 
    ('0' + saturday.getDate()).slice(-2) + 
    '(' + days[saturday.getDay()] + ')';
    
  $('.date6').text(formattedDate);
});