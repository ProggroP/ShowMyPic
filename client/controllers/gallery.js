var Gallery = {
	
	currentUser : null,

	getImages:function(user) {
		var that = this;
		this.currentUser = user;
		$.ajax({
		   url:'server/controllers/users.json',
		   data: "user="+user,
		   method:'GET',
		   success:function(response){
		      that.insertImages(JSON.parse(response));
		   }
		});
	},

	insertImages: function (response) {
		var that = this;
		Pixebble.options.galleryContainer.html('');
		$.each(response, function(i,data) {
			if(data.name === null ) {
				Pixebble.options.galleryContainer.html('<p>There are no recent uplaods for the user "' + data.user + '"</p>');
			} else {
				var $galleryElement = $(Templates.get("galleryElement", data));
				Pixebble.options.galleryContainer.append($galleryElement);
				$galleryElement.on("click", function(e){ that.clickThumbnailImage(e,$galleryElement); });
			}
		});
	},

	addImage: function(imageData) {
		var that = this;
		var $galleryElement = $(Templates.get("galleryElement",imageData));
		Pixebble.options.galleryContainer.append($galleryElement);
		$galleryElement.on("click", function(e){ that.clickThumbnailImage(e,$galleryElement); });
	},

	deleteImage: function(imageName, deleteAll) {
		var that = this;
		if(confirm("Delete Image ?")) {
			$.ajax({
			   url:'server/controllers/delete_image.php',
			   type:'POST',
			   data: {name : imageName },
			   success:function(response){
			   	console.log("Gallery: Image deleted");
			   	that.getImages(that.currentUser);
			   }
			});	
		}
	},

	clickThumbnailImage: function(e,thumbnail) {
		if($(e.target).is('a'))
			return;

		var imageName = thumbnail.data("name");
		var userName = thumbnail.data("user");
		$.ajax({
		   url:'server/controllers/rename_image.php',
		   type:'POST',
		   data: {name: imageName, user: userName },
		   success: function(response){
			var imageElement = document.createElement("img");
			imageElement.setAttribute("src", "data/uploads/"+imageName+".png");
			$(ImagesUpload.dropzone.previewsContainer).html(imageElement);
		   }
		});
	}

}