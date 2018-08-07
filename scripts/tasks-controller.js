tasksController = function () {

  var taskPage;
  var initialised = false;

  function errorLogger ( errorCode, errorMessage ) {

    console.log (errorCode + ': ' + errorMessage );

  }

  function taskCountChanged() {

    var count = $(taskPage).find('#tblTasks tbody tr').length;
    $('footer').find('#taskCount').text(count);

  }

  return {

    init: function (page, callback) {

      if (initialised) {

        callback();

      } else {

        taskPage = page;

        storageEngine.init ( 'task', function () {

        }, errorLogger);

        $(taskPage).find('[required="required"]').prev('label').append('<span>*</span>').children('span').addClass('required');
        $(taskPage).find('tbody tr:even').addClass('even');

        $(taskPage).find('#btnAddTask').click(function(evt) {
          evt.preventDefault();
          $('#taskCreation').removeClass('not');
        });

        $(taskPage).find('#saveTask').click(function(evt) {

          evt.preventDefault();

          if ($(taskPage).find('form').valid()) {

            var task = $('form').toObject();

            storageEngine.save ( 'task', task, function ( savedTask ) {

              $( taskPage ).find ( '#tblTasks tbody' ).empty ();

              tasksController.loadTasks();

              $( ':input' ).val ( '' );

              $( taskPage ).find ( '#taskCreation' ).addClass ( 'not' );

            }, errorLogger );
          }
        });

        $(taskPage).find('tbody tr').click(function(evt) {
          $(evt.target).closest('td').siblings().addBack().toggleClass('rowHighlight');
        });

        $(taskPage).find('#tblTasks tbody').on('click', '.deleteRow', function(evt) {

          storageEngine.delete ( 'task', $(evt.target).data().taskId, function () {

            $(evt.target).parents('tr').remove();
            taskCountChanged();

          }, errorLogger);
        });

        $(taskPage).find ( '#tblTasks tbody' ).on ( 'click', '.editRow', function ( evt ) {

          $(taskPage).find ( '#taskCreation' ).removeClass ( 'not' );

          storageEngine.findById ( 'task', $( evt.target ).data ().taskId, function (task) {

            $ ( taskPage ).find ( 'form' ).fromObject ( task );

          }, errorLogger );
        });

        initialised = true;
        //console.log(this.name)
      }
    },

    loadTasks : function () {

      storageEngine.findAll ( 'task', function (tasks) {

        $.each ( tasks, function ( index, task ) {

          $( '#taskRow' ).tmpl ( task ).appendTo ($ ( taskPage ).find ( '#tblTasks tbody'));

        });

        //console.log(this.name);
        taskCountChanged();
      }, errorLogger);
    }
  }
}();
