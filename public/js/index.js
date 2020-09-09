
// This code is used to make table row clickable
$(document).ready(function($) {
    $(".table-row").click(function() {
        window.document.location = $(this).data("href");
    });

    $('#customSwitch1').on('change', function() {
      $("#toggleEndDate").toggleClass("d-none");
  })
  

  $('#runTest').on('click', function() {
    $.blockUI({ css: {
                border: 'none', 
                padding: '5px', 
                'background-color': 'transparent', 
                '-webkit-border-radius': '10px', 
                '-moz-border-radius': '10px', 
                opacity: .6, 
                color: '#fff',
                },
              message: '<div class="spinner-border" style="width: 5rem; height: 5rem;" role="status"><span class="sr-only">Loading...</span> </div>' 
            });
  });

  $("form").submit(function() {
    $(this).submit(function() {
        return false;
    });
    return true;
});
 

    var date = new Date();
    var stDate = new Date(date.getFullYear(), date.getMonth(), date.getDate()-180);
    var edDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());

      $('#fromDate').datetimepicker({
        format: 'YYYY-MM-DD',
        minDate: stDate,
        maxDate:edDate,
        useCurrent: false,
        ignoreReadonly: true
      });
        $('#toDate').datetimepicker({
            useCurrent: false,
            format: 'YYYY-MM-DD',
            maxDate:edDate,
            ignoreReadonly: true
        });
        $("#fromDate").on("change.datetimepicker", function (e) {
            $('#toDate').datetimepicker('minDate', e.date);
        });    
      
});



