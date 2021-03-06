$(function(){

    setupSpinner();
    setupFrameworkList();
    setupExtensions();
    enableExtensions();
    $('#submit').on('click', function(e){
        e.preventDefault();
        $('#sol_title').text('Solution:');
        $('.sol_list').empty();
        uploadFile();
    });

    $('#submitAddArgument').on('click', function(e){
        e.preventDefault();
        $('#sol_title').text('Solution:');
        $('.sol_list').empty();
        addArgument();
    });

    $('#submitAddAttack').on('click', function (e) {
        e.preventDefault();
        $('#sol_title').text('Solution:');
        $('.sol_list').empty();
        addAttack();
    })

    $('#newFramework').on('click', function (e) {
        e.preventDefault();
        $('#sol_title').text('Solution:');
        $('.sol_list').empty();
        createNewFramework();
    })
});

var is_framework = false;
var frameworks = ['a0', 'af1', 'af2', 'af3', 'af4', 'af5', 'af6'];
var extensions = ['Complete', 'Stable', 'Preferred'];
var selected_extension = '';
var cy;

function setupFrameworkList() {
    var myList = $('#example_frameworks');

    $.each(frameworks, function (i) {
        var aa = $('<a/>')
            .addClass('dropdown-item')
            .attr('id', frameworks[i])
            .text(frameworks[i])
            .appendTo(myList);
    });

    $('#example_frameworks a').click(function () {
        $('.sol_list').empty();
        $.post('/framework/' + this.id, function (data) {
            renderFramework($.parseJSON(data));
        });
    });
}

function renderFramework(data)
{
    console.log(data);
    var json = data
    cy = cytoscape({
        container: $('#cy'),
        style: [
            {
                selector: '.node_sol',
                style: {
                    'background-color': 'green',
                    'color': 'white',
                }
            },
            {
                selector: 'node',
                style: {
                    'label': 'data(label)',
                    'border': 'grey',
                    'labelValign': 'center',
                    'labelHalign': 'center',
                    'text-halign': 'center',
                    'text-valign': 'center',
                }
            },
            {
                selector: 'edge',
                style: {
                    'curve-style': 'bezier',
                    'width': 3,
                    'line-color': '#ccc',
                    'target-arrow-color': '#ccc',
                    'target-arrow-shape': 'triangle'
                }
            }

        ]
    });

    $.each(json['arguments'], function(i, obj) {
        console.log(obj['name'])
        cy.add({
            data: {
                id: obj['name'],
                label: obj['name']
            }
        });
    });

    $.each(json['arguments'], function(i, obj) {
        $.each(obj['attacks'], function(j, attack) {
            cy.add({
                data: {
                    id: 'edge_' + obj['name'] + '_' + attack + '_' + i + j,
                    source: obj['name'],
                    target: attack,
                }
            });
        })
    });

    cy.layout({
        name: 'cola',
            infinite: true,
            fit: false,
    });

    is_framework = true;
    enableExtensions();
    console.log(cy)
}

function enableExtensions()
{
    if (is_framework)
    {
        $('.ext_element').removeClass('disabled');
    }
    else
    {
        $('.ext_element').addClass('disabled');
    }
}

function setupExtensions()
{
    var myList = $('#extensions');
    $.each(extensions, function (i) {
        var aa = $('<a/>')
            .text(extensions[i])
            .attr('id', extensions[i])
            .addClass('ext_element')
            .addClass('dropdown-item')
            .appendTo(myList);
    });

    $('#extensions a').click(function () {
        cy.$('.node_sol').removeClass('node_sol');
        selected_extension = this.id;
        $.post('/extension/' + this.id, function (data) {
            var jsonReturn = $.parseJSON(data);

            $('#sol_title').text('Solution: ' + selected_extension + ' extensions')

            $('.sol_list').empty();

            $.each(jsonReturn, function(i, item) {
                $('<a/>')
                    .text(item)
                    .addClass('list-group-item')
                    .addClass('list-group-item-action')
                    .addClass('solution_item')
                    .attr('id', 'solution' + i)
                    .appendTo($('.sol_list'));
            })

            $('.solution_item').click(function()
            {
                cy.$('.node_sol').removeClass('node_sol');

                var sol = $('#' + this.id).text().split(',');
                $.each(sol, function(i, item)
                {
                    cy.$('#' + item).addClass('node_sol');
                })
            })
        });
    });
}

function setupSpinner()
{
    var $loading = $('.loadingDiv').hide();
    $(document).ajaxStart(function() {
        $loading.show();
    })
        .ajaxStop(function(){
            $loading.hide();
        })
}

function uploadFile()
{
    var formData = new FormData($('#myForm')[0]);
    for (var [key, value] of formData.entries()) {
      console.log(key, value);
    }
    $.ajax({
        type: 'POST',
        data: formData,
        url: '/upload_file',
        contentType: false,
        processData: false,
        dataType: 'json'
    }).done(function(data, textStatus, jqXHR){
        $('#myModal').modal('toggle');
        renderFramework(data);
    });
}

function addArgument()
{
    $.ajax({
        type: 'GET',
        url: '/addArgument/' + $('#addArgumentValue').val(),
        dataType: 'json'
    }).done(function(data, textStatus, jqXHR){
        $('#modalAddArgument').modal('toggle');
        renderFramework(data);
    });
}

function addAttack()
{
    $.ajax({
        type: 'GET',
        url: '/addAttack/' + $('#addAttacker').val() + '/' + $('#addAttacked').val(),
        dataType: 'json'
    }).done(function(data, textStatus, jqXHR){
        $('#modalAddAttack').modal('toggle');
        renderFramework(data);
    });
}

function createNewFramework() {
    $.ajax({
        type: 'GET',
        url: '/newFramework'
    }).done(function(data){
        console.log(data)
        renderFramework(data);
    });
}