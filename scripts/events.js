



//when document is loaded and ready

$(document).ready(function() {
	//Slide Scroll to Element
	$("a.anchorLink").anchorAnimate()

	//flickr API pull
	$.getJSON("http://api.flickr.com/services/feeds/photos_public.gne?id=43102927@N00&tags=instagramapp&lang=en-us&format=json&jsoncallback=?", function(data){
	  $.each(data.items, function(i,item){
		$("<img/>").attr("src", item.media.m).appendTo("#instagram")
			.wrap("<a target='_blank' href='" + item.link + "'></a>");
			if (i==8) {
				return false;
			};
	  });
	});

});

//isotope activate

$('#masonTime').isotope({
  // options
	animationOptions: {
		duration: 750,
		easing: 'linear',
		queue: false
	},
	itemSelector : '.workitem',
	layoutMode : 'masonry'
});


//filter work items

$('#workFilters li').click(function() {
	var cname = $(this).attr('class');
	if ($(this).hasClass('selected')) {
		return false;
	} else {
		$('#workFilters li').removeClass('selected');
		$('#masonTime').isotope({ filter: '.'+cname+'' });
		$(this).addClass('selected');
	};
});

//work overlay to show description
$('.workitem').hover(function() {
	//toggle display on overlay class
	$(".overlay", this).fadeToggle("fast", "linear");
});



//animate scroll to named anchors
jQuery.fn.anchorAnimate = function(settings) {
	settings = jQuery.extend({
		speed : 500
	}, settings);

	return this.each(function(){
		var caller = this
		$(caller).click(function (event) {
			event.preventDefault()
			var locationHref = window.location.href
			var elementClick = $(caller).attr("href")

			var destination = $(elementClick).offset().top;
			$("html:not(:animated),body:not(:animated)").animate({ scrollTop: destination - 70}, settings.speed, function() {
				window.location.hash = elementClick
			});
			return false;
		})
	})
};

