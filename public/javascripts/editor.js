$(document).ready(function(){
    $('#sendCode').click(function(){
        $.ajax({
            url: "/compile",
            method: 'POST',
            data: {
                code: $('#code').val()
            },
            success: function(data){
                location.href = data.url;
            }
        });
    });
});