$(document).ready(() => {
  
});

$('#uploadForm').submit(e => {
    //e.preventDefault();
    $.ajax({
        url : '/upload',
        type : 'POST',
        data: new FormData($('#uploadForm')[0]),
        cache: false,
        contentType: false,
        processData: false,
        xhr: function () {
            var myXhr = $.ajaxSettings.xhr();
            if (myXhr.upload) {
              // For handling the progress of the upload
              myXhr.upload.addEventListener('progress', function (e) {
                if (e.lengthComputable) {
                  $('.progress').attr({
                    value: e.loaded,
                    max: e.total,
                  });
                  $('.progress-bar').css('width', (e.loaded / e.total) * 100 +'%');
                }
              }, false);
            }
            return myXhr;
          }
    });
});

$('.select-button').click(e => {
  console.log(e.target.innerText);
  var text = e.target.innerText;
  window.location.replace(`/get/${text}`);
  $.ajax({
    url: `/get/${text}`,
    type: 'GET',
    success: function(res){
      
    }
  });
});

$('.delete-button').click(e => {
  var text = $(e.target).closest('.list-section').find('.contents')[0].innerText;
  console.log(text);
  $.ajax({
    url: `/delete/${text}`,
    type: 'POST',
    success: function(res){
      window.location.replace(`/`);
    }
  })
});