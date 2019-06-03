//instead of use  $(document).ready(function(){})
// ... we can use the next way to invoke the execution
// ...of our script after loading the page
// ...you have to make the script in the end of the body
// ... and don't forget to call the methode init
//...of the object moviesApp at the end 



let moviesApp = {}

// define a var to  host the db data
moviesApp.database = [];

moviesApp.loadAssests = function () {
    $.getJSON('db/movies.json', function (data) {
        moviesApp.database = data
        // call now the method init 
        moviesApp.init()
    })
}


moviesApp.init = function () {
    moviesApp.filterSlider();
    moviesApp.getTypes();
    moviesApp.getDirectors();
    moviesApp.generateMarkup();

}

moviesApp.filterSlider = function () {
    $('.filter.open').on('click', function () {
        $('.filter-container').stop().slideToggle('300', function () {
            let btn = $(this).prev()

            if (btn.hasClass('active')) {
                $('.filter.open').find('.btn-title').text('Filter By')
                btn.removeClass('active')
            } else {
                $('.filter.open').find('.btn-title').text('Close')
                btn.addClass('active')
            }
        })
    })
}

// get the types of all the data in the db

moviesApp.getTypes = function () {
    let types = [];

    $.each(moviesApp.database, function (index, elem) {
        // test if the types array contains already that type
        // ...to not get a duplicated types
        if ($.inArray(elem.type, types)) {
            let typeValue = elem.type;
            types.push(typeValue)

            $(`<option>${typeValue}</option>`).appendTo('#categories')
            // $('#categories').append(`<option>${typeValue}</option>`)
        }
    })
}

moviesApp.getDirectors = function () {
    let directors = [];
    $.each(moviesApp.database, function (index, elem) {
        if ($.inArray(elem.director, directors)) {
            let directorValue = elem.director;
            directors.push(directorValue);
            $(`<option>${directorValue}</option>`).appendTo('#directors')
        }
    })
}


// generate Markup function
moviesApp.generateMarkup = function () {
    let template = '';
    let db = moviesApp.database;

    $.each(db, function (index, elem) {
        template = `<div class="movie-item" data-id=${elem.id}>
					<div class="header">
						<div class="header-left">
							<img src="db/movies/${elem.img}" alt="movie_img">
						</div>
						<div class="header-right">
							<h3>${elem.title}</h3>
							<div class="node">
								<span>Year : </span>${elem.year}
							</div>
							<div class="node">
								<span>Director : </span>${elem.director}
							</div>
							<div class="node">
								<span>Type : </span>${elem.type}
							</div>
							<div class="show-desc">See description</div>
						</div>
					</div>
					<div class="description">
						<strong>Description</strong> ${elem.desc}
					</div>
				</div>`

        $('.movies-content').append(template);
    })

    moviesApp.showDescription();
    moviesApp.startFilter();
}

moviesApp.showDescription = function () {
    $('.show-desc').on('click', function () {
        let $this = $(this) /* to use this later to point on the show-desc */
        let parent = $(this).parents().eq(2);
        let element = parent.find('.description');

        element.slideToggle(300, function () {

            if ($this.hasClass('active')) {
                $this.text('See Description').removeClass('active')
            } else {
                $this.text('Hide Description').addClass('active')
            }
        })
    })
}


// filter by the director and the action type

moviesApp.startFilter = function () {
    $('select').on('change', function () {
        let db = moviesApp.database;
        let selectedType = $('#categories').val();
        let selectedDirector = $('#directors').val();
        let moviesToDisplay = [];

        $.each(db, function (index, movie) {
            if (movie.type === selectedType) {
                moviesToDisplay.push(movie.id)
            }
            if (movie.director === selectedDirector) {
                moviesToDisplay.push(movie.id)
            }

        })

        if (moviesToDisplay.length === 0) {
            $('.movie-item').show();
        }else{
            let uniqueMoviesToDisplay=[];
            $.each(moviesToDisplay, function(index, movie){
                if($.inArray(movie, uniqueMoviesToDisplay) === -1) uniqueMoviesToDisplay.push(movie)
            })
            // console.log(uniqueMoviesToDisplay)
            $('.movie-item').hide()
            $.each(uniqueMoviesToDisplay, function(index, idMovie){
                $(`div[data-id=${idMovie}]`).show()
            })
        }



    })
}




moviesApp.loadAssests()