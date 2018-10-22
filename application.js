var default_image_url = "//codecloud.cdn.speedyrails.net/sites/5bc90d346e6f6468ed020000/image/png/1540229651296/westbrook_logo_default.png"
function renderBanner(banner_template,home_banner,banners){
    var item_list = [];
    var item_rendered = [];
    var banner_template_html = $(banner_template).html();
    Mustache.parse(banner_template_html);   // optional, speeds up future uses
    $.each( banners , function( key, val ) {
        today = new Date();
        start = new Date (val.start_date);
       
        start.setDate(start.getDate());
        if(val.url == "" || val.url === null){
           val.css = "style=cursor:default;";
           val.noLink = "return false";
        }
        if (start <= today){
            if (val.end_date){
                end = new Date (val.end_date);
                end.setDate(end.getDate() + 1);
                if (end >= today){
                    item_list.push(val);  
                }
            } else {
                item_list.push(val);
            }
        }
    });

    $.each( item_list , function( key, val ) {
        var repo_rendered = Mustache.render(banner_template_html,val);
        item_rendered.push(repo_rendered);
    });
    $(home_banner).html(item_rendered.join(''));
}

function renderCategoryList(container, template, collection){
    var item_list = [];
    var item_rendered = [];
    var template_html = $(template).html();
    Mustache.parse(template_html); 
    $.each( collection , function( key, val ) {
        if(Cookies.get('current_locale') == "en-CA"){
            val.cat_name = val.name;
        }
        if(Cookies.get('current_locale') == "fr-CA"){
            if(val.name_2 != null) {
                val.cat_name = val.name_2;
            } else {
                val.cat_name = val.name;    
            }
        }
        
        var repo_rendered = Mustache.render(template_html,val);
        item_rendered.push(repo_rendered);
    });
    $(container).html(item_rendered.join(''));
}

function renderEvents(container, template, collection, centre){
    var item_list = [];
    var item_rendered = [];
    var template_html = $(template).html();
    Mustache.parse(template_html); 
    $.each( collection , function( key, val ) {
        if (val.eventable_type == "Store") {
            var store_details = getStoreDetailsByID(val.eventable_id);
            val.store_detail_btn = store_details.slug ;
            val.store_name = store_details.name;
        } else {
            val.store_name = centre;
        }
        
        // English Image
        if (val.event_image_url_abs.indexOf('missing.png') > 0){
            val.event_image_url_abs = default_image_url;
        }
        // French Image
        if (val.event_image2_url_abs.indexOf('missing.png') > 0){
            if (val.event_image_url_abs.indexOf('missing.png') > 0){
                val.event_image2_url_abs = default_image_url;
            } else {
                val.event_image2_url_abs = val.event_image_url_abs;
            }
        }
        
        // English Description
        if (val.description.length > 200){
            val.description_short = val.description.substring(0,200) + "...";
        } else {
            val.description_short = val.description
        }
        // French Description
        if (val.description_2 && val.description_2.length > 200){
            val.description_short_2 = val.description_2.substring(0,200) + "...";
        } else {
            val.description_short_2 = val.description_2
        }
        
        var show_date = moment(val.show_on_web_date);
        var start = moment(val.start_date).tz(getPropertyTimeZone());
        var end = moment(val.end_date).tz(getPropertyTimeZone());
        var french_start = moment(start).locale('fr-ca');
        var french_end = moment(end).locale('fr-ca');
        if (start.format("DMY") == end.format("DMY")){
            if(Cookies.get('current_locale') == "en-CA"){
                val.dates = start.format("MMM D");
            }
            if(Cookies.get('current_locale') == "fr-CA"){
                val.dates = french_start.format("DD MMM");
            }
        } else {
            if(Cookies.get('current_locale') == "en-CA"){
                val.dates = start.format("MMM D") + " - " + end.format("MMM D");
            }
            if(Cookies.get('current_locale') == "fr-CA"){
                val.dates = french_start.format("DD MMM") + " - " + french_end.format("DD MMM");
            }
        }

        var rendered = Mustache.render(template_html,val);
        item_rendered.push(rendered);
    });
    $(container).html(item_rendered.join(''));
}

function renderEventDetails(container, template, collection, mall_name){
    var item_list = [];
    var item_rendered = [];
    var template_html = $(template).html();
    Mustache.parse(template_html); 
    item_list.push(collection);
    $.each( item_list , function( key, val ) {
        if (val.eventable_type == "Store") {
            var store_details = getStoreDetailsByID(val.eventable_id);
            val.store_detail_btn = store_details.slug ;
            val.store_name = store_details.name;
            val.store_image = store_details.store_front_url_abs;
            val.store_slug = store_details.slug
            if (store_details.website != null && store_details.website.length > 0){
                val.show = "display:block";
                val.website = store_details.website
            } else {
                val.show = "display:none";
            }
            if (store_details.phone != null && store_details.phone.length > 0){
                val.phone_show = "display:block";
                val.phone = store_details.phone
            } else{
                val.phone_show = "display:none";
                val.show = "display:none";
            }
        } else {
            val.store_name = mall_name;
            val.store_image = default_image_url;
            val.store_show = "display:none";
            val.phone_show = "display:none";
            val.show = "display:none";
            
            // English Image
            if (val.event_image_url_abs.indexOf('missing.png') > 0){
                val.show_img = "display: none"
            } else {
                val.image_url = val.promo_image_url_abs;
            }
            // French Image
            if (val.event_image2_url_abs.indexOf('missing.png') > 0){
                if (val.event_image_url_abs.indexOf('missing.png') > 0){
                    val.show_img = "display: none"
                } else {
                    val.image_url = val.event_image_url_abs;
                }
            } else {
                val.image_url = val.event_image2_url_abs;
            }
        }

        var show_date = moment(val.show_on_web_date);
        var start = moment(val.start_date).tz(getPropertyTimeZone());
        var end = moment(val.end_date).tz(getPropertyTimeZone());
        var french_start = moment(start).locale('fr-ca');
        var french_end = moment(end).locale('fr-ca');
        if (start.format("DMY") == end.format("DMY")){
            if(Cookies.get('current_locale') == "en-CA"){
                val.dates = start.format("MMM D");
            }
            if(Cookies.get('current_locale') == "fr-CA"){
                val.dates = french_start.format("DD MMM");
            }
        } else {
            if(Cookies.get('current_locale') == "en-CA"){
                val.dates = start.format("MMM D") + " - " + end.format("MMM D");
            }
            if(Cookies.get('current_locale') == "fr-CA"){
                val.dates = french_start.format("DD MMM") + " - " + french_end.format("DD MMM");
            }
        }
        
        var rendered = Mustache.render(template_html,val);
        item_rendered.push(rendered);
    });
    $(container).html(item_rendered.join(''));
}

function renderFeatureItems(){
    // var items = getFeatureList();
    var items = [];
    var images= ["https://picsum.photos/470/940?image=1070","https://picsum.photos/470?image=1071","https://picsum.photos/470?image=1072","https://picsum.photos/470?image=1073","https://picsum.photos/470?image=1074","https://picsum.photos/470?image=1076","https://picsum.photos/470/940?image=1077"]
    // "https://picsum.photos/470/940?image=1077"
    $.each(images, function(i, val){
        var item = {};
        item.name = "placeholder";
        item.url = "/";
        item.image_url = val;
        items.push(item);
    });
    $.each(items, function(i, val){
        if(Cookies.get('current_locale') == "en-CA"){
            $('#feature_' + i).html('<a href="'+ val.url +'"><img src="'+ val.image_url+'" class="hoverer" alt="' +val.name+ '"><h5 class="center_h">'+ val.name +'</h5></a>')
        } else if(Cookies.get('current_locale') == "fr-CA"){
            $('#feature_' + i).html('<a href="'+ val.url +'"><img src="'+ val.image_url+'" class="hoverer" alt="' +val.name_2 + '"><h5 class="center_h">'+ val.name_2 +'</h5></a>');
        }
    })
}

function renderGeneral(container, template, collection){
    var item_list = [];
    var item_rendered = [];
    var template_html = $(template).html();
    Mustache.parse(template_html); 
    $.each( collection , function( key, val ) {
        var repo_rendered = Mustache.render(template_html,val);
        item_rendered.push(repo_rendered);
    });
    $(container).html(item_rendered.join(''));
}

function renderHomeHours(container, template, collection){
    var item_list = [];
    var item_rendered = [];
    var template_html = $(template).html();
    Mustache.parse(template_html);   // optional, speeds up future uses
    item_list.push(collection);    
    $.each( item_list , function( key, val ) {
        var day = getDay(val.day_of_week);
        val.day = day;
        if (val.open_time && val.close_time && (val.is_closed == false || val.is_closed == null)){
            var open_time = moment(val.open_time).tz(getPropertyTimeZone());
            var close_time = moment(val.close_time).tz(getPropertyTimeZone());

            if(Cookies.get('current_locale') == "en-CA"){
                val.h = val.day + " " + open_time.format("h:mmA") + " - " + close_time.format("h:mmA");
            } else if(Cookies.get('current_locale') == "fr-CA"){
                val.h = val.day + " " + open_time.format("H") + "h" + open_time.format("mm") + " - " + close_time.format("H") + "h" + close_time.format("mm");
            }
        } else {
            if(Cookies.get('current_locale') == "en-CA"){
                val.h = "Closed";
            } else if(Cookies.get('current_locale') == "fr-CA"){
                val.h = "Fermé";    
            }
            $('.hours_dot').css("background", "#cd1629");
        }
        var rendered = Mustache.render(template_html,val);
        item_rendered.push(rendered);
    });
    $(container).html(item_rendered.join(''));
}

function renderHours(container, template, collection, type){
    var item_list = [];
    var item_rendered = [];
    var template_html = $(template).html();
    Mustache.parse(template_html);   // optional, speeds up future uses
    if (type == "reg_hours") {
        $.each(collection, function(key, val) {
            if (!val.store_id && val.is_holiday == false) {
                var day = getDay(val.day_of_week);
                val.day = day;
                if(Cookies.get('current_locale') == "en-CA"){
                    if (val.open_time && val.close_time && val.is_closed == false){
                        var open_time = moment(val.open_time).tz(getPropertyTimeZone());
                        var close_time = moment(val.close_time).tz(getPropertyTimeZone());
                        val.close_time = close_time.format("h:mma");
                        val.h = open_time.format("h:mma") + " - " + close_time.format("h:mma");
                    } else {
                        val.h = "Closed";
                    }
                }
                if(Cookies.get('current_locale') == "fr-CA"){
                    if (val.open_time && val.close_time && val.is_closed == false){
                        var open_time = moment(val.open_time).tz(getPropertyTimeZone());
                        var close_time = moment(val.close_time).tz(getPropertyTimeZone());
                        val.close_time = close_time.format("h:mma");
                        val.h = open_time.format("H") + "h" + open_time.format("mm") + " à " + close_time.format("H") + "h" + close_time.format("mm");
                    } else {
                        val.h = "Fermé";
                    }
                }
                item_list.push(val);
            }
        });
        collection = [];
        collection = item_list;
    }
    if (type == "holiday_hours") {
        $.each( collection , function( key, val ) {
            if (!val.store_id && val.is_holiday == true && val.is_closed == false) {
                var holiday = moment(val.holiday_date).tz(getPropertyTimeZone());
                if(Cookies.get('current_locale') == "en-CA"){
                    val.formatted_date = holiday.format("MMM DD");
                    if (val.open_time && val.close_time && val.is_closed == false){
                        var open_time = moment(val.open_time).tz(getPropertyTimeZone());
                        var close_time = moment(val.close_time).tz(getPropertyTimeZone());
                        val.h = open_time.format("h:mma") + " - " + close_time.format("h:mma");   
                    } else {
                        val.h = "Closed";
                    }    
                }
                if(Cookies.get('current_locale') == "fr-CA"){
                    val.holiday_name = val.holiday_name_2
                    var french_holiday = moment(holiday).locale('fr-ca');
                    val.formatted_date = french_holiday.format("DD MMM");
                    if (val.open_time && val.close_time && val.is_closed == false){
                        var open_time = moment(val.open_time).tz(getPropertyTimeZone());
                        var close_time = moment(val.close_time).tz(getPropertyTimeZone());
                        val.h = open_time.format("H") + "h" + open_time.format("mm") + " à " + close_time.format("H") + "h" + close_time.format("mm");
                    } else {
                        val.h = "Fermé";
                    }
                }
                if (val.h != "Closed" || val.h != "Fermé") {
                    item_list.push(val)
                }
            }
        });
        collection = [];
        collection = item_list;
    }
    if (type == "closed_hours") {
        $.each( collection , function( key, val ) {
            if (!val.store_ids && val.is_holiday == true && val.is_closed == true) {
                var holiday = moment(val.holiday_date).tz(getPropertyTimeZone());
                if(Cookies.get('current_locale') == "en-CA"){
                    val.formatted_date = holiday.format("MMM DD");
                    val.h = "Closed";
                }
                if(Cookies.get('current_locale') == "fr-CA"){
                    var french_holiday = moment(holiday).locale('fr-ca');
                    val.holiday_name = val.holiday_name_2
                    val.formatted_date = french_holiday.format("DD MMM");
                    val.h = "Fermé";
                }
            
                item_list.push(val)
            }
        });
        collection = []
        collection = item_list;
    }
    $.each( collection , function( key, val ) {
        var rendered = Mustache.render(template_html,val);
        item_rendered.push(rendered);
    });
    $(container).html(item_rendered.join(''));
}

function renderJobs(container, template, collection, mall_name){
    var item_list = [];
    var item_rendered = [];
    var template_html = $(template).html();
    Mustache.parse(template_html); 
    $.each( collection , function( key, val ) {
        if(val.jobable_type == "Store"){
            var store_details = getStoreDetailsByID(val.jobable_id)
            val.store_name = store_details.name;
            val.store_slug = store_details.slug;
            val.store_show = "display: inline-block";
            val.mall_show = "display: none"
            if (store_details.store_front_url_abs.indexOf('missing.png') > -1){
                val.img_url = default_image_url;
            } else {
                val.img_url = store_details.store_front_url_abs;
            }
        } else {
            val.store_name = mall_name;
            val.img_url = default_image_url;
            val.store_show = "display: none";
            val.mall_show = "display: inline-block"
        }
        
        if (val.job_type === "Full Time") {
            if (Cookies.get('current_locale') == "fr-CA") {
                val.job_type = "À plein temps";
            }
        } else if (val.job_type === "Part Time") {
            if (Cookies.get('current_locale') == "fr-CA") {
                val.job_type = "À temps partiel";
            }
        } else if (val.job_type === "Part Time/Full Time") {
            if (Cookies.get('current_locale') == "fr-CA") {
                val.job_type = "À temps partiel / À temps plein";
            }
        } else if (val.job_type === "Seasonal") {
            if (Cookies.get('current_locale') == "fr-CA") {
                val.job_type = "Saisonnier";
            }
        }
        
        // English Description
        if (val.description.length > 200){
            val.description_short = val.description.substring(0,200) + "...";
        } else {
            val.description_short = val.description
        }
        // French Description
        if (val.description_2 && val.description_2.length > 200){
            val.description_short_2 = val.description_2.substring(0,200) + "...";
        } else {
            val.description_short_2 = val.description_2
        }

        var end = moment(val.end_date).tz(getPropertyTimeZone());
        var french_end = moment(end).locale('fr-ca');
        if(Cookies.get('current_locale') == "en-CA"){
            val.end_date = end.format("MMM D");
        }
        if(Cookies.get('current_locale') == "fr-CA"){
            val.end_date = french_end.format("D MMM");
        }
        
        var rendered = Mustache.render(template_html,val);
        item_rendered.push(rendered);
    });
    $(container).html(item_rendered.join(''));
}

function renderJobDetails(container, template, collection, mall_name){
    var item_list = [];
    var item_rendered = [];
    var template_html = $(template).html();
    Mustache.parse(template_html); 
    item_list.push(collection);
    $.each( item_list , function( key, val ) {
        if(val.jobable_type == "Store"){
            var store_details = getStoreDetailsByID(val.jobable_id);
            val.store_name = store_details.name;
            if (store_details.store_front_url_abs.indexOf('missing.png') > 0) {
                val.store_image = default_image_url;
            } else {
                val.store_image = store_details.store_front_url_abs;    
            }
            if (store_details.website != null && store_details.website.length > 0){
                val.website_show = "display: block";
                val.website = store_details.website
            } else {
                val.website_show = "display:none";
            }
            if (store_details.phone != null && store_details.phone.length > 0){
                val.phone_show = "display:block";
                val.phone = store_details.phone
            } else {
                val.phone_show = "display:none";
            }
            
            val.store_slug = store_details.slug
            val.store_link_show = "display: block;";
        } else {
            val.store_name = mall_name;
            val.store_image = default_image_url;
            val.website_show = "display:none";
            val.phone_show = "display:none";
            val.store_link_show = "display: none";
            val.show = "display:none";
        }
        
        if (val.job_type === "Full Time") {
            if (Cookies.get('current_locale') == "fr-CA") {
                val.job_type = "À plein temps";
            }
        } else if (val.job_type === "Part Time") {
            if (Cookies.get('current_locale') == "fr-CA") {
                val.job_type = "À temps partiel";
            }
        } else if (val.job_type === "Part Time/Full Time") {
            if (Cookies.get('current_locale') == "fr-CA") {
                val.job_type = "À temps partiel / À temps plein";
            }
        } else if (val.job_type === "Seasonal") {
            if (Cookies.get('current_locale') == "fr-CA") {
                val.job_type = "Saisonnier";
            }
        }
        
        var end = moment(val.end_date).tz(getPropertyTimeZone());
        var french_end = moment(end).locale('fr-ca');
        if(Cookies.get('current_locale') == "en-CA"){
            val.end_date = end.format("MMM D");
        }
        if(Cookies.get('current_locale') == "fr-CA"){
            val.end_date = french_end.format("D MMM");
        }
    
        var rendered = Mustache.render(template_html,val);
        item_rendered.push(rendered);
    });
    $(container).html(item_rendered.join(''));
}

function renderPosts(container, template, collection){
    var item_list = [];
    var item_rendered = [];
    var template_html = $(template).html();
    var counter = 1;
    Mustache.parse(template_html);   // optional, speeds up future uses
    $.each( collection , function( key, val ) {
        // English Image
        if (val.image_url.indexOf('missing.png') > 0) {
            val.image_url = default_image_url;
        }
        // French Image
        if (val.image_url2.indexOf('missing.png') > 0) {
            if (val.image_url.indexOf('missing.png') > 0) {
                val.image_url2 = default_image_url;
            } else {
                val.image_url2 = val.image_url;
            }
        }
            
        // English Description
        if (val.body &&val.body.length > 200){
            val.description_short = val.body.substring(0,200) + "...";
        } else {
            val.description_short = val.body
        }
        // French Description
        if (val.body_2 && val.body_2.length > 200){
            val.description_short_2 = val.body_2.substring(0,200) + "...";
        } else {
            val.description_short_2 = val.body_2
        }
        
        val.description_short = val.description_short.replace("&amp;", "&");
        val.description_short_2 = val.description_short_2.replace("&amp;", "&");
        
        var published = moment(val.publish_date).tz(getPropertyTimeZone());
        var published_fr = moment(published).locale('fr');
        if(Cookies.get('current_locale') == "en-CA"){
            val.published_on = published.format("MMM DD, YYYY");
        }
        if(Cookies.get('current_locale') == "fr-CA"){
            val.published_on = published_fr.format('ll');
        }

        var rendered = Mustache.render(template_html,val);
        item_rendered.push(rendered);
    });
    
    $(container).show();
    $(container).html(item_rendered.join(''));
}

function renderPostDetails(container, template, collection, blog_posts){
    var item_list = [];
    var item_rendered = [];
    var template_html = $(template).html();
    $.each(collection , function( key, val ) {
        // English Image
        if (val.image_url.indexOf('missing.png') > 0) {
            val.show_img = "display: none"
        }
        // French Image
        if (val.image_url2.indexOf('missing.png') > 0) {
            if (val.image_url.indexOf('missing.png') > 0) {
                val.show_img = "display: none"
            } else {
                val.image_url2 = val.image_url;
            }
        }
        
        // English Description
        if (val.body.length > 200){
            val.description_short = val.body.substring(0,200) + "...";
        } else {
            val.description_short = val.body
        }
        // French Description
        if (val.body_2.length > 200){
            val.description_short_2 = val.body_2.substring(0,200) + "...";
        } else {
            val.description_short_2 = val.body_2
        }

        var published = moment(val.publish_date).tz(getPropertyTimeZone());
        var published_fr = moment(published).locale('fr');
        if(Cookies.get('current_locale') == "en-CA"){
            val.published_on = published.format("MMM DD, YYYY");
        }
        if(Cookies.get('current_locale') == "fr-CA"){
            val.published_on = published_fr.format('ll');
        }
        
        var rendered = Mustache.render(template_html,val);
        item_rendered.push(rendered);
    });
    
    $(container).html(item_rendered.join(''));
}

function renderPromotions(container, template, collection, mall_name){
    var item_list = [];
    var item_rendered = [];
    var template_html = $(template).html();
    Mustache.parse(template_html); 
    $.each( collection , function( key, val ) {
        if (val.promotionable_type == "Store") {
            var store_details = getStoreDetailsByID(val.promotionable_id);
            val.store_detail_btn = store_details.slug ;
            val.store_name = store_details.name;
            val.store_show = "display: inline-block";
            val.mall_show = "display: none";

            // English Image
            if (val.promo_image_url_abs.indexOf('missing.png') > -1){
                if (store_details.store_front_url_abs.indexOf('missing.png') > 0) {
                    val.promo_image_url_abs = default_image_url;
                } else {
                    val.promo_image_url_abs = store_details.store_front_url_abs;
                }
            }
            // French Image
            if (val.promo_image2_url_abs.indexOf('missing.png') > -1){
                if (val.promo_image_url_abs.indexOf('missing.png') > -1){
                    if (store_details.store_front_url_abs.indexOf('missing.png') > 0) {
                        val.promo_image_url_abs = default_image_url;
                    } else {
                        val.promo_image_url_abs = store_details.store_front_url_abs;
                    }
                } else {
                    val.promo_image2_url_abs = val.promo_image_url_abs;
                }
            }
        
            val.store_slug = "/stores/" + store_details.slug
        } else {
            val.store_name = mall_name;
            val.store_slug = "/"
            val.store_show = "display:none;";
            val.mall_show = "display: inline-block";
            
            // English Image
            if (val.promo_image_url_abs.indexOf('missing.png') > -1){
                val.promo_image_url_abs = default_image_url;
            }
            // French Image
            if (val.promo_image2_url_abs.indexOf('missing.png') > -1){
                if (val.promo_image_url_abs.indexOf('missing.png') > -1){
                    val.promo_image2_url_abs = default_image_url;
                } else {
                    val.promo_image2_url_abs = val.promo_image_url_abs;
                }
            }
        }
        
        // English Description
        if (val.description.length > 200){
            val.description_short = val.description.substring(0,200) + "...";
        } else {
            val.description_short = val.description
        }
        // French Description
        if (val.description_2 && val.description_2.length > 200){
            val.description_short_2 = val.description_2.substring(0,200) + "...";
        } else {
            val.description_short_2 = val.description_2
        }
        
        var show_date = moment(val.show_on_web_date);
        var start = moment(val.start_date).tz(getPropertyTimeZone());
        var end = moment(val.end_date).tz(getPropertyTimeZone());
        var french_start = moment(start).locale('fr-ca');
        var french_end = moment(end).locale('fr-ca');
        if (start.format("DMY") == end.format("DMY")){
            if(Cookies.get('current_locale') == "en-CA"){
                val.dates = start.format("MMM D");
            }
            if(Cookies.get('current_locale') == "fr-CA"){
                val.dates = french_start.format("DD MMM");
            }
        } else {
            if(Cookies.get('current_locale') == "en-CA"){
                val.dates = start.format("MMM D") + " - " + end.format("MMM D");
            }
            if(Cookies.get('current_locale') == "fr-CA"){
                val.dates = french_start.format("DD MMM") + " - " + french_end.format("DD MMM");
            }
        }
        
        var rendered = Mustache.render(template_html,val);
        item_rendered.push(rendered);
    });
    $(container).html(item_rendered.join(''));
}

function renderPromoDetails(container, template, collection, mall_name){
    var item_list = [];
    var item_rendered = [];
    var template_html = $(template).html();
    Mustache.parse(template_html); 
    item_list.push(collection);
    $.each( item_list , function( key, val ) {
        if (val.promotionable_type == "Store") {
            var store_details = getStoreDetailsByID(val.promotionable_id);
            val.store_detail_btn = store_details.slug ;
            val.store_name = store_details.name;
            val.store_slug = store_details.slug
            val.store_show = "display:block";
            
            if (store_details.store_front_url_abs.indexOf('missing') > 0) {
                val.store_image = default_image_url;
            } else {
                val.store_image = store_details.store_front_url_abs;
            }
            if (store_details.website != null && store_details.website.length > 0){
                val.show = "display:block";
                val.website = store_details.website
            } else {
                val.show = "display:none";
            }
            
            if (store_details.phone != null && store_details.phone.length > 0){
                val.phone_show = "display:block";
                val.phone = store_details.phone
            } else {
                val.phone_show = "display:none";
            }
            
            // English Image
            if (val.promo_image_url_abs.indexOf('missing.png') > 0){
                val.show_img = "display: none"
            } else {
                val.image_url = val.promo_image_url_abs;
            }
            // French Image
            if (val.promo_image2_url_abs.indexOf('missing.png') > 0){
                if (val.promo_image_url_abs.indexOf('missing.png') > 0){
                    val.show_img = "display: none"
                } else {
                    val.image_url = val.promo_image_url_abs;
                }
            } else {
                val.image_url = val.promo_image2_url_abs;
            }
        } else {
            val.store_name = mall_name;
            val.store_image = default_image_url;
            val.store_show = "display:none";
            val.phone_show = "display:none";
            val.show = "display:none";
            
            // English Image
            if (val.promo_image_url_abs.indexOf('missing.png') > 0){
                val.show_img = "display: none"
            } else {
                val.image_url = val.promo_image_url_abs;
            }
            // French Image
            if (val.promo_image2_url_abs.indexOf('missing.png') > 0){
                if (val.promo_image_url_abs.indexOf('missing.png') > 0){
                    val.show_img = "display: none"
                } else {
                    val.image_url = val.promo_image_url_abs;
                }
            } else {
                val.image_url = val.promo_image2_url_abs;
            }
        }

        var show_date = moment(val.show_on_web_date);
        var start = moment(val.start_date).tz(getPropertyTimeZone());
        var end = moment(val.end_date).tz(getPropertyTimeZone());
        var french_start = moment(start).locale('fr-ca');
        var french_end = moment(end).locale('fr-ca');
        if (start.format("DMY") == end.format("DMY")){
            if(Cookies.get('current_locale') == "en-CA"){
                val.dates = start.format("MMM D");
            }
            if(Cookies.get('current_locale') == "fr-CA"){
                val.dates = french_start.format("DD MMM");
            }
        } else {
            if(Cookies.get('current_locale') == "en-CA"){
                val.dates = start.format("MMM D") + " - " + end.format("MMM D");
            }
            if(Cookies.get('current_locale') == "fr-CA"){
                val.dates = french_start.format("DD MMM") + " - " + french_end.format("DD MMM");
            }
        }
        
        var rendered = Mustache.render(template_html,val);
        item_rendered.push(rendered);
    });
    $(container).html(item_rendered.join(''));
}

function renderStoreList(container, template, collection, starter, breaker){
    var item_list = [];
    var item_rendered = [];
    var template_html = $(template).html();
    Mustache.parse(template_html);   // optional, speeds up future uses
    var store_initial="";
    $.each( collection , function( key, val ) {
        if(!val.store_front_url ||  val.store_front_url.indexOf('missing.png') > -1 || val.store_front_url.length === 0){
            val.alt_store_front_url = "";
        } else {
            val.alt_store_front_url = getImageURL(val.store_front_url);    
        }
        
        if(val.categories != null){
            try {
                val.cat_list = val.categories.join(',');
            } catch(err) {
                console.log(err);
            }
        }
        
        var current_initial = val.name[0];
        if(store_initial.toLowerCase() == current_initial.toLowerCase()){
            val.initial = "";
            val.show = "display:none;";
        } else {
            val.initial = current_initial;
            store_initial = current_initial;
            val.show = "display:block;";
        }
        
        if (val.promotions != null){
            val.promotion_exist = "display:inline-block";
        } else {
            val.promotion_exist = "display:none";
        }
        
        if (val.jobs != null){
            val.job_exist = "display:inline-block";
        } else {
            val.job_exist = "display:none";
        }
        
        val.block = current_initial + '-block';
        var rendered = Mustache.render(template_html,val);
        var upper_current_initial = current_initial.toUpperCase();
        if (upper_current_initial.charCodeAt(0) <= breaker.charCodeAt(0) && upper_current_initial.charCodeAt(0) >= starter.charCodeAt(0)){
            item_rendered.push(rendered);
        }
    });
    $(container).html(item_rendered.join(''));
}

function renderStoreDetails(container, template, collection, slug){
    var item_list = [];
    var item_rendered = [];
    var template_html = $(template).html();
    Mustache.parse(template_html);   // optional, speeds up future uses
    item_list.push(collection);
    $.each( item_list , function( key, val ) {
        if ((val.store_front_url_abs).indexOf('missing.png') > 0){
            val.store_front_url_abs = default_image_url;
        }
        
        if (val.store_front_alt_url_abs.indexOf('missing.png') > 0) {
            val.show_store_front = "display: none"
        }
        if (val.website != null && val.website.length > 0){
            val.show = "display:block";
        } else {
            val.show = "display:none";
        }
        
        if (val.phone != null && val.phone.length > 0){
            val.phone_show = "display:block";
        } else {
            val.phone_show = "display:none";
        }
        
        val.map_x_coordinate = val.x_coordinate - 19;
        val.map_y_coordinate = val.y_coordinate - 58;
        var rendered = Mustache.render(template_html,val);
        item_rendered.push(rendered);
    });
    $(container).html(item_rendered.join(''));
}