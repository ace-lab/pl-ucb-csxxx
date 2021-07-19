/* eslint-env jquery, browser */

var ParsonsGlobal = {
  /*
   * When form is submitted, capture the state of the student's solution.
   * For now we only submit the actual code, NOT the original metadata of where the blanks were etc.
   */
  submitHandler: function() {
    $('#student-parsons-solution').val(ParsonsGlobal.widget.solutionCode()[0]);
  },

  /* When blanks are filled in adjust their length */
  adjustBlankWidth: function() {
    $(this).width( this.value.length.toString() + 'ch');
  },

  /* 
   * Initialize the widget.  Code that goes in left-hand box will be in
   * the hidden form field  named 'code-lines'. 
   * For now, no logging of events is done.
   */
  setup: function() {
    ParsonsGlobal.widget = new ParsonsWidget({
      'sortableId': 'parsons-solution',
      'onSortableUpdate': (event, ui) => {}, // normally would log this event here.
      'trashId': 'starter-code',
      'max_wrong_lines': 1,
      'syntax_language': 'lang-py' // lang-rb and other choices also acceptable
    });
    ParsonsGlobal.widget.init($('#code-lines').val());
    ParsonsGlobal.widget.alphabetize();  // this should depend on attribute settings
    // when blanks are filled, adjust their width
    $('input.text-box').on('input', ParsonsGlobal.adjustBlankWidth);
    // when form submitted, grab the student work and put it into hidden form fields
    $('form.question-form').submit(ParsonsGlobal.submitHandler);
  }
}

$(document).ready(ParsonsGlobal.setup);

