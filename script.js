$(document).ready(function() {
  let quizData = [];
  let currentQuestion = 0;
  let score = 0;
  let numQuestions = 3;

  function loadQuestions(topic) {
    $.getJSON(`${topic}.json`, function(data) {
      // Randomize Questions before loading
      quizData = shuffleArray(data).slice(0, numQuestions);
      loadQuestion();
    });
  }

  function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }

  function loadQuestion() {
    const currentQuizData = quizData[currentQuestion];
    $("#question").text(`${currentQuestion + 1}. ${currentQuizData.question}`);
    $("#choices").empty();

    $.each(currentQuizData.choices, function(index, choice) {
      $("#choices").append(
        `<div class="choice-card flex items-center mb-2 choice${index}">
           <div class="flex items-center justify-center mr-4">
             <input type="radio" name="answer" value="${index}" id="choice${index}">
           </div>
           <label for="choice${index}" class="w-full text-3xl cursor-pointer flex-grow">${choice}</label>
           <div class="ml-auto"></div>
         </div>`
      );
    });
  }

  function submitAnswer() {
    const selectedAnswer = $('input[name="answer"]:checked').val();
    if (!selectedAnswer) return;

    const answerIndex = parseInt(selectedAnswer);
    const correctAnswer = quizData[currentQuestion].correctAnswer;

    if (answerIndex === correctAnswer) {
      score++;
      // Add CheckMark for the correctAnswer
      $(`.choice${correctAnswer} .ml-auto`).append('<span class="text-green-500">&#10003;</span>');
    } else {
      // Add CrossMark for the wrongAnswer
      $(`.choice${answerIndex} .ml-auto`).append('<span class="text-red-500">&#10007;</span>');
      // Add CheckMark for the correctAnswer
      $(`.choice${correctAnswer} .ml-auto`).append('<span class="text-green-500">&#10003;</span>');
    }

    $('input[type="radio"]').prop("disabled", true);
    $("#submit").hide();
    $("#next").show();
  }

  function nextQuestion() {
    currentQuestion++;

    if (currentQuestion < quizData.length) {
      loadQuestion();
      $("#submit").show();
      $("#next").hide();
    } else {
      showResult();
    }
  }

  function showResult() {
    $("#quiz").hide();
    $("#result").show();
    $("#result").html(`
      <div class="result p-8 rounded-lg bg-slate-150 shadow-lg">
        <h2 class="text-3xl font-bold mb-4 text-center">Quiz Completed!</h2>
        <p class="text-lg mb-4 text-center">Your score: ${score} out of ${quizData.length}</p>
      </div>
      <div class="flex justify-center pt-6">
        <button id="restart" class="bg-[#5c94a6cf] hover:bg-[#5c94a6] text-white font-bold py-2 px-4 rounded text-3xl">Home</button>
      </div
    `);
    $("#restart").on("click", function() {
      location.reload();
    });
  }

  $("#startQuiz").on("click", function(e) {
    e.preventDefault(); // Prevent form submission
    numQuestions = parseInt($("#numQuestions").val());
    let topic_title = $("#topic").find('option:selected').text();
    let topic_val = $("#topic").val();
    console.log("Text: ", topic);
    console.log("Label: ", topic_val);
    if (isNaN(numQuestions) || numQuestions < 1 || numQuestions > 10) {
      alert("Please enter a number between 1 and 10.");
      return;
    }
    updateTitle(topic_title);
    $("#start").hide();
    $("#quiz").show();
    $("#submit").show();
    loadQuestions(topic_val);
  });

  $("#submit").on("click", submitAnswer);
  $("#next").on("click", nextQuestion);

  // Add click event listener to choice cards
  $("#choices").on("click", ".choice-card", function() {
    const choiceIndex = $(this).find("input[type='radio']").val();
    const isDisabled = $(`#choice${choiceIndex}`).prop("disabled");
    if (!isDisabled) {
      $(`#choice${choiceIndex}`).prop("checked", true);
    }
  });

  function updateTitle(topic) {
    const topicName = topic ? topic.charAt(0).toUpperCase() + topic.slice(1) : "Welcome";
    $("nav h1").text(`${topicName}`);
  }

  // Update title on page load
  updateTitle();
});
