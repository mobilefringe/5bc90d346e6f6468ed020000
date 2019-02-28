function init(e){
    $('<div class="modal-backdrop custom_backdrop_load"><div class="loader">Loading...</div></div>').appendTo(document.body);

    $('.open_menu').click(function(e){
        e.preventDefault();
        $('body').addClass('no_scroll');
        $('.mobile_menu_container').addClass('active_menu')
    });
    
    $('#close_menu').click(function(e){
        e.preventDefault();
        $('body').removeClass('no_scroll');
        $('.mobile_menu_container').removeClass('active_menu');
        $('.sub_menu.hidden_now').css('display', "none")
        $('.plus_icon').show();
        $('.minus_icon.menu_icon').hide()
    });
    
    $('.submenu_expander').click(function(e){
		e.preventDefault()
		if ($(this).hasClass('open') == false){
        	$('.open').next().slideToggle();
        	$('.open').find('img').toggle();
        	$('.open').toggleClass('open')
		}
		$(this).next().slideToggle();
		$(this).find('img').toggle();
		$(this).toggleClass('open')
	})
	
	$('html').click(function() {
        $('body').removeClass('no_scroll');
        $('.mobile_menu_container').removeClass('active_menu')
        $('.sub_menu.hidden_now').css('display', "none")
        $('.plus_icon').show()
        $('.minus_icon.menu_icon').hide()
    });
    
    $('.mobile_menu_container, .open_menu').click(function(event){
        event.stopPropagation();
    });
    
    $('#option_selector').change(function(){
        window.location = $(this).val();
    });
    $('.link_selector').change(function(){
        console.log("val", $(this).val())
        window.location = $(this).val();
    });
    
    //dynamically changing copyright year
    var current_year = moment().year();
    $("#current_year").text(current_year);
}

function show_content(){
    setTimeout(function() {
        var scrolled = 0;
        $(".yield").css({visibility: "visible"});
        $(".custom_backdrop_load").remove();
    }, 800);
    
    var d = new Date();
    var n = d.getDay();
    var today_hours = getTodaysHours();
    // console.log("today_hours", today_hours)
    renderHomeHours('#home_hours_container', '#home_hours_template', today_hours)
    $.each( getPropertyHours(), function(i,v){
        if(v.is_closed == true){
            var hours_day = new Date(v.holiday_date + "T05:00:00Z")
            if(hours_day.setHours(0, 0, 0, 0) == d.setHours(0, 0, 0, 0)){
                $('.hours_today').text("Closed Today")
            }
        }
        if(v.is_holiday == true){
            var hours_day = new Date(v.holiday_date + "T05:00:00Z")
            if(hours_day.setHours(0, 0, 0, 0) == d.setHours(0, 0, 0, 0)){
                var open_time = new Date (v.open_time);
                var close_time = new Date (v.close_time);
                v.open_time = convert_hour(open_time);
                v.close_time = convert_hour(close_time);
                v.h = v.open_time+ " - " + v.close_time;
                $('#hours_home').text(v.h)
            }
        }
    });
    
    $('#stores_container').scroll(function(){
        if( $(this).scrollTop() == 0){
            $('#store_scroll_up').css('display', 'none')
        }
        else{
            $('#store_scroll_up').css('display', 'block')
        }
        if($('#stores_container')[0].scrollHeight == ($('#stores_container').scrollTop() + $('#stores_container').height()) ){
            $('#store_scroll_down').css('display', 'none')
        }
        else{
            $('#store_scroll_down').css('display', 'block')
        }
    })
    
    $('#stores_container').hover(
        function() {
            $('body').addClass("no_scroll");
        }, function() {
            $('body').removeClass( "no_scroll" );
        }
    );
    var scrolled = 0;
    
    $('#store_scroll_down').click(function(e){
        e.preventDefault();
        scrolled = scrolled + 320;
        $('#stores_container').animate({scrollTop:  scrolled});
    })
    
    $('#store_scroll_up').click(function(e){
        e.preventDefault();
        scrolled = scrolled - 320;
        $('#stores_container').animate({scrollTop:  scrolled});
    })
    renderHomeHours('#home_hours_container3', '#home_hours_template3', getTodaysHours())
}

function show_cat_stores(){
    $('.show_cat_stores').click(function(e){
        $('.main_row .col-md-6').addClass('full_width')
        var visible_row = 0
        var cat_id = $(this).attr('data-id');
        $('.active_cat').removeClass('active_cat');
        $(this).addClass('active_cat');
        var rows = $('.cats_row');
        rows.hide();
        $('#no_promo_in_category').hide();
        $('.store_initial').hide();
        $('#cat_name_header').text($(this).text());
        $('#cat_name_header').css('display', 'block');
        $.each(rows, function(i, val){
            var cat_array = val.getAttribute('data-cat').split(',');
            if ($.inArray(cat_id, cat_array) >= 0){
                $(val).show();
                visible_row++;
            }
        });
        if(visible_row == 0){
            $('#no_promo_in_category').show();
        }
        
        e.preventDefault();
    });
    $('.show_all_stores').click(function(e){
        $('.main_row .col-md-6').removeClass('full_width')
        $('#no_promo_in_category').hide();
        $('.active_cat').removeClass('active_cat');
        $(this).addClass('active_cat');
        var rows = $('.cats_row');
        rows.show();
        $.each($('.store_initial'), function(i, val){
           if ($(val).text().length > 0){
               $(val).show();
           } 
        });
        $('#cat_name_header').hide();
        e.preventDefault();
    });
    
}


    
function getDay(day_of_week){
    var day;
    // if(Cookies.get('current_locale') == "en-CA"){
        switch (day_of_week){
            case 0:
                day = "Sunday";
                break;
            case 1:
                day = "Monday";
                break;
            case 2:
                day = "Tuesday";
                break;
            case 3:
                day = "Wednesday";
                break;
            case 4:
                day = "Thursday";
                break;
            case 5:
                day = "Friday";
                break;
            case 6:
                day = "Saturday";
                break;
        }
    return day;
}

function floorList() {
    var floor_list = [];
    var floor_1 = {};
    floor_1.id = "first-floor";
    floor_1.title = "Level One";
    floor_1.map =  getPNGMapURL().split("?")[0];
    floor_1.z_index = 1;
    floor_1.show = true;
    floor_list.push(floor_1);
    return floor_list;
}
    
function svgList() {
    return _.map(getStoresList(), 'svgmap_region');
}
        
function dropPin(svgmap_region) {
    self = map.data('mapplic');
    self.showLocation(svgmap_region);
    $('.stores_table').hide();
}