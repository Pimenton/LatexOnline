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
    
    function getLatexFormatTitle(mode, text)
    {
        switch(mode)
        {
            case "title":
                return "\n\\title{"+text+"}"
                break;
            case "authors":
                return "\n\\author{"+text+"}"
                break;
            case "useDate":
                if (text != "")
                    return "\n\\date{"+text+"}"
                return ""
                break;
            case "noUseDate":
                return "\n\\date{}"
                break;
        }
    }

    function deleteTitleOfText()
    {
        if ($("#code").val().indexOf("maketitle") != -1)
        {
            var firstPosition = $("#code").val().indexOf("begin{document}") + "begin{document}".length;
            var lastPosition = $("#code").val().indexOf("maketitle") + "maketitle".length;
            var text = $("#code").val().substring(0,firstPosition) + $("#code").val().substring(lastPosition,$("#code").val().length);
            $("#code").val(text);
        }
    }

    $('#btnAddTitle').click(function()
    {
        $('#modalAddTitle').modal('hide');
        deleteTitleOfText();
        var position = ($("#code").val().indexOf("begin{document}")) + parseInt("begin{document}".length);
        var title = getLatexFormatTitle("title", $("#input_titleDoc").val());
        var authors = getLatexFormatTitle("authors", $("#input_authors").val());
        var date = ""
        var modeDate;
        if($("#checkbox_date").prop('checked'))
        {
            modeDate = "useDate"
        }
        else 
        {
            modeDate = "noUseDate"
        }
        date = getLatexFormatTitle(modeDate, date);
        var text = $("#code").val().substring(0,position) + title + authors + date + "\n\\maketitle" + $("#code").val().substring(position, $("#code").val().length);
        $("#code").val(text);
    });
});