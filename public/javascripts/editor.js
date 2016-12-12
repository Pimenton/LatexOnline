$(document).ready(function(){
    $('#sendCode').click(function(){
        var tree = generateTree('parteFija').concat(generateTree('parteMovil'));
        console.log(tree);
        $.ajax({
            url: "/compile",
            method: 'POST',
            data: {
                tree: tree
            },
            success: function(data){
               window.open(location.href+data.url, 'Download');
            }
        });
    });

    function getImages(child){
        var ret = [];
        var images = $(child).children('img');
        for (var i=0; i<images.length; i++){
            ret.push($(images[i]).attr('id'));
        }
        return ret;
    }

    function generateTree(id, info){
        var childs = $('#'+id).children('.latex_element');
        var ret = [];
        for (var i=0; i<childs.length; i++){
            var child = $(childs[i]);
            var info = child.data('args');
            info.images = getImages(child);
            info.childs = generateTree(child.attr('id'));
            ret.push(info);
        }
        return ret;
    }

    $( function() {
        $( "#input_date" ).datepicker({ dateFormat: 'MM d, yy'}).datepicker("setDate", new Date());
        $( "#format" ).on( "change", function() {
            $( "#input_date" ).datepicker( "option", "dateFormat", $( this ).val() );
        });
    });

    var subsectionId = 0;
    $('#btnAddSubsection').click(function(){
        var newId = subsectionId++;
        newId += '_subsection'

        if(subSectionEditing != "")
        {
            newId = subSectionEditing;
        }

        $('#modalAddsubsection').modal('hide');
        var title = $("#input_subsectionTitle").val();
        var text = $("#input_subsectionContent").val();

        var data = {kind: 'subsection', title: title, text: text};

        var specialPart = "<h1>"+title+"</h1>"+text

        var html = "<div id='"+newId+"' class='latex_element well'  draggable='true' ondragstart='drag(event)'>"+
                "<div class='cont_label_well'><span class='label_well'>Subsection</span></div>"+
                "<div id='sectionHTML_"+newId+"'>"+
                specialPart +
                "</div><br><br>"+
                "<div class='btn-group'>" +
                    "<button type='button' class='btn btn-default editSubsection' data-id='"+ newId +"' data-toggle='modal' data-target='#modalAddsubsection' title='Edit'>" +
                        "<span class='glyphicon glyphicon-pencil' aria-hidden='true'></span>" +
                    "</button>"+
                    "<button type='button' class='btn btn-default btn-ms addsubsubsection' data-id='"+ newId +"' title='Add subsubsection'>"+
                        "<span class='glyphicon glyphicon-plus ' ></span> Add subsubsection "+
                    "</button>"+
                    "<button type='button' class='btn btn-danger delete' data-id='"+ newId +"'>" +
                        "<span class='glyphicon glyphicon-trash' aria-hidden='true' title='Delete'></span>" +
                    "</button>"+
                "</div><br><br>"+
            "</div>"
        if(subSectionEditing != "")
        {
            $('#sectionHTML_'+newId).html(specialPart);
        }
        else $('#'+pwd).append(html);
        subSectionEditing = "";
        pwd = "";
        $('#'+newId).data('args', data);
        bind();
    });

    var subsubsectionId = 0;
    $('#btnAddSubsubsection').click(function(){
        var id = subsubsectionId++;
        id += '_subsubsection'
        if (subSectionEditing != "") id = subSectionEditing

        $('#modalAddSubsubsection').modal('hide');
        var title = $("#input_subsubsectionTitle").val();
        var text = $("#input_subsubectionContent").val();

        var data = {kind: 'subsubsection', title: title, text: text};

        var specialPart = "<h1>"+title+"</h1>"+text;
        var html = 
            "<div id='"+id+"' class='latex_element well' draggable='true' ondragstart='drag(event)'>"+
            "<div class='cont_label_well'><span class='label_well'>Subsubsection</span></div>"+
                "<div id='sectionHTML_"+id+"'>"+
                specialPart+
                "</div>"+
                "<br><br><div class='btn-group'>"+
                "<button type='button' class='btn btn-default editSubsubsection' data-toggle='modal' data-id='"+ id +"' title='Edit'>" +
                    "<span class='glyphicon glyphicon-pencil' aria-hidden='true'></span>" +
                "</button>"+
                "<button type='button' class='btn btn-danger delete' data-id='"+ id +"' title='Delete'>" +
                    "<span class='glyphicon glyphicon-trash' aria-hidden='true' ></span>" +
                "</button>"+
            "</div><br><br></div>";
        if (subSectionEditing != "") $('#sectionHTML_'+id).html(specialPart);
        else $('#'+pwd).append(html)
        
        subSectionEditing = ""
        pwd = ""
        $('#'+id+'').data('args', data);
        bind();
    });

    function refresh(){
        $.ajax({
            url: '/images',
            success: function(data){
                $('#images').html('');
                for (var i=0; i<data.length; i++){
                    $('#images').append('<img class="img_content" draggable="true" ondragstart="drag(event)" margin="5px" width="50px" height="50px" id="'+data[i]+'" src="/images/'+data[i]+'" />');
                }
            }
        })
    }
    refresh();

    $('#refresh').click(refresh);
});

var pwd;
var subSectionEditing = "";
function bind() {
    $('.delete').unbind();
    $('.delete').click(function () {
        var id = $(this).data('id');
        $('#' + id).remove();
    });

    $('.addsubsection').unbind();
    $('.addsubsection').click(function(){
        pwd = $(this).data('id');
        $('#modalAddsubsection').modal('show')
    });

    $('.addsubsubsection').unbind();
    $('.addsubsubsection').click(function(){
        pwd = $(this).data('id');
        $('#modalAddSubsubsection').modal('show')
    });

    $('.editSection').unbind();
    $('.editSection').click(sectionEdit);

    $('.editSubsection').unbind();
    $('.editSubsection').click(function()
    {
        //if u use .modal('show'), it fails
        $('#modalAddsubsection').show();
        var id = $(this).data('id');
        var element = $('#'+ id);
        var args = element.data('args');

        $("#input_subsectionTitle").val(args.title);
        $("#input_subsectionContent").val(args.text);
        subSectionEditing = id
    });

    $('.editSubsubsection').unbind();
    $('.editSubsubsection').click(function()
    {
        $('#modalAddSubsubsection').modal('show');
        var id = $(this).data('id');
        var element = $('#'+ id);
        var args = element.data('args');

        $("#input_subsubsectionTitle").val(args.title);
        $("#input_subsubsectionContent").val(args.text);
        subSectionEditing = id
    });
}

//DRAG AND DROP

function allowDrop(ev) {
    ev.preventDefault();
    $('#'+ev.target.id).css('border-color', 'black');

}

function disallowDrop(ev) {
    ev.preventDefault();
    $('#'+ev.target.id).css('border-color', 'rgb(220, 220, 220)');

}

function drag(ev) {
    ev.dataTransfer.setData("text", ev.target.id);
}

function drop(ev) {
    ev.preventDefault();
    var data = ev.dataTransfer.getData("text");

    if (data.indexOf('_subsub') > -1)
    {
        if (ev.target.id.indexOf('_subsub') > -1)
            $('#'+data).insertAfter($('#'+ev.target.id));

        else if (ev.target.id.indexOf('_sub') > -1 && ev.target.id.indexOf('_subsub') < 0)
            $('#'+data).appendTo($('#'+ev.target.id));
    }
    else if (data.indexOf('_sub')>-1)
    {
        if (ev.target.id.indexOf('_sub') > -1 && ev.target.id.indexOf('_subsub') < 0)
            $('#'+data).insertAfter($('#'+ev.target.id));

        else if (ev.target.id.indexOf('_section') > -1 && ev.target.id.indexOf('_sub') < 0)
            $('#'+data).appendTo($('#'+ev.target.id));
    }
    else if (data.indexOf('_section')>-1) {
        if (ev.target.id.indexOf('_section') > -1)
            $('#'+data).insertAfter($('#'+ev.target.id));
    }
    else if(data.indexOf('image')>-1){
        $('#'+ev.target.id).append(document.getElementById(data).cloneNode(true));

        $('#document .img_content').unbind();
        $('#document .img_content').click(function(){
            $(this).remove();
        });
    }

    $('#'+ev.target.id).css('border-color', 'rgb(220, 220, 220)');
}