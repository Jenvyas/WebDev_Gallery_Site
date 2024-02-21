
//#596e48
//#8da174
//#a4b38d
//#b8c9a1
//#f3f3f3
//#ffffff

function createGallery(gallery_items){
    let gallery = document.createElement('div');
    gallery.classList.add('gallery');

    let gallery_elements = gallery_items.filter(item=>item.attachments[0])
        .map(item=>createGalleryItem(item.attachments[0].url,item.author.username))

    return gallery_elements;
}

function validateForm() {
    let email = document.forms["emailForm"]["email"].value;
    console.log(document.forms["emailForm"]);
    if(email == ""){
        alert("Email field must be filled out");
        return false;
    }
    if(!/\S+@\S+\.\S+/.test(email)){
        alert("Invalid email has been entered");
        return false;
    }
}

function createGalleryItem(img_src,username){
    let wrapper = document.createElement('article');
    wrapper.classList.add('gallery-item');
    let image = document.createElement('img');
    wrapper.addEventListener('click',displayImageModal);
    image.width = 400;
    image.height = 400;
    image.src = img_src;
    image.alt = "gallery image";
    wrapper.appendChild(image);
    return wrapper;
}


function displayImageModal(e){
    document.body.style.overflow = "hidden";
    let image_src = e.target.src;
    modal.style.display = 'flex';
    let img = modal.querySelector("#modal_image");
    img.src = image_src;
}

function validateRange(from,until){
	let validatedRange = {
		error:false,
		is_from_range:true,
		is_until_range:true,
	}

	if(from==="")
		validatedRange.is_from_range=false;
	if(until==="")
		validatedRange.is_until_range=false;

	let from_num = Number(from);
	let until_num = Number(until);

	if ((validatedRange.is_until_range&&validatedRange.is_from_range)
	&&((isNaN(from_num)&&isNaN(until_num)) 
	|| (!Number.isInteger(from_num)&&!Number.isInteger(until_num)) 
	|| (from_num<1 && until_num<1)))
		return{
			error:true,
			error_text:"Both month range inputs must be positive integers."
		};
	
	if(validatedRange.is_from_range && (isNaN(from_num) || !Number.isInteger(from_num) || from_num<1))
		return{
			error:true,
			error_text:"The month from input must be a positive integer."
		};
	if(validatedRange.is_until_range && (isNaN(until_num) || !Number.isInteger(until_num) || until_num<1))
		return{
			error:true,
			error_text:"The month until input must be a positive integer."
		};
	if((validatedRange.is_until_range&&validatedRange.is_from_range)&&(from_num>until_num))
		return{
			error:true,
			error_text:"The until input must be larger than the from input"
		}

	if (validatedRange.is_from_range)
		validatedRange["from_range"]=from_num;
	if (validatedRange.is_until_range)
		validatedRange["until_range"]=until_num;

	return validatedRange;
}

var modal;


document.addEventListener('DOMContentLoaded',()=>{
    var lore_articles = document.querySelectorAll('.lore-article');
    var view_height = window.innerHeight;
    var gallery = document.getElementById('gallery');
    var gallery_image_container = document.querySelector(".gallery");
    modal = document.getElementById('modal');

    modal.querySelector('.modal-close').addEventListener('click',()=>{
        modal.style.display='none';
        document.body.style.overflow = "auto";
    })

    $('#drop-down-button').on('click',function(){
        $('#navigation').toggleClass('show-side-nav');
        $(this).toggleClass('button-active');
    })

    window.addEventListener("resize", () => {
        view_height=window.innerHeight;
        if(screen.width<=480){
            document.getElementById("header").style.top='0';
        }else if(document.documentElement.scrollTop<=20){
            document.getElementById("header").style.top='-60px';
        }
    });

    $(window).scroll(()=>{
        let scroll_top=$(this).scrollTop();
        if(scroll_top > 20 || screen.width<=480){
            $('header').css('top','0');
        }else{
            $('header').css('top','-60px');
        }
        $('#title_screen').css({
            opacity: ()=>{
                let height = $(this).height()
                return (height-scroll_top)/height;    
            }
        });

        for (article of lore_articles) {
            let heading = article.firstElementChild;
            let heading_bottom = heading.getBoundingClientRect().bottom;
            if (view_height>=heading_bottom) {
                heading.classList.add("seen-heading");
                article.classList.add("article-seen");
            }
        }
        if(gallery.getBoundingClientRect().top<=view_height){
            gallery.firstElementChild.classList.add('seen-heading');
            $('.gallery').addClass('gallery-seen');
        }
    });

    window.addEventListener('click',(event)=>{
        if(event.target==modal){
            modal.style.display='none';
            document.body.style.overflow = "auto";
        }
    })

    gallery_image_container.replaceChildren(...createGallery(gallery_items_data));

    let filter_dropdown_button = document.getElementById('filter_dropdown_button');


    filter_dropdown_button.addEventListener('click',()=>{
        $('#filter_dropdown').toggleClass('hidden');
        filter_dropdown_button.classList.toggle('active');
    })



    let filter_button = document.getElementById('filter');

    let authors = [document.getElementById('Lars-checkbox'),document.getElementById('piens-checkbox'),document.getElementById('stereotypical-checkbox')];

    let month_from = document.getElementById('month_from');
    let month_until = document.getElementById('month_until');

    filter_button.addEventListener('click',()=>{
        if(!authors[0].checked && !authors[1].checked && !authors[2].checked){
            alert('No authors were selected!');
            return false;
        };

        let filtered_items = gallery_items_data;

        for(i of authors){
            if(!i.checked) {filtered_items=filtered_items.filter(item=>item.author.username!==i.value)}
        }

        validated_range = validateRange(month_from.value,month_until.value);

        if (validated_range.error) {
            alert(validated_range.error_text);
            return false;
        }

        if (validated_range.is_from_range)
            filtered_items = filtered_items.filter(item=>new Date(item.timestamp).getMonth()>=validated_range.from_range-1);

		if (validated_range.is_until_range)
            filtered_items = filtered_items.filter(item=>new Date(item.timestamp).getMonth()<=validated_range.until_range-1);

        gallery_image_container.replaceChildren(...createGallery(filtered_items));
    })
});
