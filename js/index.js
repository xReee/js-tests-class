import {Monstro} from './LogicaJogo/Monstro.js';
import {Jogo} from './LogicaJogo/Jogo.js';
import {Jogador} from './LogicaJogo/Jogador.js';
import {Ataque} from './LogicaJogo/Ataque.js';
import {Modal} from './Interface/Modal.js';


var password = [];
var userPassword = [0, 1, 2, 3];
var answer = [];
var lifeNumber = 3;
var monsterNumber = 5;
var rightAnwsers = 0;
var rightColorWrongPositions = 0;

var monstro = new Monstro();
var jogador = new Jogador(5);
var jogo = new Jogo(monstro, jogador);

var changeTool = function(elem) {
  deslockutton();
  var id = parseInt($(elem).attr("id").replace('n','')) - 1;
  var arrayWithoutOldValue = userPassword.filter(item => item !== id)
  var newPassword = userPassword[id]
  var shouldContinue = true;

  while (shouldContinue) {
    newPassword++;
    if (newPassword > 5) newPassword = 0;
    if (!arrayWithoutOldValue.includes(newPassword)) {
      userPassword[id] = newPassword;
      shouldContinue = false;
    }
  }
  userPassword[id] = newPassword 
  $(elem).children('#tool').attr("src","reset-assets/tools/arma"+ userPassword[id]+".svg");
  blink(elem);
}

function blink(elem) {
  $(elem).fadeTo('fast', 0.2).fadeTo('fast', 1.0);
}

function test() {
  checkPassword(false);
  lockButtons();
  addGame();
  if (rightAnwsers != 4) {
    blink($("#monster"));
    monsterNumber--;
  } 
  if (monsterNumber == 0) {
    $('#testButton').unbind('click', test);
    $('#testButton').css({ opacity: 0.1});
  }
  updateMenuNumbers();
}

function atack() {
  addGame();
  lockButtons();
  checkPassword(true);
  if (rightAnwsers != 4) {
    lifeNumber--;
    blink($("#heart"));

    if (lifeNumber == 0) {
      lostGame();
   } else if (monsterNumber == 0) {
      resetTests();
    }
    updateMenuNumbers();
  } else {
    winGame();
  }
}

function lockButtons() {
  $('#testButton').prop("disabled",true);
  $('#testButton').css({ opacity: 0.1});
  $(".shouldSelectTool").css({ opacity: 1});
}

function deslockutton(){
  if (monsterNumber != 0) {
    $('#testButton').prop("disabled",false);
    $('#testButton').css({ opacity: 1});
    $(".shouldSelectTool").css({ opacity: 0});
  }
}

function checkPassword(isAtack) {
  var novoAtaque = new Ataque(password);
  novoAtaque.conferirAtaque(monstro.defesa);
  speak(novoAtaque.armasCorretasNaPosicaoCorreta, novoAtaque.armasCorretasNaPosicaoErrada, isAtack);
}

function speak(rightAnwsers, rightColorWrongPositions, isAtack) {
  if (isAtack == true) {
    $(".speach").text("Hehe! Você errou, perdeu 1 ponto de vida! Agora você só tem mais " + (lifeNumber - 1) + " de vida!");
    $(".speach").addClass('bubble-bottom-right').removeClass('bubble-bottom-left');
  } else {
    $(".speach").addClass('bubble-bottom-left').removeClass('bubble-bottom-right');
    if (rightAnwsers != 4) {
      var rightAnwsersLabel = " arma na posição correta";
      var rightColorWrongPositionsLabel = " arma correta está no slot errado";
      if (rightAnwsers != 1) rightAnwsersLabel = " armas nas posições corretas";
      if (rightColorWrongPositions != 1) rightColorWrongPositionsLabel = " armas corretas estão no slot errado!";
      $(".speach").html("<b>Resultado do teste</b>: você acertou " + rightAnwsers + rightAnwsersLabel + "! Tirando isso, " + 
                        rightColorWrongPositions + rightColorWrongPositionsLabel);
    } else {
      $(".speach").html("UAUUUU! <b>Você acertou todas!</b> Você já pode atacar!")
    }
  }
  
}

function updateMenuNumbers() {
  $(".monster-number").text(monsterNumber);
  $(".life-number").text(lifeNumber);
}

function resetTools() {
  for (var i = 1; i <= 4; i++) {
    $("#n" + i).children('#tool').attr("src","reset-assets/tools/arma"+ userPassword[i - 1] +".svg");
  }
}

function winGame() {
  Modal.fimJogoMostrarResultado(true);
  resetGame();
}

function lostGame() {
  Modal.fimJogoMostrarResultado(false);
  resetGame();
}

function resetGame() {
  rightAnwsers = 0
  userPassword = [0, 1, 2, 3];
  answer = [];
  updateMenuNumbers();
  resetTools();
  resetTests();
  resetSpeach()
  $(".gameplay").html("");
  $(".shouldSelectTool").css({ opacity: 0});
}

function resetSpeach() {
  $(".speach").html("Hmm.. melhor testar primeiro!");
  $(".speach").addClass('bubble-bottom-left').removeClass('bubble-bottom-right');
}

function resetTests() {
  monsterNumber = 5;
  $("#testButton").bind('click', test);
  $('.testButton').css({ opacity: 1});
}

function checkGameplay() {
  Modal.show('#modal-gameplay');
}

function addGame() {
  $(".gameplay").append(`
          <div class="row results">
                <div class="div-transparent"></div>
                <h4>Corretos: `+ rightAnwsers +` • Corretos na posição errada: `+ rightColorWrongPositions +` • Jogada:</h4>
                <span class="col-md-2 gameplay-slot"><img id="tool" src="reset-assets/tools/arma`+ userPassword[0]+`.svg"></span>
                <span class="col-md-2 gameplay-slot"><img id="tool" src="reset-assets/tools/arma`+userPassword[1]+`.svg"></span>
                <span class="col-md-2 gameplay-slot"><img id="tool" src="reset-assets/tools/arma`+userPassword[2]+`.svg"></span>
                <span class="col-md-2 gameplay-slot"><img id="tool" src="reset-assets/tools/arma`+userPassword[3]+`.svg"></span>
          </div>
    `);
}

$(document).keypress(function(event){
  var keycode = (event.keyCode ? event.keyCode : event.which);
  console.log(keycode);
  if(keycode == '97') {
    Modal.show("#modal-tutorial");
  }
});

$(document).ready(function() {
  resetGame();
  configurarBotoes();
  Modal.show("#modal-tutorial");
});

function configurarBotoes() {
  $(".slot").click(function() {
    changeTool(this);
  });

  $("#atackButton").click(atack);
  $("#jogadas").click(checkGameplay);
}